import { createSupabaseAdminClient } from '../client'

// ─── Types ───────────────────────────────────────────────────────────────────

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
