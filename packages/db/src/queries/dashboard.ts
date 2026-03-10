import { createSupabaseAdminClient } from '../client'

// ─── Types ───────────────────────────────────────────────────────────────────

export type DashboardPlan = {
  id: string
  vendor_id: string
  name_en: string
  name_ar: string
  desc_en: string | null
  desc_ar: string | null
  cover_image: string | null
  slug: string | null
  is_active: boolean
  protein_pct: number
  carb_pct: number
  fat_pct: number
  price_adjustment: number
  sort_order: number
}

export type PortionSize = {
  id: string
  vendor_id: string
  name_en: string
  name_ar: string
  symbol: string
  calories: number
  sort_order: number
  is_active: boolean
}

export type DashboardMealType = {
  id: string
  key: string
  label_en: string
  label_ar: string
  display_order: number
  is_active: boolean
  portions: MealTypePortionPrice[]
}

export type MealTypePortionPrice = {
  id: string
  meal_type_id: string
  portion_size_id: string
  base_price: number
}

// ─── Portion Size Queries ────────────────────────────────────────────────────

export async function getPortionSizes(vendorId: string): Promise<PortionSize[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('portion_sizes')
    .select('id, vendor_id, name_en, name_ar, symbol, calories, sort_order, is_active')
    .eq('vendor_id', vendorId)
    .order('calories')

  if (error) throw error
  return data ?? []
}

export async function upsertPortionSizes(
  vendorId: string,
  portions: Array<{
    id?: string
    name_en: string
    name_ar: string
    symbol: string
    calories: number
    sort_order: number
  }>
): Promise<PortionSize[]> {
  const supabase = createSupabaseAdminClient()

  // Delete removed portions (those not in the new list that have IDs)
  const existingIds = portions.filter(p => p.id).map(p => p.id as string)

  if (existingIds.length > 0) {
    await supabase
      .from('portion_sizes')
      .delete()
      .eq('vendor_id', vendorId)
      .not('id', 'in', `(${existingIds.join(',')})`)
  } else {
    // If no existing IDs, delete all old portions for this vendor
    await supabase
      .from('portion_sizes')
      .delete()
      .eq('vendor_id', vendorId)
  }

  const results: PortionSize[] = []

  for (const portion of portions) {
    if (portion.id) {
      // Update existing
      const { data, error } = await supabase
        .from('portion_sizes')
        .update({
          name_en: portion.name_en,
          name_ar: portion.name_ar,
          symbol: portion.symbol,
          calories: portion.calories,
          sort_order: portion.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portion.id)
        .select('id, vendor_id, name_en, name_ar, symbol, calories, sort_order, is_active')
        .single()
      if (error) throw error
      if (data) results.push(data)
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('portion_sizes')
        .insert({
          vendor_id: vendorId,
          name_en: portion.name_en,
          name_ar: portion.name_ar,
          symbol: portion.symbol,
          calories: portion.calories,
          sort_order: portion.sort_order,
        })
        .select('id, vendor_id, name_en, name_ar, symbol, calories, sort_order, is_active')
        .single()
      if (error) throw error
      if (data) results.push(data)
    }
  }

  return results
}

// ─── Meal Type Queries ───────────────────────────────────────────────────────

export async function getMealTypesWithPortions(vendorId: string): Promise<DashboardMealType[]> {
  const supabase = createSupabaseAdminClient()

  const { data: mealTypes, error: mtError } = await supabase
    .from('meal_types')
    .select('id, key, label_en, label_ar, display_order, is_active')
    .eq('vendor_id', vendorId)
    .order('display_order')

  if (mtError) throw mtError
  if (!mealTypes || mealTypes.length === 0) return []

  const mealTypeIds = mealTypes.map(mt => mt.id)

  const { data: prices, error: priceError } = await supabase
    .from('meal_type_portion_prices')
    .select('id, meal_type_id, portion_size_id, base_price')
    .in('meal_type_id', mealTypeIds)

  if (priceError) throw priceError

  return mealTypes.map(mt => ({
    ...mt,
    portions: (prices ?? []).filter(p => p.meal_type_id === mt.id),
  }))
}

export async function createMealType(
  vendorId: string,
  data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }
): Promise<string> {
  const supabase = createSupabaseAdminClient()

  // Get the next display_order
  const { data: existing } = await supabase
    .from('meal_types')
    .select('display_order')
    .eq('vendor_id', vendorId)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0

  // Generate key from label
  const key = data.label_en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')

  const { data: mealType, error: mtError } = await supabase
    .from('meal_types')
    .insert({
      vendor_id: vendorId,
      key,
      label_en: data.label_en,
      label_ar: data.label_ar,
      display_order: nextOrder,
    })
    .select('id')
    .single()

  if (mtError) throw mtError

  // Insert portion prices
  if (data.portionPrices.length > 0) {
    const { error: priceError } = await supabase
      .from('meal_type_portion_prices')
      .insert(
        data.portionPrices.map(pp => ({
          meal_type_id: mealType.id,
          portion_size_id: pp.portion_size_id,
          base_price: pp.base_price,
        }))
      )
    if (priceError) throw priceError
  }

  return mealType.id
}

