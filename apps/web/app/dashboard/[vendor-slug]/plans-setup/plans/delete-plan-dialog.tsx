'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { TriangleAlert } from 'lucide-react'

interface DeletePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
  onConfirm: () => Promise<void>
}

export function DeletePlanDialog({ open, onOpenChange, planName, onConfirm }: DeletePlanDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] gap-0 p-0">
        <div className="px-6 pt-6 pb-5">
          <h2 className="text-[16px] font-semibold text-gray-900">Are you sure?</h2>
          <p className="mt-2 text-[13px] text-gray-500">
            You are about to delete <span className="font-medium text-gray-700">{planName}</span>.
          </p>

          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-2.5">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-[13px] font-semibold text-red-800">Be careful</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-red-600">
                  Deleting a diet will deactivate any existing packages and subscriptions that use this diet. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
          >
            Go back
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete diet'}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
