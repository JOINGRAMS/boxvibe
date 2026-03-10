'use server'

import { createSupabaseAdminClient } from '@boxvibe/db'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExtractedIngredient {
  name_en: string
  name_ar: string
  quantity_raw: number
  unit: string
  cooking_loss_percent: number
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

interface ExtractedComponent {
  name_en: string
  name_ar: string
  ingredients: ExtractedIngredient[]
}

interface ExtractedRecipe {
  name_en: string
  name_ar: string
  description: string
  cuisine_tag: string
  prep_method: string
  cooking_method: string
  components: ExtractedComponent[]
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
}

interface ScaledIngredient {
  name_en: string
  quantity_raw_scaled: number
  quantity_cooked: number
  unit: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

interface ScaledVersion {
  plan_id: string
  portion_size_id: string
  target_calories: number
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  ingredients: ScaledIngredient[]
}

// ─── Save extracted recipe to DB ───────────────────────────────────────────────

export async function saveExtractedRecipe(
  vendorId: string,
  recipe: ExtractedRecipe,
): Promise<{ itemId: string; componentIngredientMap: Record<string, string> }> {
  const supabase = createSupabaseAdminClient()
  const now = new Date().toISOString()

  // 1. Create the item
  const slug = recipe.name_en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const { data: item, error: itemError } = await supabase
    .from('items')
    .insert({
      vendor_id: vendorId,
      name_en: recipe.name_en,
      name_ar: recipe.name_ar,
      slug,
      description: recipe.description,
      cuisine_tag: recipe.cuisine_tag,
      prep_method: recipe.prep_method,
      cooking_method: recipe.cooking_method,
      base_calories: recipe.total_calories,
      base_protein_g: recipe.total_protein_g,
      base_carbs_g: recipe.total_carbs_g,
      base_fat_g: recipe.total_fat_g,
      ai_reviewed: false,
      is_active: true,
      updated_at: now,
    })
    .select('id')
    .single()

  if (itemError || !item) throw new Error(`Failed to create item: ${itemError?.message}`)

  // Map from "componentIndex-ingredientIndex" → component_ingredient_id (for linking scaled versions)
  const componentIngredientMap: Record<string, string> = {}

  // 2. For each component, create component + ingredients
  for (let ci = 0; ci < recipe.components.length; ci++) {
    const comp = recipe.components[ci]

    // Create the component
    const { data: dbComp, error: compError } = await supabase
      .from('components')
      .insert({
        vendor_id: vendorId,
        item_id: item.id,
        name_en: comp.name_en,
        name_ar: comp.name_ar,
        updated_at: now,
      })
      .select('id')
      .single()

    if (compError || !dbComp) throw new Error(`Failed to create component: ${compError?.message}`)

    // 3. For each ingredient in this component
    for (let ii = 0; ii < comp.ingredients.length; ii++) {
      const ing = comp.ingredients[ii]

      // Upsert ingredient into vendor's ingredient catalog
      // Check if ingredient already exists by name
      const { data: existingIng } = await supabase
        .from('ingredients')
        .select('id')
        .eq('vendor_id', vendorId)
        .eq('name_en', ing.name_en)
        .maybeSingle()

      let ingredientId: string

      if (existingIng) {
        ingredientId = existingIng.id
        // Update nutritional data if we have it
        await supabase
          .from('ingredients')
          .update({
            calories_per_100g: ing.calories_per_100g,
            protein_per_100g: ing.protein_per_100g,
            carbs_per_100g: ing.carbs_per_100g,
            fat_per_100g: ing.fat_per_100g,
            updated_at: now,
          })
          .eq('id', ingredientId)
      } else {
        const { data: newIng, error: ingError } = await supabase
          .from('ingredients')
          .insert({
            vendor_id: vendorId,
            name_en: ing.name_en,
            name_ar: ing.name_ar,
            unit: ing.unit,
            calories_per_100g: ing.calories_per_100g,
            protein_per_100g: ing.protein_per_100g,
            carbs_per_100g: ing.carbs_per_100g,
            fat_per_100g: ing.fat_per_100g,
            is_active: true,
            updated_at: now,
          })
          .select('id')
          .single()

        if (ingError || !newIng) throw new Error(`Failed to create ingredient: ${ingError?.message}`)
        ingredientId = newIng.id
      }

      // Create the component_ingredient junction
      const { data: ci_row, error: ciError } = await supabase
        .from('component_ingredients')
        .insert({
          vendor_id: vendorId,
          component_id: dbComp.id,
          ingredient_id: ingredientId,
          quantity_raw: ing.quantity_raw,
          cooking_loss_percent: ing.cooking_loss_percent,
          unit: ing.unit,
          updated_at: now,
        })
        .select('id')
        .single()

      if (ciError || !ci_row) throw new Error(`Failed to create component_ingredient: ${ciError?.message}`)

      // Map by ingredient name (used to match scaled versions later)
      componentIngredientMap[ing.name_en] = ci_row.id
    }
  }

  return { itemId: item.id, componentIngredientMap }
}

// ─── Save scaled versions to DB ────────────────────────────────────────────────

export async function saveScaledVersions(
  vendorId: string,
  itemId: string,
  versions: ScaledVersion[],
  componentIngredientMap: Record<string, string>,
): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const now = new Date().toISOString()

  for (const version of versions) {
    // Create item_version
    const { data: iv, error: ivError } = await supabase
      .from('item_versions')
      .insert({
        vendor_id: vendorId,
        item_id: itemId,
        plan_id: version.plan_id,
        portion_size_id: version.portion_size_id,
        total_calories: version.total_calories,
        total_protein_g: version.total_protein_g,
        total_carbs_g: version.total_carbs_g,
        total_fat_g: version.total_fat_g,
        is_active: true,
        updated_at: now,
      })
      .select('id')
      .single()

    if (ivError || !iv) throw new Error(`Failed to create item_version: ${ivError?.message}`)

    // Create item_version_ingredients
    for (const scaledIng of version.ingredients) {
      const ciId = componentIngredientMap[scaledIng.name_en]
      if (!ciId) continue // skip if we can't find the matching component_ingredient

      await supabase
        .from('item_version_ingredients')
        .insert({
          item_version_id: iv.id,
          component_ingredient_id: ciId,
          quantity_raw_scaled: scaledIng.quantity_raw_scaled,
          quantity_cooked: scaledIng.quantity_cooked,
          calories: scaledIng.calories,
          protein_g: scaledIng.protein_g,
          carbs_g: scaledIng.carbs_g,
          fat_g: scaledIng.fat_g,
        })
    }
  }

  // Mark item as AI reviewed
  await supabase
    .from('items')
    .update({ ai_reviewed: true, updated_at: now })
    .eq('id', itemId)
}