export async function updateMealType(
  mealTypeId: string,
  data: {
    label_en: string
    label_ar: string
    portionPrices: Array<{ portion_size_id: string; base_price: number }>
  }
): Promise<void> {
  const supabase = createSupabaseAdminClient()

  const key = data.label_en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')

  const { error: mtError } = await supabase
    .from('meal_types')
    .update({ label_en: data.label_en, label_ar: data.label_ar, key })
    .eq('id', mealTypeId)

  if (mtError) throw mtError

  // Replace all portion prices for this meal type
  await supabase
    .from('meal_type_portion_prices')
    .delete()
    .eq('meal_type_id', mealTypeId)

  if (data.portionPrices.length > 0) {
    const { error: priceError } = await supabase
      .from('meal_type_portion_prices')
      .insert(
        data.portionPrices.map(pp => ({
          meal_type_id: mealTypeId,
          portion_size_id: pp.portion_size_id,
          base_price: pp.base_price,
        }))
      )
    if (priceError) throw priceError
  }
}

export async function deleteMealType(mealTypeId: string): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('meal_types')
    .delete()
    .eq('id', mealTypeId)
  if (error) throw error
}

export async function reorderMealTypes(
  vendorId: string,
  orderedIds: string[]
): Promise<void> {
  const supabase = createSupabaseAdminClient()

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('meal_types')
      .update({ display_order: i })
      .eq('id', orderedIds[i])
      .eq('vendor_id', vendorId)
    if (error) throw error
  }
}

// ─── Plan Queries ───────────────────────────────────────────────────────────

const PLAN_SELECT = 'id, vendor_id, name_en, name_ar, desc_en, desc_ar, cover_image, slug, is_active, protein_pct, carb_pct, fat_pct, price_adjustment, sort_order' as const

