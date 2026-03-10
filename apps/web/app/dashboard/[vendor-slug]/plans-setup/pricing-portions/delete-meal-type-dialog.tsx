'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteMealTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealTypeName: string
  onConfirm: () => Promise<void>
}

export function DeleteMealTypeDialog({
  open,
  onOpenChange,
  mealTypeName: _mealTypeName,
  onConfirm,
}: DeleteMealTypeDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>You are about to delete a meal type.</p>
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
                <p className="font-medium text-red-800">Be careful</p>
                <p className="mt-0.5 text-red-700">
                  Deleting a meal type will result in some unwanted behaviors. This will deactivate
                  any existing package that uses this meal type in their structure, until fixed.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Go back
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : `Delete meal type`}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
