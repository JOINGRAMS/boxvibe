'use client'

import { useState, useEffect } from 'react'
import type { DashboardPlan } from '@boxvibe/db'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface EditDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: DashboardPlan | null
  onSave: (data: {
    name_en: string
    desc_en: string
    cover_image: string | null
  }) => Promise<{ success: boolean; error?: string }>
}

export function EditDetailsDialog({ open, onOpenChange, plan, onSave }: EditDetailsDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && plan) {
      setName(plan.name_en)
      setDescription(plan.desc_en ?? '')
      setError(null)
    }
  }, [open, plan])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await onSave({
      name_en: name.trim(),
      desc_en: description.trim(),
      cover_image: plan?.cover_image ?? null,
    })
    setSaving(false)
    if (result.success) onOpenChange(false)
    else setError(result.error ?? 'Failed to save')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 p-0">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[16px] font-semibold text-gray-900">Edit plan details</h2>
        </div>

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
                className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, 200))}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 outline-none placeholder:text-gray-300 focus:border-gray-400"
              />
              <p className="text-[11px] text-gray-300">This description will be visible to customers</p>
            </div>
          </div>

          {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

          <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 py-4">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="rounded-lg bg-gray-900 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