export async function getDashboardPlans(vendorId: string): Promise<DashboardPlan[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('plans')
    .select(PLAN_SELECT)
    .eq('vendor_id', vendorId)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function createPlan(
  vendorId: string,
  data: {
    name_en: string
    desc_en: string
    cover_image: string | null
    protein_pct: number
    carb_pct: number
    fat_pct: number
    price_adjustment: number
  }
): Promise<string> {
  const supabase = createSupabaseAdminClient()

  // Get next sort_order
  const { data: existing } = await supabase
    .from('plans')
    .select('sort_order')
    .eq('vendor_id', vendorId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  // Generate slug from name
  const slug = data.name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data: plan, error } = await supabase
    .from('plans')
    .insert({
      vendor_id: vendorId,
      name_en: data.name_en,
      name_ar: '',
      desc_en: data.desc_en || null,
      desc_ar: null,
      cover_image: data.cover_image,
      slug,
      protein_pct: data.protein_pct,
      carb_pct: data.carb_pct,
      fat_pct: data.fat_pct,
      price_adjustment: data.price_adjustment,
      sort_order: nextOrder,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) throw error
  return plan.id
}

export async function updatePlanDetails(
  planId: string,
  data: {
    name_en: string
    desc_en: string
    cover_image: string | null
  }
): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const slug = data.name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const { error } = await supabase
    .from('plans')
    .update({
      name_en: data.name_en,
      desc_en: data.desc_en || null,
      cover_image: data.cover_image,
      slug,
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
  if (error) throw error
}

export async function updatePlanMacros(
  planId: string,
  data: { protein_pct: number; carb_pct: number; fat_pct: number }
): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('plans')
    .update({
      protein_pct: data.protein_pct,
      carb_pct: data.carb_pct,
      fat_pct: data.fat_pct,
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
  if (error) throw error
}

export async function updatePlanPriceAdjustment(
  planId: string,
  priceAdjustment: number
): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('plans')
    .update({
      price_adjustment: priceAdjustment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)
  if (error) throw error
}

export async function togglePlanActive(planId: string, isActive: boolean): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('plans')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', planId)
  if (error) throw error
}

export async function deletePlan(planId: string): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', planId)
  if (error) throw error
}

// ─── Calorie Tier Queries ───────────────────────────────────────────────────

export type CalorieTier = {
  id: string
  vendor_id: string
  name_en: string
  name_ar: string
  sort_order: number
  is_active: boolean
  meals: CalorieTierMeal[]
}

export type CalorieTierMeal = {
  id: string
  calorie_tier_id: string
  meal_type_id: string
  portion_size_id: string
}

export async function getCalorieTiers(vendorId: string): Promise<CalorieTier[]> {
  const supabase = createSupabaseAdminClient()

  const { data: tiers, error: tierError } = await supabase
    .from('calorie_tiers')
    .select('id, vendor_id, name_en, name_ar, sort_order, is_active')
    .eq('vendor_id', vendorId)
    .order('sort_order')

  if (tierError) throw tierError
  if (!tiers || tiers.length === 0) return []

  const tierIds = tiers.map(t => t.id)

  const { data: tierMeals, error: mealError } = await supabase
    .from('calorie_tier_meals')
    .select('id, calorie_tier_id, meal_type_id, portion_size_id')
    .in('calorie_tier_id', tierIds)

  if (mealError) throw mealError

  return tiers.map(t => ({
    ...t,
    meals: (tierMeals ?? []).filter(m => m.calorie_tier_id === t.id),
  }))
}

export async function saveCalorieTiers(
  vendorId: string,
  tiers: Array<{
    id?: string
    name_en: string
    name_ar: string
    sort_order: number
    meals: Array<{ meal_type_id: string; portion_size_id: string }>
  }>
): Promise<void> {
  const supabase = createSupabaseAdminClient()

  // Delete all existing tiers for this vendor (cascade deletes tier_meals)
  await supabase
    .from('calorie_tiers')
    .delete()
    .eq('vendor_id', vendorId)

  // Insert new tiers
  for (const tier of tiers) {
    const { data: newTier, error: tierError } = await supabase
      .from('calorie_tiers')
      .insert({
        vendor_id: vendorId,
        name_en: tier.name_en,
        name_ar: tier.name_ar,
        sort_order: tier.sort_order,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (tierError) throw tierError

    if (tier.meals.length > 0) {
      const { error: mealError } = await supabase
        .from('calorie_tier_meals')
        .insert(
          tier.meals.map(m => ({
            calorie_tier_id: newTier.id,
            meal_type_id: m.meal_type_id,
            portion_size_id: m.portion_size_id,
          }))
        )
      if (mealError) throw mealError
    }
  }
}
