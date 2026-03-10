'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import { MacroBar } from './macro-bar'

interface CreatePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    name_en: string
    desc_en: string
    cover_image: string | null
    protein_pct: number
    carb_pct: number
    fat_pct: number
    price_adjustment: number
  }) => Promise<{ success: boolean; error?: string }>
}

export function CreatePlanDialog({ open, onOpenChange, onSave }: CreatePlanDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [protein, setProtein] = useState(33)
  const [carbs, setCarbs] = useState(34)
  const [fat, setFat] = useState(33)
  const [priceAdj, setPriceAdj] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setStep(1)
    setName('')
    setDescription('')
    setProtein(33)
    setCarbs(34)
    setFat(33)
    setPriceAdj(0)
    setError(null)
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    onOpenChange(val)
  }

  const isStep1Valid = name.trim().length > 0

  // Macro adjustment: adjust fat to keep sum = 100
  const setMacro = (macro: 'protein' | 'carbs' | 'fat', value: number) => {
    const clamped = Math.max(0, Math.min(100, value))
    if (macro === 'protein') {
      const remaining = 100 - clamped
      const newCarbs = Math.min(carbs, remaining)
      const newFat = remaining - newCarbs
      setProtein(clamped)
      setCarbs(newCarbs)
      setFat(newFat)
    } else if (macro === 'carbs') {
      const remaining = 100 - protein
      const newCarbs = Math.min(clamped, remaining)
      const newFat = remaining - newCarbs
      setCarbs(newCarbs)
      setFat(newFat)
    } else {
      const remaining = 100 - protein
      const newFat = Math.min(clamped, remaining)
      const newCarbs = remaining - newFat
      setFat(newFat)
      setCarbs(newCarbs)
    }
  }

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    const result = await onSave({
      name_en: name.trim(),
      desc_en: description.trim(),
      cover_image: null,
      protein_pct: protein,
      carb_pct: carbs,
      fat_pct: fat,
      price_adjustment: priceAdj,
    })
    setSaving(false)
    if (result.success) handleOpenChange(false)
    else setError(result.error ?? 'Failed to create')
  }

  const stepLabels = ['Details', 'Macros', 'Pricing']

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-semibold text-gray-900">
            {step === 1 ? 'Plan details' : step === 2 ? 'Plan Macros' : 'Plan price adjustment'}
          </h2>
          <p className="mt-0.5 text-[13px] text-gray-400">
            {step === 1
              ? 'Diets help your customers achieve their goals'
              : step === 2
                ? 'The percentages of macros'
                : 'All details can be edited later'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3">
          {stepLabels.map((label, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3
            const isCompleted = step > stepNum
            const isActive = step >= stepNum
            return (
              <div key={label} className="flex items-center">
                {i > 0 && (
                  <div className={`mx-2 h-px w-8 ${isActive ? 'bg-gray-900' : 'bg-gray-200'}`} />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isActive ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? '\u2713' : stepNum}
                  </div>
                  <span className="text-[12px] font-medium text-gray-500">Step {stepNum}</span>
                  <span className="text-[11px] text-gray-400">{label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── Step 1: Details ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="px-6 pb-0">
            {/* Cover image placeholder */}
            <div className="mb-4 flex h-[140px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-[12px] text-gray-400">Upload cover</p>
                <p className="text-[11px] text-gray-300">No file chosen</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 30))}
                  placeholder="e.g. High Protein"
                  className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-400"
                />
                <p className="mt-1 text-right text-[11px] text-gray-300">{name.length}/30</p>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 200))}
                  placeholder="A menu full of meals with a higher protein content to help you build muscles"
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-400"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-300">This description will be visible to customers</p>
                  <p className="text-[11px] text-gray-300">{description.length}/200</p>
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

            <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 py-4">
              <button
                onClick={() => handleOpenChange(false)}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
              >
                Discard
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Macros ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="px-6 pb-0">
            <MacroBar protein={protein} carbs={carbs} fat={fat} />

            {/* Macro inputs */}
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

            {/* Info */}
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
                onClick={() => setStep(1)}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Price Adjustment ────────────────────────────── */}
        {step === 3 && (
          <div className="px-6 pb-0">
            <div className="flex items-center justify-center gap-3 py-6">
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

            {/* Info */}
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-[12px] font-medium text-gray-600">What is Price adjustment?</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">
                  In our pricing system all prices are calculated automatically, based on the meals included and the diet selected by the user, so you could markup or discount the price of a certain diet by a percentage.
                </p>
              </div>
            </div>

            {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 py-4">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create diet'}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
