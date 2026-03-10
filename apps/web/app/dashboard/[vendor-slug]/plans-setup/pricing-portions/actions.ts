'use server'

import {
  upsertPortionSizes,
  createMealType,
  updateMealType,
  deleteMealType,
  reorderMealTypes,
} from '@boxvibe/db'
import { revalidatePath } from 'next/cache'

// ─── Portion Sizes ──────────────────────────────────────────────────────────

export async function savePortionSizes(
  vendorId: string,
  vendorSlug: string,
  portions: Array<{
    id?: string
    name_en: string
    name_ar: string
    symbol: string
    calories: number
    sort_order: number
  }>
) {
  try {
    await upsertPortionSizes(vendorId, portions)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/pricing-portions`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save portion sizes'
    return { success: false, error: message }
  }
}

// ─── Meal Types ─────────────────────────────────────────────────────────────

export async function createMealTypeAction(
  vendorId: string,
  vendorSlug: string,
  data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }
) {
  try {
    const id = await createMealType(vendorId, data)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/pricing-portions`)
    return { success: true, id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create meal type'
    return { success: false, error: message }
  }
}

export async function updateMealTypeAction(
  mealTypeId: string,
  vendorSlug: string,
  data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }
) {
  try {
    await updateMealType(mealTypeId, data)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/pricing-portions`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update meal type'
    return { success: false, error: message }
  }
}

export async function deleteMealTypeAction(mealTypeId: string, vendorSlug: string) {
  try {
    await deleteMealType(mealTypeId)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/pricing-portions`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete meal type'
    return { success: false, error: message }
  }
}

export async function reorderMealTypesAction(
  vendorId: string,
  vendorSlug: string,
  orderedIds: string[]
) {
  try {
    await reorderMealTypes(vendorId, orderedIds)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/pricing-portions`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reorder meal types'
    return { success: false, error: message }
  }
}
