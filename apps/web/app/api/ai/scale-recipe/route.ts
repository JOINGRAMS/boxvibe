import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface IngredientInput {
  name_en: string
  quantity_raw: number
  unit: string
  cooking_loss_percent: number
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

interface ComponentInput {
  name_en: string
  ingredients: IngredientInput[]
}

interface PlanMacros {
  plan_id: string
  plan_name: string
  protein_pct: number
  carb_pct: number
  fat_pct: number
}

interface PortionTarget {
  portion_size_id: string
  portion_name: string
  target_calories: number
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
  plan_name: string
  portion_size_id: string
  portion_name: string
  target_calories: number
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  ingredients: ScaledIngredient[]
}

// ─── AI Scaling Prompt ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert nutritionist and portion scaling specialist for a meal prep business.

Your job is to take a base recipe and scale ingredient quantities to produce versions that hit specific calorie targets while respecting each plan's macro distribution (protein/carb/fat percentages).

CRITICAL RULES:
1. NEVER change the recipe — same ingredients, same cooking method. Only adjust quantities (grammage).
2. Scale each ingredient proportionally, but bias the scaling to hit the plan's macro split:
   - If a plan is High Protein (40% protein), scale protein-rich ingredients UP relative to others.
   - If a plan is Low Carb (15% carbs), scale carb-heavy ingredients DOWN relative to others.
3. The total calories of the scaled version must be within ±5% of the target_calories.
4. Macro percentages must be within ±3% of the plan's targets.
5. Apply cooking loss to get cooked quantities: quantity_cooked = quantity_raw_scaled × (1 - cooking_loss_percent/100)
6. Calculate per-ingredient macros from RAW weight: (quantity_raw_scaled / 100) × per_100g_value
7. Round all quantities to 1 decimal place.

MACRO CALORIE CONVERSION:
- Protein: 4 kcal/g
- Carbohydrates: 4 kcal/g
- Fat: 9 kcal/g

Respond ONLY with valid JSON — an array of scaled versions:
[
  {
    "plan_id": "uuid",
    "plan_name": "string",
    "portion_size_id": "uuid",
    "portion_name": "string",
    "target_calories": 400,
    "total_calories": 398,
    "total_protein_g": 40,
    "total_carbs_g": 35,
    "total_fat_g": 10,
    "ingredients": [
      {
        "name_en": "Chicken Breast",
        "quantity_raw_scaled": 150.0,
        "quantity_cooked": 112.5,
        "unit": "g",
        "calories": 247.5,
        "protein_g": 46.5,
        "carbs_g": 0,
        "fat_g": 5.4
      }
    ]
  }
]`

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { components, plans, portions } = body as {
      components: ComponentInput[]
      plans: PlanMacros[]
      portions: PortionTarget[]
    }

    if (!components?.length || !plans?.length || !portions?.length) {
      return NextResponse.json(
        { error: 'components, plans, and portions are all required' },
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

    // Build the user message with all recipe + plan + portion data
    const userMessage = `Scale the following base recipe into ${plans.length * portions.length} versions (one for each plan × portion_size combination).

BASE RECIPE COMPONENTS:
${JSON.stringify(components, null, 2)}

PLANS (with target macro splits):
${JSON.stringify(plans, null, 2)}

PORTION SIZE TARGETS:
${JSON.stringify(portions, null, 2)}

Generate one scaled version for EVERY combination of plan × portion_size. That means ${plans.length} plans × ${portions.length} portion sizes = ${plans.length * portions.length} versions total.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16384,
      messages: [{ role: 'user', content: userMessage }],
      system: SYSTEM_PROMPT,
    })

    // Check if the response was truncated
    if (message.stop_reason === 'max_tokens') {
      return NextResponse.json(
        { error: 'AI response was truncated — too many plan×portion combinations. Try fewer plans or portions.' },
        { status: 500 },
      )
    }

    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    let versions: ScaledVersion[]
    try {
      const raw = textBlock.text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
      versions = JSON.parse(raw) as ScaledVersion[]
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON', raw: textBlock.text },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: versions })
  } catch (error) {
    console.error('AI scale-recipe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
