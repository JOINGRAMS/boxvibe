'use client'

import { useState, useEffect } from 'react'
import type { PortionSize, DashboardMealType } from '@boxvibe/db'
import { Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MealTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portionSizes: PortionSize[]
  editingMealType: DashboardMealType | null
  onSave: (data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }) => Promise<{ success: boolean; error?: string }>
  onDelete?: () => void
}

export function MealTypeDialog({
  open,
  onOpenChange,
  portionSizes,
  editingMealType,
  onSave,
  onDelete,
}: MealTypeDialogProps) {
  const isEditing = !!editingMealType

  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [selectedPortionIds, setSelectedPortionIds] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<1 | 2>(1)
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      if (editingMealType) {
        setName(editingMealType.label_en)
        setNameAr(editingMealType.label_ar)
        const portionIds = new Set(editingMealType.portions.map(p => p.portion_size_id))
        setSelectedPortionIds(portionIds)
        const priceMap: Record<string, string> = {}
        editingMealType.portions.forEach(p => {
          priceMap[p.portion_size_id] = String(Number(p.base_price))
        })
        setPrices(priceMap)
      } else {
        setName('')
        setNameAr('')
        setSelectedPortionIds(new Set(portionSizes.map(p => p.id)))
        const defaultPrices: Record<string, string> = {}
        portionSizes.forEach(p => { defaultPrices[p.id] = '0.00' })
        setPrices(defaultPrices)
      }
      setStep(1)
      setError(null)
    }
  }, [open, editingMealType, portionSizes])

  const togglePortionSize = (id: string) => {
    setSelectedPortionIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedPortionIds(new Set(portionSizes.map(p => p.id)))
  }

  const isStep1Valid = name.trim().length > 0 && selectedPortionIds.size > 0
  const selectedPortions = portionSizes.filter(p => selectedPortionIds.has(p.id))

  const handleNext = () => {
    if (!isStep1Valid) return
    const newPrices = { ...prices }
    selectedPortions.forEach(p => {
      if (!(p.id in newPrices)) newPrices[p.id] = '0.00'
    })
    setPrices(newPrices)
    setStep(2)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const portionPrices = selectedPortions.map(p => ({
      portion_size_id: p.id,
      base_price: Number(prices[p.id] || 0),
    }))
    const result = await onSave({ label_en: name.trim(), label_ar: nameAr.trim(), portionPrices })
    setSaving(false)
    if (result.success) onOpenChange(false)
    else setError(result.error ?? 'Failed to save')
  }

  const hasRemovedPortions = isEditing && editingMealType.portions.some(
    p => !selectedPortionIds.has(p.portion_size_id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-[16px] font-semibold text-gray-900">
            {isEditing ? 'Edit meal type' : 'Add meal type'}
          </DialogTitle>
          <p className="mt-0.5 text-[13px] text-gray-400">
            {step === 1 ? 'Prices are added in the next step' : 'The base price for each portion size'}
          </p>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="text-[12px] font-medium text-gray-500">Step 1</span>
          </div>
          <div className="mx-3 h-px flex-1 bg-gray-200" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              2
            </div>
            <span className="text-[12px] font-medium text-gray-500">Step 2</span>
          </div>
        </div>

        {/* ─── Step 1 ────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="px-6 pb-0">
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Breakfast"
                  className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-gray-700">
                    Portion sizes available for this meal type
                  </label>
                  <button
                    onClick={selectAll}
                    className="text-[12px] font-medium text-gray-500 hover:text-gray-700"
                  >
                    Select all
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {portionSizes.map(ps => {
                    const isSelected = selectedPortionIds.has(ps.id)
                    return (
                      <button
                        key={ps.id}
                        onClick={() => togglePortionSize(ps.id)}
                        className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                          isSelected
                            ? 'bg-gray-900 text-white'
                            : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {ps.name_en} · {ps.calories} kcal
                      </button>
                    )
                  })}
                </div>
              </div>

              {hasRemovedPortions && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-[13px] font-semibold text-amber-800">Be careful</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-amber-700">
                    Removing a portion size will immediately deactivate every package that includes it.
                    Changes applied here or to the subscribers, and you still have to add meals
                    adapting these portion sizes.
                  </p>
                </div>
              )}
            </div>

            {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

            <div className="flex items-center justify-between border-t border-gray-100 py-4 mt-5">
              <div>
                {isEditing && onDelete && (
                  <button
                    onClick={onDelete}
                    className="text-[13px] font-medium text-red-500 hover:text-red-600"
                  >
                    Delete meal type
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2 ────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="px-6 pb-0">
            <table className="w-full">
              <thead>
                <tr className="text-[12px] font-medium text-gray-400">
                  <th className="pb-3 text-left">Portion size</th>
                  <th className="pb-3 text-left">Calories</th>
                  <th className="pb-3 text-right">Base price ($)</th>
                </tr>
              </thead>
              <tbody>
                {selectedPortions.map((ps, i) => (
                  <tr key={ps.id} className={i < selectedPortions.length - 1 ? 'border-b border-gray-50' : ''}>
                    <td className="py-3 text-[13px] text-gray-700">{ps.name_en}</td>
                    <td className="py-3 text-[13px] text-gray-400">{ps.calories}</td>
                    <td className="py-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={prices[ps.id] || ''}
                        onChange={e => setPrices(prev => ({ ...prev, [ps.id]: e.target.value }))}
                        className="ml-auto block h-8 w-20 rounded-lg border border-gray-200 bg-white px-2.5 text-right text-[13px] text-gray-700 outline-none placeholder:text-gray-300 focus:border-gray-400"
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Info */}
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-[12px] font-medium text-gray-600">About base pricing</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                  This is the starting price for the meal. The final cost varies based on the
                  selected diet and its price adjustment in{' '}
                  <span className="font-medium text-emerald-600">Diets</span>. Check the exact price for
                  each package and diet combination when creating a package.
                </p>
              </div>
            </div>

            {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 border-t border-gray-100 py-4 mt-4">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create type'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
