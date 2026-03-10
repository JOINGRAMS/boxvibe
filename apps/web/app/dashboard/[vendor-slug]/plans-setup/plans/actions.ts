'use server'

import { revalidatePath } from 'next/cache'
import {
  createPlan,
  updatePlanDetails,
  updatePlanMacros,
  updatePlanPriceAdjustment,
  togglePlanActive,
  deletePlan,
} from '@boxvibe/db'

export async function createPlanAction(
  vendorId: string,
  vendorSlug: string,
  data: {
    name_en: string
    desc_en: string
    cover_image: string | null
    protein_pct: number
    carb_pct: number
    fat_pct: number
    price_adjustment: number
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await createPlan(vendorId, data)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create plan' }
  }
}

export async function updatePlanDetailsAction(
  planId: string,
  vendorSlug: string,
  data: {
    name_en: string
    desc_en: string
    cover_image: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await updatePlanDetails(planId, data)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update plan' }
  }
}

export async function updatePlanMacrosAction(
  planId: string,
  vendorSlug: string,
  data: { protein_pct: number; carb_pct: number; fat_pct: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    await updatePlanMacros(planId, data)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update macros' }
  }
}

export async function updatePlanPriceAdjustmentAction(
  planId: string,
  vendorSlug: string,
  priceAdjustment: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await updatePlanPriceAdjustment(planId, priceAdjustment)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update price adjustment' }
  }
}

export async function togglePlanActiveAction(
  planId: string,
  vendorSlug: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await togglePlanActive(planId, isActive)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' }
  }
}

export async function deletePlanAction(
  planId: string,
  vendorSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deletePlan(planId)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/plans`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete plan' }
  }
}
