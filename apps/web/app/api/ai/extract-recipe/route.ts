import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseAdminClient } from '@boxvibe/db'

// ─── Types for the structured AI response ──────────────────────────────────────

interface ExtractedIngredient {
  name_en: string
  name_ar: string
  quantity_raw: number       // grams or ml before cooking
  unit: string               // 'g', 'ml', 'pcs'
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

// ─── AI Extraction Prompt ──────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert nutritionist and culinary scientist. Your job is to extract structured recipe data from documents uploaded by meal prep businesses.

CRITICAL RULES:
1. NEVER change, alter, or modify the recipe itself. Extract exactly what is in the document.
2. If ingredient quantities are given, use them exactly. Do NOT substitute or adjust.
3. Calculate nutritional macros using standard nutritional science:
   - Protein: 4 kcal/g
   - Carbohydrates: 4 kcal/g
   - Fat: 9 kcal/g
4. Account for cooking loss when calculating cooked weight macros. Cooking loss affects weight but concentrates nutrients per gram of cooked food.
5. Provide per-100g nutritional values for each raw ingredient based on standard food science data.
6. All weights should be in grams (g), liquids in milliliters (ml).
7. Provide both English and Arabic names for the dish and each component/ingredient.
8. For Arabic names: provide accurate Arabic food terminology. If unsure, transliterate.
9. Identify the cuisine type (e.g., Mediterranean, Asian, Middle Eastern, Western, etc.)
10. The prep_method should describe preparation steps (washing, cutting, marinating, etc.)
11. The cooking_method should describe cooking technique (grilling, baking, boiling, sautéing, etc.)

COOKING LOSS GUIDELINES (use these defaults if not specified in the document):
- Chicken breast: 25%
- Beef/lamb: 30%
- Fish: 20%
- Rice/pasta (absorbs water, gains weight): -100% (doubles in weight)
- Vegetables (roasted): 20%
- Vegetables (raw): 0%
- Eggs: 10%

Respond ONLY with valid JSON matching this exact schema — no markdown, no explanation:
{
  "name_en": "string",
  "name_ar": "string",
  "description": "Brief description of the dish",
  "cuisine_tag": "string (e.g. Mediterranean, Asian, Middle Eastern)",
  "prep_method": "string describing preparation steps",
  "cooking_method": "string describing cooking technique",
  "components": [
    {
      "name_en": "Sub-recipe name (e.g. Spiced Chicken Breast)",
      "name_ar": "Arabic name",
      "ingredients": [
        {
          "name_en": "Ingredient name",
          "name_ar": "Arabic name",
          "quantity_raw": 150,
          "unit": "g",
          "cooking_loss_percent": 25,
          "calories_per_100g": 165,
          "protein_per_100g": 31,
          "carbs_per_100g": 0,
          "fat_per_100g": 3.6
        }
      ]
    }
  ],
  "total_calories": 0,
  "total_protein_g": 0,
  "total_carbs_g": 0,
  "total_fat_g": 0
}

Calculate totals by summing each ingredient's contribution:
- ingredient_calories = (quantity_raw / 100) * calories_per_100g
- ingredient_protein = (quantity_raw / 100) * protein_per_100g
- ingredient_carbs = (quantity_raw / 100) * carbs_per_100g
- ingredient_fat = (quantity_raw / 100) * fat_per_100g
Sum all ingredients across all components for totals.`

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendor_id, recipe_text, recipe_import_id } = body as {
      vendor_id: string
      recipe_text: string
      recipe_import_id?: string
    }

    if (!vendor_id || !recipe_text) {
      return NextResponse.json(
        { error: 'vendor_id and recipe_text are required' },
        { status: 400 },
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 },
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // Call Claude to extract the recipe
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Extract the structured recipe data from the following document/text. Follow the system instructions exactly.\n\n---\n\n${recipe_text}`,
        },
      ],
      system: SYSTEM_PROMPT,
    })

    // Extract the text response
    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    // Parse the JSON response (strip markdown fences if present)
    let extracted: ExtractedRecipe
    try {
      const raw = textBlock.text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
      extracted = JSON.parse(raw) as ExtractedRecipe
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON', raw: textBlock.text },
        { status: 500 },
      )
    }

    // If a recipe_import_id was provided, update the record with extracted data
    if (recipe_import_id) {
      const supabase = createSupabaseAdminClient()
      await supabase
        .from('recipe_imports')
        .update({
          status: 'completed',
          ai_raw_response: JSON.parse(JSON.stringify(message)),
          ai_extracted_data: JSON.parse(JSON.stringify(extracted)),
          updated_at: new Date().toISOString(),
        })
        .eq('id', recipe_import_id)
    }

    return NextResponse.json({ success: true, data: extracted })
  } catch (error) {
    console.error('AI extract-recipe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
