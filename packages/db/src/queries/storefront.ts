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
}

export type StorefrontTier = {
  id: string
  variance_name_en: string
  variance_name_ar: string
  total_price: number
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
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug')
    .in('id', packageIds)
    .eq('is_active', true)
    .order('category_en')

  return data ?? []
})

export const getPackageBySlug = cache(async (vendorId: string, packageSlug: string): Promise<StorefrontPackage | null> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('packages')
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug')
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
    .select('id, variance_name_en, variance_name_ar, total_price')
    .eq('plan_id', planId)
    .order('total_price')
  return data ?? []
})

// ─── Wizard queries (vendor-scoped, for the subscribe wizard) ─────────────────

/** All active packages belonging to a vendor (for the subscription wizard step 1). */
export const getPackagesForVendor = cache(async (vendorId: string): Promise<StorefrontPackage[]> => {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('packages')
    .select('id, category_en, category_ar, description_en, description_ar, cover_image_url, price_multiplier, slug')
    .eq('vendor_id', vendorId)
    .eq('is_active', true)
    .order('price_multiplier')
  return data ?? []
})

/** All calorie tiers across all active plans for a vendor (for the subscription wizard step 2). */
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
    .select('id, variance_name_en, variance_name_ar, total_price')
    .in('plan_id', planIds)
    .order('total_price')

  return data ?? []
})
