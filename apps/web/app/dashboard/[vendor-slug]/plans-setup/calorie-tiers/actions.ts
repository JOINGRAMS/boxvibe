'use server'

import { revalidatePath } from 'next/cache'
import { saveCalorieTiers } from '@boxvibe/db'

export async function saveCalorieTiersAction(
  vendorId: string,
  vendorSlug: string,
  tiers: Array<{
    name_en: string
    name_ar: string
    sort_order: number
    meals: Array<{ meal_type_id: string; portion_size_id: string }>
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await saveCalorieTiers(vendorId, tiers)
    revalidatePath(`/dashboard/${vendorSlug}/plans-setup/calorie-tiers`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save tiers' }
  }
}
