'use client'

import { useState, useEffect } from 'react'
import type { PortionSize, DashboardMealType } from '@boxvibe/db'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  // Step 1 state
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [selectedPortionIds, setSelectedPortionIds] = useState<Set<string>>(new Set())

  // Step 2 state
  const [step, setStep] = useState<1 | 2>(1)
  const [prices, setPrices] = useState<Record<string, string>>({})

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize when dialog opens or editing meal type changes
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
        // All selected by default for new meal types
        setSelectedPortionIds(new Set(portionSizes.map(p => p.id)))
        const defaultPrices: Record<string, string> = {}
        portionSizes.forEach(p => {
          defaultPrices[p.id] = '0.00'
        })
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
    // Initialize prices for newly selected portions
    const newPrices = { ...prices }
    selectedPortions.forEach(p => {
      if (!(p.id in newPrices)) {
        newPrices[p.id] = '0.00'
      }
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

    const result = await onSave({
      label_en: name.trim(),
      label_ar: nameAr.trim(),
      portionPrices,
    })

    setSaving(false)
    if (result.success) {
      onOpenChange(false)
    } else {
      setError(result.error ?? 'Failed to save')
    }
  }

  // Check if removing a portion that was previously active (warning)
  const hasRemovedPortions = isEditing && editingMealType.portions.some(
    p => !selectedPortionIds.has(p.portion_size_id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit meal type' : 'Add meal type'}</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Prices are added in the next step' : 'The base price for each portion size'}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                step >= 1 ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <span className="text-xs text-gray-500">Step 1</span>
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                step >= 2 ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span className="text-xs text-gray-500">Step 2</span>
          </div>
        </div>

        {/* ─── Step 1: Name + Portion selection ────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="meal-type-name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="meal-type-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Breakfast"
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Portion sizes available for this meal type
                </Label>
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Select all
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {portionSizes.map(ps => {
                  const isSelected = selectedPortionIds.has(ps.id)
                  return (
                    <button
                      key={ps.id}
                      onClick={() => togglePortionSize(ps.id)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {ps.name_en} · {ps.calories} kcal
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Warning for removing portions in edit mode */}
            {hasRemovedPortions && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-medium text-amber-800">Be careful</p>
                <p className="mt-0.5 text-amber-700">
                  Removing a portion size will immediately deactivate every package that includes it.
                  Changes applied here or to the subscribers, and you still have to add meals
                  adapting these portion sizes.
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                {isEditing && onDelete && (
                  <button
                    onClick={onDelete}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete meal type
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Discard
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: Base pricing ────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2 font-medium">Portion size</th>
                  <th className="pb-2 font-medium">Calories</th>
                  <th className="pb-2 text-right font-medium">Base price ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedPortions.map(ps => (
                  <tr key={ps.id}>
                    <td className="py-2.5 text-gray-700">{ps.name_en}</td>
                    <td className="py-2.5 text-gray-500">{ps.calories}</td>
                    <td className="py-2.5">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={prices[ps.id] || ''}
                        onChange={e =>
                          setPrices(prev => ({ ...prev, [ps.id]: e.target.value }))
                        }
                        className="ml-auto h-8 w-24 text-right text-sm"
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Info section */}
            <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
              <div>
                <p className="font-medium text-gray-700">About base pricing</p>
                <p className="mt-0.5">
                  This is the starting price for the meal. The final cost varies based on the
                  selected diet and its price adjustment in{' '}
                  <span className="font-medium text-emerald-600">Diets</span>. Check the exact price for
                  each package and diet combination when creating a package.
                </p>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create type'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
