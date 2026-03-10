'use client'

import { useState, useRef, useEffect } from 'react'
import type { DashboardPlan } from '@boxvibe/db'
import { Plus, MoreVertical, Package } from 'lucide-react'
import { MacroPills } from './macro-bar'
import { CreatePlanDialog } from './create-plan-dialog'
import { EditDetailsDialog } from './edit-details-dialog'
import { EditMacrosDialog } from './edit-macros-dialog'
import { EditPriceDialog } from './edit-price-dialog'
import { DeletePlanDialog } from './delete-plan-dialog'
import {
  createPlanAction,
  updatePlanDetailsAction,
  updatePlanMacrosAction,
  updatePlanPriceAdjustmentAction,
  togglePlanActiveAction,
  deletePlanAction,
} from './actions'

interface PlansClientProps {
  vendorId: string
  vendorSlug: string
  initialPlans: DashboardPlan[]
}

export function PlansClient({ vendorId, vendorSlug, initialPlans }: PlansClientProps) {
  const [plans] = useState(initialPlans)
  const [createOpen, setCreateOpen] = useState(false)
  const [editDetailsPlan, setEditDetailsPlan] = useState<DashboardPlan | null>(null)
  const [editMacrosPlan, setEditMacrosPlan] = useState<DashboardPlan | null>(null)
  const [editPricePlan, setEditPricePlan] = useState<DashboardPlan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<DashboardPlan | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCreate = async (data: {
    name_en: string
    desc_en: string
    cover_image: string | null
    protein_pct: number
    carb_pct: number
    fat_pct: number
    price_adjustment: number
  }) => {
    const result = await createPlanAction(vendorId, vendorSlug, data)
    if (result.success) window.location.reload()
    return result
  }

  const handleUpdateDetails = async (data: { name_en: string; desc_en: string; cover_image: string | null }) => {
    if (!editDetailsPlan) return { success: false, error: 'No plan selected' }
    const result = await updatePlanDetailsAction(editDetailsPlan.id, vendorSlug, data)
    if (result.success) window.location.reload()
    return result
  }

  const handleUpdateMacros = async (data: { protein_pct: number; carb_pct: number; fat_pct: number }) => {
    if (!editMacrosPlan) return { success: false, error: 'No plan selected' }
    const result = await updatePlanMacrosAction(editMacrosPlan.id, vendorSlug, data)
    if (result.success) window.location.reload()
    return result
  }

  const handleUpdatePrice = async (priceAdjustment: number) => {
    if (!editPricePlan) return { success: false, error: 'No plan selected' }
    const result = await updatePlanPriceAdjustmentAction(editPricePlan.id, vendorSlug, priceAdjustment)
    if (result.success) window.location.reload()
    return result
  }

  const handleToggleActive = async (plan: DashboardPlan) => {
    setMenuOpenId(null)
    await togglePlanActiveAction(plan.id, vendorSlug, !plan.is_active)
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!deletingPlan) return
    await deletePlanAction(deletingPlan.id, vendorSlug)
    window.location.reload()
  }

  const formatPriceAdj = (adj: number) => {
    if (adj === 0) return 'Base price'
    return `${adj > 0 ? '+' : ''}${adj}%`
  }

  const hasPlans = plans.length > 0

  return (
    <div className="mt-6">
      {/* Empty state */}
      {!hasPlans && (
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
              <Package className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-gray-900">
              You don&apos;t have any plans
            </h3>
            <p className="mt-1 text-[13px] text-gray-400">
              You currently have no plans start by creating one right now
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Create plan
            </button>
          </div>
        </section>
      )}

      {/* Plans table */}
      {hasPlans && (
        <section className="rounded-xl border border-gray-200 bg-white">
          {/* Header with create button */}
          <div className="flex items-center justify-between px-6 py-4">
            <div />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              Create diet
            </button>
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-[12px] font-medium text-gray-400">
                  <th className="pb-3 text-left">Name</th>
                  <th className="pb-3 text-left">Status</th>
                  <th className="pb-3 text-left">Price adjustment</th>
                  <th className="pb-3 text-left">Macros %</th>
                  <th className="pb-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-50 last:border-0">
                    {/* Name + description */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Package className="h-5 w-5 text-gray-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900">{plan.name_en}</p>
                          {plan.desc_en && (
                            <p className="mt-0.5 truncate text-[12px] text-gray-400 max-w-[250px]">
                              {plan.desc_en}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          plan.is_active
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Price adjustment */}
                    <td className="py-4">
                      <span className={`text-[13px] font-medium ${
                        plan.price_adjustment === 0
                          ? 'text-gray-500'
                          : plan.price_adjustment > 0
                            ? 'text-emerald-600'
                            : 'text-gray-700'
                      }`}>
                        {formatPriceAdj(plan.price_adjustment)}
                      </span>
                    </td>

                    {/* Macros */}
                    <td className="py-4">
                      <MacroPills
                        protein={plan.protein_pct}
                        carbs={plan.carb_pct}
                        fat={plan.fat_pct}
                      />
                    </td>

                    {/* Actions menu */}
                    <td className="py-4">
                      <div className="relative" ref={menuOpenId === plan.id ? menuRef : undefined}>
                        <button
                          onClick={() => setMenuOpenId(menuOpenId === plan.id ? null : plan.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {menuOpenId === plan.id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
                            <button
                              onClick={() => {
                                setMenuOpenId(null)
                                setEditDetailsPlan(plan)
                              }}
                              className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                            >
                              Edit details and macros
                            </button>
                            <button
                              onClick={() => handleToggleActive(plan)}
                              className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                            >
                              {plan.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpenId(null)
                                setEditPricePlan(plan)
                              }}
                              className="flex w-full items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                            >
                              Edit price adjustment
                            </button>
                            <div className="my-1 h-px bg-gray-100" />
                            <button
                              onClick={() => {
                                setMenuOpenId(null)
                                setDeletingPlan(plan)
                              }}
                              className="flex w-full items-center px-4 py-2 text-[13px] text-red-600 hover:bg-red-50"
                            >
                              Delete diet
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Dialogs */}
      <CreatePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreate}
      />

      <EditDetailsDialog
        open={!!editDetailsPlan}
        onOpenChange={(open) => { if (!open) setEditDetailsPlan(null) }}
        plan={editDetailsPlan}
        onSave={handleUpdateDetails}
      />

      <EditMacrosDialog
        open={!!editMacrosPlan}
        onOpenChange={(open) => { if (!open) setEditMacrosPlan(null) }}
        plan={editMacrosPlan}
        onSave={handleUpdateMacros}
      />

      <EditPriceDialog
        open={!!editPricePlan}
        onOpenChange={(open) => { if (!open) setEditPricePlan(null) }}
        plan={editPricePlan}
        onSave={handleUpdatePrice}
      />

      <DeletePlanDialog
        open={!!deletingPlan}
        onOpenChange={(open) => { if (!open) setDeletingPlan(null) }}
        planName={deletingPlan?.name_en ?? ''}
        onConfirm={handleDelete}
      />
    </div>
  )
}
