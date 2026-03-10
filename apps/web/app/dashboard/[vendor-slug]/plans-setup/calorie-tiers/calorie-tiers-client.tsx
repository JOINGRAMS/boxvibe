'use client'

import { useState, useMemo } from 'react'
import type { CalorieTier, PortionSize, DashboardMealType } from '@boxvibe/db'
import { Plus, Sparkles, Trash2, Info, Package } from 'lucide-react'
import { saveCalorieTiersAction } from './actions'

interface CalorieTiersClientProps {
  vendorId: string
  vendorSlug: string
  initialTiers: CalorieTier[]
  portionSizes: PortionSize[]
  mealTypes: DashboardMealType[]
}

type TierRow = {
  tempId: string
  name_en: string
  name_ar: string
  /** meal_type_id → portion_size_id */
  assignments: Record<string, string>
}

function generateTempId() {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Auto-generate calorie tiers by progressively assigning larger portion sizes.
 * Only uses portion sizes that are actually assigned to each meal type.
 * Main meals (lunch, dinner) scale up first, then breakfast, then snacks.
 */
function autoGenerateTiers(
  mealTypes: DashboardMealType[],
  portionSizes: PortionSize[],
  mealTypePortionsMap: Record<string, PortionSize[]>,
  tierCount: number = 5
): TierRow[] {
  if (portionSizes.length === 0 || mealTypes.length === 0) return []

  // Prioritize main meals for scaling (lunch, dinner first, then breakfast, then snacks)
  const priority = (mt: DashboardMealType) => {
    const key = mt.key.toLowerCase()
    if (key.includes('lunch')) return 0
    if (key.includes('dinner')) return 1
    if (key.includes('breakfast')) return 2
    return 3 // snacks
  }

  const orderedMealTypes = [...mealTypes].sort((a, b) => priority(a) - priority(b))

  const tiers: TierRow[] = []

  for (let tierIdx = 0; tierIdx < tierCount; tierIdx++) {
    const assignments: Record<string, string> = {}

    for (const mt of orderedMealTypes) {
      // Only use portion sizes allowed for this meal type
      const allowed = mealTypePortionsMap[mt.id] ?? []
      if (allowed.length === 0) continue

      const count = allowed.length
      // Higher priority meals scale faster
      const priorityBoost = priority(mt) <= 1 ? 0.3 : 0
      const rawIdx = (tierIdx / Math.max(tierCount - 1, 1)) * (count - 1) + priorityBoost
      const portionIdx = Math.min(Math.round(rawIdx), count - 1)

      assignments[mt.id] = allowed[portionIdx].id
    }

    // Calculate total calories for naming
    const totalCal = orderedMealTypes.reduce((sum, mt) => {
      const psId = assignments[mt.id]
      const ps = portionSizes.find(p => p.id === psId)
      return sum + (ps?.calories ?? 0)
    }, 0)

    tiers.push({
      tempId: generateTempId(),
      name_en: `Tier ${tierIdx + 1} (~${totalCal} kcal)`,
      name_ar: '',
      assignments,
    })
  }

  return tiers
}

export function CalorieTiersClient({
  vendorId,
  vendorSlug,
  initialTiers,
  portionSizes,
  mealTypes,
}: CalorieTiersClientProps) {
  // Convert initial data to TierRow format
  const initialRows: TierRow[] = initialTiers.map(t => ({
    tempId: t.id,
    name_en: t.name_en,
    name_ar: t.name_ar,
    assignments: Object.fromEntries(t.meals.map(m => [m.meal_type_id, m.portion_size_id])),
  }))

  const [tiers, setTiers] = useState<TierRow[]>(initialRows)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [previewMeals, setPreviewMeals] = useState<Set<string>>(new Set(mealTypes.map(mt => mt.id)))

  const sortedPortions = useMemo(
    () => [...portionSizes].sort((a, b) => a.calories - b.calories),
    [portionSizes]
  )

  const portionMap = useMemo(
    () => Object.fromEntries(portionSizes.map(p => [p.id, p])),
    [portionSizes]
  )

  // Map each meal type to its allowed portion sizes (from meal_type_portion_prices)
  const mealTypePortions = useMemo(() => {
    const map: Record<string, PortionSize[]> = {}
    for (const mt of mealTypes) {
      const allowedIds = new Set(mt.portions.map(p => p.portion_size_id))
      map[mt.id] = sortedPortions.filter(ps => allowedIds.has(ps.id))
    }
    return map
  }, [mealTypes, sortedPortions])

  const hasMealTypes = mealTypes.length > 0
  const hasPortions = portionSizes.length > 0
  const canConfigure = hasMealTypes && hasPortions

  // Compute calorie range for a tier given selected meals
  const getTierCalories = (tier: TierRow, selectedMealIds: Set<string>): number => {
    let total = 0
    for (const mtId of selectedMealIds) {
      const psId = tier.assignments[mtId]
      if (psId && portionMap[psId]) {
        total += portionMap[psId].calories
      }
    }
    return total
  }

  // Preview: calorie ranges for each tier based on selected meals
  const previewRanges = useMemo(() => {
    return tiers.map(tier => {
      const cal = getTierCalories(tier, previewMeals)
      // Show as a range (±10%)
      const margin = Math.round(cal * 0.08)
      return { min: cal - margin, max: cal + margin }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiers, previewMeals, portionMap])

  const handleAutoGenerate = () => {
    const generated = autoGenerateTiers(mealTypes, portionSizes, mealTypePortions, 5)
    setTiers(generated)
    setHasChanges(true)
  }

  const addTier = () => {
    const assignments: Record<string, string> = {}
    mealTypes.forEach(mt => {
      const allowed = mealTypePortions[mt.id] ?? []
      if (allowed.length > 0) {
        assignments[mt.id] = allowed[0].id
      }
    })
    setTiers(prev => [...prev, {
      tempId: generateTempId(),
      name_en: `Tier ${prev.length + 1}`,
      name_ar: '',
      assignments,
    }])
    setHasChanges(true)
  }

  const removeTier = (tempId: string) => {
    setTiers(prev => prev.filter(t => t.tempId !== tempId))
    setHasChanges(true)
  }

  const updateTierName = (tempId: string, name: string) => {
    setTiers(prev => prev.map(t =>
      t.tempId === tempId ? { ...t, name_en: name } : t
    ))
    setHasChanges(true)
  }

  const updateAssignment = (tempId: string, mealTypeId: string, portionSizeId: string) => {
    setTiers(prev => prev.map(t =>
      t.tempId === tempId
        ? { ...t, assignments: { ...t.assignments, [mealTypeId]: portionSizeId } }
        : t
    ))
    setHasChanges(true)
  }

  const togglePreviewMeal = (mtId: string) => {
    setPreviewMeals(prev => {
      const next = new Set(prev)
      if (next.has(mtId)) next.delete(mtId)
      else next.add(mtId)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await saveCalorieTiersAction(
      vendorId,
      vendorSlug,
      tiers.map((t, i) => ({
        name_en: t.name_en,
        name_ar: t.name_ar,
        sort_order: i,
        meals: Object.entries(t.assignments).map(([meal_type_id, portion_size_id]) => ({
          meal_type_id,
          portion_size_id,
        })),
      }))
    )
    setSaving(false)
    if (result.success) {
      setHasChanges(false)
      window.location.reload()
    } else {
      setError(result.error ?? 'Failed to save')
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Prerequisites check */}
      {!canConfigure && (
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
              <Package className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
              Set up prerequisites first
            </h3>
            <p className="mt-1 max-w-sm text-center text-[13px] text-gray-400">
              {!hasPortions && 'You need to create portion sizes in Pricing & Portions first. '}
              {!hasMealTypes && 'You need to create meal types in Pricing & Portions first.'}
            </p>
          </div>
        </section>
      )}

      {canConfigure && (
        <>
          {/* Actions bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoGenerate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                Auto-generate tiers
              </button>
              <button
                onClick={addTier}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add tier
              </button>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTiers(initialRows)
                    setHasChanges(false)
                  }}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save tiers'}
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}

          {/* Empty state */}
          {tiers.length === 0 && (
            <section className="rounded-xl border border-gray-200 bg-white">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                  <Package className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
                  No calorie tiers yet
                </h3>
                <p className="mt-1 max-w-sm text-center text-[13px] text-gray-400">
                  Use &quot;Auto-generate&quot; for smart defaults, or add tiers manually
                </p>
              </div>
            </section>
          )}

          {/* Tiers grid */}
          {tiers.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-[12px] font-medium text-gray-400">
                      <th className="px-4 py-3 text-left">Tier</th>
                      {mealTypes.map(mt => (
                        <th key={mt.id} className="px-3 py-3 text-left">{mt.label_en}</th>
                      ))}
                      <th className="px-3 py-3 text-right">Total kcal</th>
                      <th className="w-10 px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => {
                      const totalCal = mealTypes.reduce((sum, mt) => {
                        const ps = portionMap[tier.assignments[mt.id]]
                        return sum + (ps?.calories ?? 0)
                      }, 0)

                      return (
                        <tr key={tier.tempId} className="border-b border-gray-50 last:border-0">
                          {/* Tier name */}
                          <td className="px-4 py-3">
                            <input
                              value={tier.name_en}
                              onChange={e => updateTierName(tier.tempId, e.target.value)}
                              className="h-8 w-full min-w-[140px] rounded-lg border border-gray-200 bg-white px-2.5 text-[13px] text-gray-700 outline-none focus:border-gray-400"
                            />
                          </td>

                          {/* Portion size selectors — only show portions assigned to this meal type */}
                          {mealTypes.map(mt => {
                            const allowed = mealTypePortions[mt.id] ?? []
                            return (
                              <td key={mt.id} className="px-3 py-3">
                                {allowed.length > 0 ? (
                                  <select
                                    value={tier.assignments[mt.id] ?? ''}
                                    onChange={e => updateAssignment(tier.tempId, mt.id, e.target.value)}
                                    className="h-8 w-full min-w-[100px] rounded-lg border border-gray-200 bg-white px-2 text-[12px] text-gray-700 outline-none focus:border-gray-400"
                                  >
                                    {allowed.map(ps => (
                                      <option key={ps.id} value={ps.id}>
                                        {ps.name_en} ({ps.calories})
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-[11px] text-gray-300">No portions</span>
                                )}
                              </td>
                            )
                          })}

                          {/* Total */}
                          <td className="px-3 py-3 text-right">
                            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-medium text-gray-700">
                              {totalCal} kcal
                            </span>
                          </td>

                          {/* Delete */}
                          <td className="px-3 py-3">
                            <button
                              onClick={() => removeTier(tier.tempId)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Live preview */}
          {tiers.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-[14px] font-semibold text-gray-900">Store Preview</h3>
              <p className="mt-0.5 text-[12px] text-gray-400">
                See how calorie ranges change based on which meals the customer selects
              </p>

              {/* Meal toggles */}
              <div className="mt-4 flex flex-wrap gap-2">
                {mealTypes.map(mt => {
                  const isSelected = previewMeals.has(mt.id)
                  return (
                    <button
                      key={mt.id}
                      onClick={() => togglePreviewMeal(mt.id)}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                        isSelected
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {mt.label_en}
                    </button>
                  )
                })}
              </div>

              {/* Calorie range chips */}
              {previewMeals.size > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {previewRanges.map((range, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-center"
                    >
                      <p className="text-[14px] font-semibold text-gray-900">
                        {range.min} - {range.max}
                      </p>
                      <p className="text-[11px] text-gray-400">kcal/day</p>
                    </div>
                  ))}
                </div>
              )}

              {previewMeals.size === 0 && (
                <p className="mt-4 text-[12px] text-gray-400">Select at least one meal to see ranges</p>
              )}

              {/* Info */}
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-[12px] font-medium text-gray-600">How it works on the store</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                    When a customer selects which meals they want daily, the store sums up the portion size calories for only their selected meals. Each tier produces a different calorie range, so adding or removing a meal shifts all the ranges dynamically.
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
