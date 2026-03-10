'use client'

import { useState } from 'react'
import type { PortionSize } from '@boxvibe/db'
import { Plus, Trash2, Info, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const isValid = rows.every(r => r.name_en.trim() && r.calories && Number(r.calories) > 0)

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
      <DialogContent className="max-w-[520px] gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-[16px] font-semibold text-gray-900">
            {initialPortions.length > 0 ? 'Edit portion sizes' : 'Add portion sizes'}
          </DialogTitle>
          <p className="mt-1 text-[13px] text-gray-400">
            Add all the portion sizes for all the meals you&apos;re going to create
          </p>
        </DialogHeader>

        <div className="px-6">
          {/* Info toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="mb-4 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700"
          >
            <Info className="h-3.5 w-3.5" />
            About portion sizes
          </button>

          {showInfo && (
            <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-gray-900">Calories in portion sizes</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                    Portion size refers to the estimated calorie content of a meal. For instance, a dessert
                    with high calories is considered a large portion, even if it&apos;s small in physical size.
                  </p>
                </div>
                <button onClick={() => setShowInfo(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_52px_80px_28px] gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            <span>Name</span>
            <span>ar</span>
            <span>Symbol</span>
            <span>Calories</span>
            <span />
          </div>

          {/* Rows */}
          <div className="mt-2 space-y-2">
            {rows.map(row => (
              <div key={row.tempId} className="grid grid-cols-[1fr_1fr_52px_80px_28px] gap-2">
                <input
                  value={row.name_en}
                  onChange={e => updateRow(row.tempId, 'name_en', e.target.value)}
                  placeholder="ex: Small"
                  className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400"
                />
                <input
                  value={row.name_ar}
                  onChange={e => updateRow(row.tempId, 'name_ar', e.target.value)}
                  placeholder=""
                  dir="rtl"
                  className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400"
                />
                <input
                  value={row.symbol}
                  onChange={e => updateRow(row.tempId, 'symbol', e.target.value)}
                  placeholder="S.M."
                  className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-center text-[13px] text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400"
                />
                <input
                  type="number"
                  value={row.calories}
                  onChange={e => updateRow(row.tempId, 'calories', e.target.value)}
                  placeholder="0"
                  min={1}
                  className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400"
                />
                <button
                  onClick={() => removeRow(row.tempId)}
                  disabled={rows.length <= 1}
                  className="flex h-9 w-7 items-center justify-center text-gray-300 transition-colors hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add row */}
          <button
            onClick={addRow}
            className="mt-3 flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add portion
          </button>

          {/* Preview chips */}
          {previewChips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {previewChips.map((chip, i) => (
                <div key={chip.tempId} className="flex items-center gap-3">
                  <span className="text-[12px] text-gray-500">
                    {chip.name_en} · {chip.calories} kcal
                  </span>
                  {i < previewChips.length - 1 && (
                    <span className="h-px w-6 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="px-6 pt-2 text-[13px] text-red-600">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4 mt-4">
          <button
            onClick={() => {
              resetRows()
              onOpenChange(false)
            }}
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save portions'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
