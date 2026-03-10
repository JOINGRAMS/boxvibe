'use client'

import { useState } from 'react'
import type { PortionSize, DashboardMealType } from '@boxvibe/db'
import { Pencil, GripVertical, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  // Expanded meal types (accordion)
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

  // ─── Portion size handlers ──────────────────────────────────────────

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
    if (result.success) {
      // Refetch by reloading page data
      window.location.reload()
    }
    return result
  }

  // ─── Meal type handlers ─────────────────────────────────────────────

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

  // ─── Reorder handlers ──────────────────────────────────────────────

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

  // Helper to find portion price for a meal type
  const getPortionPrice = (mealType: DashboardMealType, portionSizeId: string) => {
    return mealType.portions.find(p => p.portion_size_id === portionSizeId)?.base_price
  }

  const displayMealTypes = reorderMode ? reorderedTypes : mealTypes

  return (
    <div className="mt-8 space-y-8">
      {/* ─── Section 1: Portion Sizes & Calories ──────────────────────── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Portion sizes and calories
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Portion sizes dictate how many calories a meal has
              </p>
            </div>
            {hasPortionSizes && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPortionsDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>

          {hasPortionSizes ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {portionSizes.map(ps => (
                <div
                  key={ps.id}
                  className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700"
                >
                  {ps.name_en} · {ps.calories} kcal
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <p className="mb-3 text-sm text-gray-400">
                <span className="font-medium text-gray-600">Step 1</span>
                <br />
                Add portion sizes and their calories
              </p>
              <Button
                onClick={() => setPortionsDialogOpen(true)}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add portions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Section 2: Meal Types & Base Pricing ─────────────────────── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {hasPortionSizes ? 'Meal types & base pricing' : 'Add meal types and their base prices'}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {hasPortionSizes
                  ? 'Add meal types and choose the available portion sizes and the pricing for each'
                  : 'Meal types like breakfast, lunch, dinner...'}
              </p>
            </div>
            {mealTypes.length > 0 && !reorderMode && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={startReorder}>
                  Re-order types
                </Button>
              </div>
            )}
            {reorderMode && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={cancelReorder}>
                  Discard
                </Button>
                <Button size="sm" className="bg-emerald-700 text-white hover:bg-emerald-800" onClick={saveReorder}>
                  Save changes
                </Button>
              </div>
            )}
          </div>

          {reorderMode && (
            <div className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Click and drag on the handles next to each item to change its position
            </div>
          )}

          {/* Meal type list */}
          {displayMealTypes.length > 0 ? (
            <div className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-200">
              {displayMealTypes.map((mt, index) => {
                const isExpanded = expandedMealTypes.has(mt.id) && !reorderMode
                return (
                  <div key={mt.id}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      {reorderMode && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveDown(index)}
                            disabled={index === displayMealTypes.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {reorderMode && (
                        <GripVertical className="h-4 w-4 text-gray-300" />
                      )}

                      <button
                        onClick={() => !reorderMode && toggleExpanded(mt.id)}
                        className="flex flex-1 items-center text-left"
                        disabled={reorderMode}
                      >
                        <span className="text-sm font-medium text-gray-900">{mt.label_en}</span>
                      </button>

                      {!reorderMode && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingMealType(mt)
                              setMealTypeDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleExpanded(mt.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Expanded portion pricing table */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500">
                              <th className="pb-2 font-medium">Portion size</th>
                              <th className="pb-2 font-medium">Calories</th>
                              <th className="pb-2 text-right font-medium">Base price ($)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {portionSizes.map(ps => {
                              const price = getPortionPrice(mt, ps.id)
                              return (
                                <tr key={ps.id}>
                                  <td className="py-2 text-gray-700">{ps.name_en}</td>
                                  <td className="py-2 text-gray-500">{ps.calories}</td>
                                  <td className="py-2 text-right">
                                    {price !== undefined ? (
                                      <span className="inline-flex rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                        {Number(price).toFixed(1)}$
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">—</span>
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
          ) : null}

          {/* Add meal type button */}
          {!reorderMode && (
            <div className="mt-4">
              {!hasPortionSizes ? (
                <Button disabled className="bg-emerald-700 text-white opacity-50">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Meal type
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEditingMealType(null)
                    setMealTypeDialogOpen(true)
                  }}
                  className="bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Meal type
                </Button>
              )}
            </div>
          )}

          {mealTypes.length > 0 && (
            <p className="mt-4 text-xs text-gray-400">
              You can adjust the final pricing for each meal type depending on the diet in{' '}
              <span className="font-medium text-emerald-600">Diets</span>
            </p>
          )}
        </CardContent>
      </Card>

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
