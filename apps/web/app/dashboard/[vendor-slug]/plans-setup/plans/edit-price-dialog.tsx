'use client'

import { useState, useEffect } from 'react'
import type { DashboardPlan } from '@boxvibe/db'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Info } from 'lucide-react'

interface EditPriceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: DashboardPlan | null
  onSave: (priceAdjustment: number) => Promise<{ success: boolean; error?: string }>
}

export function EditPriceDialog({ open, onOpenChange, plan, onSave }: EditPriceDialogProps) {
  const [priceAdj, setPriceAdj] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && plan) {
      setPriceAdj(plan.price_adjustment)
      setError(null)
    }
  }, [open, plan])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await onSave(priceAdj)
    setSaving(false)
    if (result.success) onOpenChange(false)
    else setError(result.error ?? 'Failed to save')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 p-0">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Price adjustment for {plan?.name_en}
          </h2>
        </div>

        <div className="px-6 pb-0">
          {/* Info */}
          <div className="flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-[12px] font-medium text-gray-600">What is Price adjustment?</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                In our pricing system all prices are calculated automatically, based on the meals included and the diet selected by the user, so you could markup or discount the price of a certain diet by a percentage.
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-3 py-8">
            <button
              onClick={() => setPriceAdj(prev => prev - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[18px] text-gray-500 hover:bg-gray-50"
            >
              -
            </button>
            <div className="relative">
              <input
                type="number"
                value={priceAdj}
                onChange={e => {
                  const val = Number(e.target.value)
                  if (val >= -100 && val < 1000) setPriceAdj(val)
                }}
                className="h-12 w-24 rounded-xl border border-gray-200 bg-white text-center text-[18px] font-semibold text-gray-900 outline-none focus:border-gray-400"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-400">%</span>
            </div>
            <button
              onClick={() => setPriceAdj(prev => Math.min(999, prev + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[18px] text-gray-500 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          {priceAdj === 0 && (
            <p className="text-center text-[13px] font-medium text-gray-500">Base pricing</p>
          )}

          {/* Warning */}
          <p className="mt-2 text-center text-[11px] leading-relaxed text-gray-400">
            Adjustments made to this value will not effect active subscriptions, and will only apply to upcoming ones.
          </p>

          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

          <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 py-4">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save new pricing'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
