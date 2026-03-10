'use client'

import { useState } from 'react'
import type { PortionSize, DashboardMealType } from '@boxvibe/db'
import { Pencil, GripVertical, ChevronDown, ChevronUp, Plus, ArrowUpDown } from 'lucide-react'
import { EditPortionsDialog } from './edit-portions-dialog'
import { MealTypeDialog } from './meal-type-dialog'
import { DeleteMealTypeDialog } from './delete-meal-type-dialog'
import {
  savePortionSizes,
  createMealTypeAction,
  updateMealTypeAction,
  deleteMealTypeAction,
  reorderMealTypesAction,
} from './actions'

interface PricingPortionsClientProps {
  vendorId: string
  vendorSlug: string
  initialPortionSizes: PortionSize[]
  initialMealTypes: DashboardMealType[]
}

export function PricingPortionsClient({
  vendorId,
  vendorSlug,
  initialPortionSizes,
  initialMealTypes,
}: PricingPortionsClientProps) {
  const [portionSizes] = useState(initialPortionSizes)
  const [mealTypes, setMealTypes] = useState(initialMealTypes)

  // Dialog states
  const [portionsDialogOpen, setPortionsDialogOpen] = useState(false)
  const [mealTypeDialogOpen, setMealTypeDialogOpen] = useState(false)
  const [editingMealType, setEditingMealType] = useState<DashboardMealType | null>(null)
  const [deletingMealType, setDeletingMealType] = useState<DashboardMealType | null>(null)

  // Reorder mode
  const [reorderMode, setReorderMode] = useState(false)
  const [reorderedTypes, setReorderedTypes] = useState<DashboardMealType[]>([])

  // Expanded meal types
  const [expandedMealTypes, setExpandedMealTypes] = useState<Set<string>>(new Set())

  const hasPortionSizes = portionSizes.length > 0

  const toggleExpanded = (id: string) => {
    setExpandedMealTypes(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ─── Handlers ────────────────────────────────────────────────────────

  const handleSavePortions = async (
    portions: Array<{
      id?: string
      name_en: string
      name_ar: string
      symbol: string
      calories: number
    }>
  ) => {
    const sorted = portions
      .map((p, i) => ({ ...p, sort_order: i }))
      .sort((a, b) => a.calories - b.calories)
      .map((p, i) => ({ ...p, sort_order: i }))

    const result = await savePortionSizes(vendorId, vendorSlug, sorted)
    if (result.success) window.location.reload()
    return result
  }

  const handleCreateMealType = async (data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }) => {
    const result = await createMealTypeAction(vendorId, vendorSlug, data)
    if (result.success) window.location.reload()
    return result
  }

  const handleUpdateMealType = async (data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }) => {
    if (!editingMealType) return { success: false, error: 'No meal type selected' }
    const result = await updateMealTypeAction(editingMealType.id, vendorSlug, data)
    if (result.success) window.location.reload()
    return result
  }

  const handleDeleteMealType = async () => {
    if (!deletingMealType) return
    const result = await deleteMealTypeAction(deletingMealType.id, vendorSlug)
    if (result.success) window.location.reload()
  }

  const startReorder = () => {
    setReorderedTypes([...mealTypes])
    setReorderMode(true)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...reorderedTypes]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setReorderedTypes(next)
  }

  const moveDown = (index: number) => {
    if (index === reorderedTypes.length - 1) return
    const next = [...reorderedTypes]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setReorderedTypes(next)
  }

  const saveReorder = async () => {
    const orderedIds = reorderedTypes.map(mt => mt.id)
    const result = await reorderMealTypesAction(vendorId, vendorSlug, orderedIds)
    if (result.success) {
      setMealTypes(reorderedTypes)
      setReorderMode(false)
    }
  }

  const cancelReorder = () => {
    setReorderMode(false)
    setReorderedTypes([])
  }

  const getPortionPrice = (mealType: DashboardMealType, portionSizeId: string) => {
    return mealType.portions.find(p => p.portion_size_id === portionSizeId)?.base_price
  }

  const displayMealTypes = reorderMode ? reorderedTypes : mealTypes

  return (
    <div className="mt-8 space-y-6">
      {/* ─── Section 1: Portion Sizes & Calories ──────────────────────── */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">
              Portion sizes and calories
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-400">
              Portion sizes dictate how many calories a meal has
            </p>
          </div>
          {hasPortionSizes && (
            <button
              onClick={() => setPortionsDialogOpen(true)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {hasPortionSizes ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {portionSizes.map(ps => (
                <span
                  key={ps.id}
                  className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-[13px] text-gray-600"
                >
                  {ps.name_en} · {ps.calories} kcal
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-8 mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Step 1</span>
              </div>
              <h3 className="mt-1 text-[14px] font-medium text-gray-700">
                Add portion sizes and their calories
              </h3>
              <p className="mt-0.5 text-[13px] text-gray-400">
                Portion sizes dictate how many calories a meal has
              </p>
              <button
                onClick={() => setPortionsDialogOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#2d5a3d] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#234a31]"
              >
                <Plus className="h-4 w-4" />
                Add portions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 2: Meal Types & Base Pricing ─────────────────────── */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">
              {hasPortionSizes && mealTypes.length > 0
                ? 'Meal types & base pricing'
                : 'Add meal types and their base prices'}
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-400">
              {hasPortionSizes && mealTypes.length > 0
                ? 'Add meal types and choose the available portion sizes and the pricing for each'
                : 'Meal types like breakfast, lunch, dinner...'}
            </p>
          </div>
          {mealTypes.length > 0 && !reorderMode && (
            <button
              onClick={startReorder}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Re-order types
            </button>
          )}
          {reorderMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelReorder}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                Discard
              </button>
              <button
                onClick={saveReorder}
                className="rounded-lg bg-[#2d5a3d] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#234a31]"
              >
                Save changes
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          {reorderMode && (
            <div className="mt-4 rounded-lg bg-amber-50 px-4 py-2.5 text-[13px] text-amber-700">
              Click and drag on the handles next to each item to change its position
            </div>
          )}

          {/* Meal type list */}
          {displayMealTypes.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
              {displayMealTypes.map((mt, index) => {
                const isExpanded = expandedMealTypes.has(mt.id) && !reorderMode
                const isLast = index === displayMealTypes.length - 1
                return (
                  <div key={mt.id} className={!isLast ? 'border-b border-gray-100' : ''}>
                    {/* Row header */}
                    <div className="flex items-center px-4 py-3">
                      {reorderMode && (
                        <div className="mr-2 flex items-center gap-1">
                          <GripVertical className="h-4 w-4 text-gray-300" />
                          <div className="flex flex-col">
                            <button
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => moveDown(index)}
                              disabled={index === displayMealTypes.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-20"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Dollar icon */}
                      <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                        <span className="text-[11px] font-bold">$</span>
                      </div>

                      <button
                        onClick={() => !reorderMode && toggleExpanded(mt.id)}
                        className="flex-1 text-left"
                        disabled={reorderMode}
                      >
                        <span className="text-[14px] font-medium text-gray-900">{mt.label_en}</span>
                      </button>

                      {!reorderMode && (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingMealType(mt)
                              setMealTypeDialogOpen(true)
                            }}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => toggleExpanded(mt.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expanded pricing table */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-[12px] font-medium text-gray-400">
                              <th className="pb-3 text-left">Portion size</th>
                              <th className="pb-3 text-left">Calories</th>
                              <th className="pb-3 text-right">Base price ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {portionSizes.map((ps, psIdx) => {
                              const price = getPortionPrice(mt, ps.id)
                              return (
                                <tr
                                  key={ps.id}
                                  className={psIdx < portionSizes.length - 1 ? 'border-b border-gray-100' : ''}
                                >
                                  <td className="py-2.5 text-[13px] text-gray-700">{ps.name_en}</td>
                                  <td className="py-2.5 text-[13px] text-gray-400">{ps.calories}</td>
                                  <td className="py-2.5 text-right">
                                    {price !== undefined ? (
                                      <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
                                        {Number(price).toFixed(1)}$
                                      </span>
                                    ) : (
                                      <span className="text-[13px] text-gray-300">—</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty state for meal types */}
          {!hasPortionSizes && mealTypes.length === 0 && (
            <div className="mt-8 mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Step 2</span>
              <h3 className="mt-1 text-[14px] font-medium text-gray-700">
                Add meal types and their base prices
              </h3>
              <p className="mt-0.5 text-[13px] text-gray-400">
                Meal types like breakfast, lunch, dinner...
              </p>
            </div>
          )}

          {/* Add meal type button */}
          {!reorderMode && (
            <div className="mt-5">
              <button
                onClick={() => {
                  setEditingMealType(null)
                  setMealTypeDialogOpen(true)
                }}
                disabled={!hasPortionSizes}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                  hasPortionSizes
                    ? 'bg-[#2d5a3d] text-white hover:bg-[#234a31]'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Meal type
              </button>
            </div>
          )}

          {/* Footer note */}
          {mealTypes.length > 0 && !reorderMode && (
            <p className="mt-5 text-[12px] text-gray-400">
              You can adjust the final pricing for each meal type depending on the diet in{' '}
              <span className="font-medium text-emerald-600 underline decoration-emerald-200 underline-offset-2">
                Diets
              </span>
            </p>
          )}
        </div>
      </section>

      {/* ─── Dialogs ──────────────────────────────────────────────────── */}
      <EditPortionsDialog
        open={portionsDialogOpen}
        onOpenChange={setPortionsDialogOpen}
        initialPortions={portionSizes}
        onSave={handleSavePortions}
      />

      <MealTypeDialog
        open={mealTypeDialogOpen}
        onOpenChange={(open) => {
          setMealTypeDialogOpen(open)
          if (!open) setEditingMealType(null)
        }}
        portionSizes={portionSizes}
        editingMealType={editingMealType}
        onSave={editingMealType ? handleUpdateMealType : handleCreateMealType}
        onDelete={editingMealType ? () => {
          setMealTypeDialogOpen(false)
          setDeletingMealType(editingMealType)
        } : undefined}
      />

      <DeleteMealTypeDialog
        open={!!deletingMealType}
        onOpenChange={(open) => {
          if (!open) setDeletingMealType(null)
        }}
        mealTypeName={deletingMealType?.label_en ?? ''}
        onConfirm={handleDeleteMealType}
      />
    </div>
  )
}
