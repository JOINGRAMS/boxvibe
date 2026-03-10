'use client'

import { useState } from 'react'
import type { PortionSize } from '@boxvibe/db'
import { Plus, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface EditPortionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPortions: PortionSize[]
  onSave: (portions: Array<{
    id?: string
    name_en: string
    name_ar: string
    symbol: string
    calories: number
  }>) => Promise<{ success: boolean; error?: string }>
}

type PortionRow = {
  tempId: string
  id?: string
  name_en: string
  name_ar: string
  symbol: string
  calories: string
}

const DEFAULT_PRESETS: PortionRow[] = [
  { tempId: '1', name_en: 'Small', name_ar: '', symbol: 'S', calories: '200' },
  { tempId: '2', name_en: 'Medium', name_ar: '', symbol: 'M', calories: '400' },
  { tempId: '3', name_en: 'Large', name_ar: '', symbol: 'L', calories: '600' },
  { tempId: '4', name_en: 'X-Large', name_ar: '', symbol: 'XL', calories: '700' },
]

let nextTempId = 100

export function EditPortionsDialog({
  open,
  onOpenChange,
  initialPortions,
  onSave,
}: EditPortionsDialogProps) {
  const [rows, setRows] = useState<PortionRow[]>(() =>
    initialPortions.length > 0
      ? initialPortions.map(p => ({
          tempId: p.id,
          id: p.id,
          name_en: p.name_en,
          name_ar: p.name_ar,
          symbol: p.symbol,
          calories: String(p.calories),
        }))
      : DEFAULT_PRESETS
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  const resetRows = () => {
    setRows(
      initialPortions.length > 0
        ? initialPortions.map(p => ({
            tempId: p.id,
            id: p.id,
            name_en: p.name_en,
            name_ar: p.name_ar,
            symbol: p.symbol,
            calories: String(p.calories),
          }))
        : DEFAULT_PRESETS
    )
    setError(null)
  }

  const addRow = () => {
    nextTempId++
    setRows(prev => [...prev, { tempId: String(nextTempId), name_en: '', name_ar: '', symbol: '', calories: '' }])
  }

  const removeRow = (tempId: string) => {
    if (rows.length <= 1) return
    setRows(prev => prev.filter(r => r.tempId !== tempId))
  }

  const updateRow = (tempId: string, field: keyof PortionRow, value: string) => {
    setRows(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r))
  }

  const isValid = rows.every(
    r => r.name_en.trim() && r.calories && Number(r.calories) > 0
  )

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)
    setError(null)

    const result = await onSave(
      rows.map(r => ({
        id: r.id,
        name_en: r.name_en.trim(),
        name_ar: r.name_ar.trim(),
        symbol: r.symbol.trim(),
        calories: Number(r.calories),
      }))
    )

    setSaving(false)
    if (result.success) {
      onOpenChange(false)
    } else {
      setError(result.error ?? 'Failed to save')
    }
  }

  // Preview chips sorted by calories
  const previewChips = rows
    .filter(r => r.name_en.trim() && r.calories && Number(r.calories) > 0)
    .sort((a, b) => Number(a.calories) - Number(b.calories))

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetRows()
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialPortions.length > 0 ? 'Edit portion sizes' : 'Add portion sizes'}
          </DialogTitle>
          <DialogDescription>
            You can add multiple calorie options per package
          </DialogDescription>
        </DialogHeader>

        {/* Info toggle */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <Info className="h-3.5 w-3.5" />
          About portion sizes
        </button>

        {showInfo && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
            <p className="font-medium text-gray-900">Calories in portion sizes</p>
            <p className="mt-1">
              Portion size refers to the estimated calorie content of a meal. For instance, a dessert
              with high calories is considered a large portion, even if it&apos;s small in physical size.
            </p>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_1fr_60px_80px_32px] gap-2 text-xs font-medium text-gray-500">
            <span>Name</span>
            <span>Arabic</span>
            <span>Symbol</span>
            <span>Calories</span>
            <span />
          </div>

          {rows.map(row => (
            <div key={row.tempId} className="grid grid-cols-[1fr_1fr_60px_80px_32px] gap-2">
              <Input
                value={row.name_en}
                onChange={e => updateRow(row.tempId, 'name_en', e.target.value)}
                placeholder="ex: Small"
                className="h-9 text-sm"
              />
              <Input
                value={row.name_ar}
                onChange={e => updateRow(row.tempId, 'name_ar', e.target.value)}
                placeholder="Arabic"
                className="h-9 text-sm"
                dir="rtl"
              />
              <Input
                value={row.symbol}
                onChange={e => updateRow(row.tempId, 'symbol', e.target.value)}
                placeholder="S"
                className="h-9 text-sm text-center"
              />
              <Input
                type="number"
                value={row.calories}
                onChange={e => updateRow(row.tempId, 'calories', e.target.value)}
                placeholder="0"
                className="h-9 text-sm"
                min={1}
              />
              <button
                onClick={() => removeRow(row.tempId)}
                disabled={rows.length <= 1}
                className="flex h-9 w-8 items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Add portion
        </button>

        {/* Preview chips */}
        {previewChips.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            {previewChips.map(chip => (
              <div
                key={chip.tempId}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600"
              >
                {chip.name_en} · {chip.calories} kcal
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          <Button
            variant="ghost"
            onClick={() => {
              resetRows()
              onOpenChange(false)
            }}
          >
            Discard
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {saving ? 'Saving...' : 'Save portions'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
