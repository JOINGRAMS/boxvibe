'use client'

import { useState, useEffect } from 'react'
import type { DashboardPlan } from '@boxvibe/db'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import { MacroBar } from './macro-bar'

interface EditMacrosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: DashboardPlan | null
  onSave: (data: { protein_pct: number; carb_pct: number; fat_pct: number }) => Promise<{ success: boolean; error?: string }>
}

export function EditMacrosDialog({ open, onOpenChange, plan, onSave }: EditMacrosDialogProps) {
  const [protein, setProtein] = useState(33)
  const [carbs, setCarbs] = useState(34)
  const [fat, setFat] = useState(33)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && plan) {
      setProtein(plan.protein_pct)
      setCarbs(plan.carb_pct)
      setFat(plan.fat_pct)
      setError(null)
    }
  }, [open, plan])

  const setMacro = (macro: 'protein' | 'carbs' | 'fat', value: number) => {
    const clamped = Math.max(0, Math.min(100, value))
    if (macro === 'protein') {
      const remaining = 100 - clamped
      const newCarbs = Math.min(carbs, remaining)
      setProtein(clamped)
      setCarbs(newCarbs)
      setFat(remaining - newCarbs)
    } else if (macro === 'carbs') {
      const remaining = 100 - protein
      const newCarbs = Math.min(clamped, remaining)
      setCarbs(newCarbs)
      setFat(remaining - newCarbs)
    } else {
      const remaining = 100 - protein
      const newFat = Math.min(clamped, remaining)
      setFat(newFat)
      setCarbs(remaining - newFat)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await onSave({ protein_pct: protein, carb_pct: carbs, fat_pct: fat })
    setSaving(false)
    if (result.success) onOpenChange(false)
    else setError(result.error ?? 'Failed to save')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 p-0">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-semibold text-gray-900">Edit Plan Macros</h2>
          <p className="mt-0.5 text-[13px] text-gray-400">The percentages of macros</p>
        </div>

        <div className="px-6 pb-0">
          <MacroBar protein={protein} carbs={carbs} fat={fat} />

          <div className="mt-4 space-y-3">
            {[
              { label: 'Protein', value: protein, color: '#5B8C7A', set: (v: number) => setMacro('protein', v) },
              { label: 'Carbs', value: carbs, color: '#D4956A', set: (v: number) => setMacro('carbs', v) },
              { label: 'Fat', value: fat, color: '#C96B6B', set: (v: number) => setMacro('fat', v) },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="w-16 text-[13px] font-medium text-gray-700">{m.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => m.set(m.value - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={m.value}
                    onChange={e => m.set(Number(e.target.value))}
                    className="h-8 w-14 rounded-lg border border-gray-200 bg-white text-center text-[13px] text-gray-700 outline-none focus:border-gray-400"
                  />
                  <button
                    onClick={() => m.set(m.value + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    +
                  </button>
                  <span className="text-[12px] text-gray-400">%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-[12px] font-medium text-gray-600">About macros</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                Setting a macro range for the diet will help you make sure all your recipes and menus are accurate
              </p>
            </div>
          </div>

          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

          <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 py-4">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
