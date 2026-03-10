import { cache } from 'react'
import { createSupabaseAdminClient } from '../client'

// ─── Types ───────────────────────────────────────────────────────────────────

export type StorefrontVendor = {
  id: string
  name_en: string
  name_ar: string
  brand_name: string | null
  logo_image_url: string | null
  cover_image_url: string | null
  slug: string | null
  country: string
  currency: string
}

export type StorefrontPlan = {
  id: string
  name_en: string
  name_ar: string
  desc_en: string | null
  desc_ar: string | null
  cover_image: string | null
  slug: string | null
}

export type StorefrontPackage = {
  id: string
  category_en: string
  category_ar: string
  description_en: string | null
  description_ar: string | null
  cover_image_url: string | null
  price_multiplier: number
  slug: string | null
  meal_types: string[]
}

export type StorefrontTier = {
  id: string
  plan_id: string
  variance_name_en: string
  variance_name_ar: string
  total_price: number
}

export type PlanPackageLink = {
  plan_id: string
  package_id: string
}

export type StorefrontMealType = {
  id: string
  key: string         // 'breakfast' | 'morning_snack' | 'lunch' | 'dinner' | 'evening_snack'
  label_en: string
  label_ar: string
  price_per_day: number
  display_order: number
}

// ─── Queries (cached per request via React cache()) ──────────────────────────

export const getVendorBySlug = cache(async (slug: string): Promise<StorefrontVendor | null> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('vendors')
    .select('id, name_en, name_ar, brand_name, logo_image_url, cover_image_url, slug, country, currency')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
})

export const getPlansByVendorId = cache(async (vendorId: string): Promise<StorefrontPlan[]> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('plans')
    .select('id, name_en, name_ar, desc_en, desc_ar, cover_image, slug')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('name_en')
  return data ?? []
})

export const getPlanBySlug = cache(async (vendorId: string, planSlug: string): Promise<StorefrontPlan | null> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('plans')
    .select('id, name_en, name_ar, desc_en, desc_ar, cover_image, slug')
    .eq('vendor_id', vendorId)
    .eq('slug', planSlug)
    .eq('is_active', true)
    .single()
  return data
})

export const getPackagesForPlan = cache(async (planId: string): Promise<StorefrontPackage[]> => {
  const supabase = createSupabaseAdminClient()

  // Step 1: get all package IDs linked to this plan via the junction table
  const { data: junctionRows } = await supabase
    .from('plan_packages')
    .select('package_id')
    .eq('plan_id', planId)

  const packageIds = (junctionRows ?? [])
    .map(r => r.package_id)
    .filter((id): id is string => id !== null)

  if (packageIds.length === 0) return []

  // Step 2: fetch the actual package records
  const { data } = await supabase
    .from('packages')
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug, meal_types')
    .in('id', packageIds)
    .eq('is_active', true)
    .order('category_en')

  return data ?? []
})

export const getPackageBySlug = cache(async (vendorId: string, packageSlug: string): Promise<StorefrontPackage | null> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('packages')
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug, meal_types')
    .eq('vendor_id', vendorId)
    .eq('slug', packageSlug)
    .eq('is_active', true)
    .single()
  return data
})

export const getTiersForPlan = cache(async (planId: string): Promise<StorefrontTier[]> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('plan_package_tiers')
    .select('id, plan_id, variance_name_en, variance_name_ar, total_price')
    .eq('plan_id', planId)
    .order('total_price')
  return (data ?? []).filter((r): r is StorefrontTier => r.plan_id !== null)
})

// ─── Wizard queries (vendor-scoped, for the subscribe wizard) ─────────────────

/** All active packages belonging to a vendor (for the subscription wizard step 1). */
export const getPackagesForVendor = cache(async (vendorId: string): Promise<StorefrontPackage[]> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('packages')
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug, meal_types')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('price_multiplier')
  return data ?? []
})

/** All calorie tiers across all active plans for a vendor, including plan_id for client-side filtering. */
export const getAllTiersForVendor = cache(async (vendorId: string): Promise<StorefrontTier[]> => {
  const supabase = createSupabaseAdminClient()

  // Get all active plan IDs for this vendor
  const { data: planRows } = await supabase
    .from('plans')
    .select('id')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)

  if (!planRows || planRows.length === 0) return []
  const planIds = planRows.map(p => p.id)

  const { data } = await supabase
    .from('plan_package_tiers')
    .select('id, plan_id, variance_name_en, variance_name_ar, total_price')
    .in('plan_id', planIds)
    .order('total_price')

  return (data ?? []).filter((r): r is StorefrontTier => r.plan_id !== null)
})

/** All plan↔package links for a vendor's active plans (for client-side filtering in the wizard). */
export const getPlanPackagesForVendor = cache(async (vendorId: string): Promise<PlanPackageLink[]> => {
  const supabase = createSupabaseAdminClient()

  const { data: planRows } = await supabase
    .from('plans')
    .select('id')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)

  if (!planRows || planRows.length === 0) return []
  const planIds = planRows.map(p => p.id)

  const { data } = await supabase
    .from('plan_packages')
    .select('plan_id, package_id')
    .in('plan_id', planIds)

  return (data ?? []).filter(
    (r): r is PlanPackageLink => r.plan_id !== null && r.package_id !== null,
  )
})

/** Active meal types for a vendor, ordered by display_order (for the subscribe wizard). */
export const getMealTypesForVendor = cache(async (vendorId: string): Promise<StorefrontMealType[]> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('meal_types')
    .select('id, key, label_en, label_ar, price_per_day, display_order')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('display_order')
  return data ?? []
})

// ─── Calorie tiers (dynamic, based on portion sizes per meal type) ───────────

export type StorefrontCalorieTierMeal = {
  meal_type_id: string
  calories: number
}

export type StorefrontCalorieTier = {
  id: string
  name_en: string
  name_ar: string
  sort_order: number
  meals: StorefrontCalorieTierMeal[]
}

/** Calorie tiers for a vendor with per-meal-type calorie values (from portion sizes). */
export const getCalorieTiersForVendor = cache(async (vendorId: string): Promise<StorefrontCalorieTier[]> => {
  const supabase = createSupabaseAdminClient()

  // Fetch active tiers
  const { data: tierRows } = await supabase
    .from('calorie_tiers')
    .select('id, name_en, name_ar, sort_order')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('sort_order')

  if (!tierRows || tierRows.length === 0) return []

  // Fetch all meal assignments with portion size calories
  const tierIds = tierRows.map(t => t.id)
  const { data: mealRows } = await supabase
    .from('calorie_tier_meals')
    .select('calorie_tier_id, meal_type_id, portion_size_id')
    .in('calorie_tier_id', tierIds)

  // Fetch all portion sizes for calorie lookup
  const portionIds = [...new Set((mealRows ?? []).map(m => m.portion_size_id))]
  const { data: portionRows } = portionIds.length > 0
    ? await supabase.from('portion_sizes').select('id, calories').in('id', portionIds)
    : { data: [] }

  const portionCalories = Object.fromEntries((portionRows ?? []).map(p => [p.id, p.calories]))

  return tierRows.map(tier => ({
    id: tier.id,
    name_en: tier.name_en,
    name_ar: tier.name_ar,
    sort_order: tier.sort_order,
    meals: (mealRows ?? [])
      .filter(m => m.calorie_tier_id === tier.id)
      .map(m => ({
        meal_type_id: m.meal_type_id,
        calories: portionCalories[m.portion_size_id] ?? 0,
      })),
  }))
})
