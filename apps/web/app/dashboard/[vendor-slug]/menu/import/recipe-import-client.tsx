'use client'

import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, FileText, ChefHat } from 'lucide-react'
import { saveExtractedRecipe, saveScaledVersions } from './actions'
import { RecipeCard } from './recipe-card'
import type { DashboardPlan, PortionSize, StorefrontMealType } from '@boxvibe/db'

// ─── Types matching the AI response ────────────────────────────────────────────

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

// ─── Component ─────────────────────────────────────────────────────────────────

type Step = 'input' | 'extracting' | 'review' | 'saving' | 'scaling' | 'versions'

interface Props {
  vendorId: string
  vendorSlug: string
  plans: DashboardPlan[]
  portionSizes: PortionSize[]
  mealTypes: StorefrontMealType[]
}

export function RecipeImportClient({ vendorId, plans, portionSizes, mealTypes }: Props) {
  const [step, setStep] = useState<Step>('input')
  const [recipeText, setRecipeText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedRecipe | null>(null)
  const [scaledVersions, setScaledVersions] = useState<ScaledVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<ScaledVersion | null>(null)

  // User selections on the review screen
  const [selectedMealTypeIds, setSelectedMealTypeIds] = useState<string[]>([])
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>(() => plans.map(p => p.id))
  const [selectedPortionIds, setSelectedPortionIds] = useState<string[]>(() => portionSizes.map(p => p.id))

  // Derived: which plans/portions to actually use
  const activePlans = plans.filter(p => selectedPlanIds.includes(p.id))
  const activePortions = portionSizes.filter(p => selectedPortionIds.includes(p.id))
  const totalVersions = activePlans.length * activePortions.length

  // Setup checks
  const hasPlans = plans.length > 0
  const hasPortions = portionSizes.length > 0
  const hasMealTypes = mealTypes.length > 0
  const setupComplete = hasPlans && hasPortions && hasMealTypes

  // ─── Step 1: Extract recipe via AI ────────────────────────────────────────

  async function handleExtract() {
    if (!recipeText.trim()) return
    setError(null)
    setStep('extracting')

    try {
      const res = await fetch('/api/ai/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor_id: vendorId, recipe_text: recipeText }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Failed to extract recipe')

      setExtracted(json.data as ExtractedRecipe)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('input')
    }
  }

  // ─── Step 2: Save to DB + Scale via AI ────────────────────────────────────

  async function handleConfirmAndScale() {
    if (!extracted || selectedMealTypeIds.length === 0) return
    if (activePlans.length === 0 || activePortions.length === 0) return
    setError(null)
    setStep('saving')

    try {
      // 1. Save the base recipe to DB (with meal_type_id)
      const { itemId, componentIngredientMap } = await saveExtractedRecipe(
        vendorId,
        extracted,
        selectedMealTypeIds,
      )

      setStep('scaling')

      // 2. Call scale-recipe AI endpoint with only selected plans & portions
      const res = await fetch('/api/ai/scale-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: extracted.components.map(c => ({
            name_en: c.name_en,
            ingredients: c.ingredients.map(i => ({
              name_en: i.name_en,
              quantity_raw: i.quantity_raw,
              unit: i.unit,
              cooking_loss_percent: i.cooking_loss_percent,
              calories_per_100g: i.calories_per_100g,
              protein_per_100g: i.protein_per_100g,
              carbs_per_100g: i.carbs_per_100g,
              fat_per_100g: i.fat_per_100g,
            })),
          })),
          plans: activePlans.map(p => ({
            plan_id: p.id,
            plan_name: p.name_en,
            protein_pct: p.protein_pct,
            carb_pct: p.carb_pct,
            fat_pct: p.fat_pct,
          })),
          portions: activePortions.map(ps => ({
            portion_size_id: ps.id,
            portion_name: ps.name_en,
            target_calories: ps.calories,
          })),
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Failed to scale recipe')

      const versions = json.data as ScaledVersion[]
      setScaledVersions(versions)

      // 3. Save scaled versions to DB
      await saveScaledVersions(vendorId, itemId, versions, componentIngredientMap)

      setStep('versions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('review')
    }
  }

  function handleReset() {
    setStep('input')
    setRecipeText('')
    setExtracted(null)
    setScaledVersions([])
    setSelectedVersion(null)
    setSelectedMealTypeIds([])
    setSelectedPlanIds(plans.map(p => p.id))
    setSelectedPortionIds(portionSizes.map(p => p.id))
    setError(null)
  }

  function toggleMealType(mealTypeId: string) {
    setSelectedMealTypeIds(prev =>
      prev.includes(mealTypeId) ? prev.filter(id => id !== mealTypeId) : [...prev, mealTypeId],
    )
  }

  function togglePlan(planId: string) {
    setSelectedPlanIds(prev =>
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId],
    )
  }

  function togglePortion(portionId: string) {
    setSelectedPortionIds(prev =>
      prev.includes(portionId) ? prev.filter(id => id !== portionId) : [...prev, portionId],
    )
  }

  // ─── Render: Setup incomplete ─────────────────────────────────────────────

  if (!setupComplete) {
    return (
      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-amber-800">Vendor setup required before importing recipes</p>
            <p className="text-sm text-amber-700">
              The AI Meal Builder needs your vendor&apos;s plans, portion sizes, and meal types configured. Please complete these steps first:
            </p>
            <ul className="ml-1 space-y-1 text-sm text-amber-700">
              <li className="flex items-center gap-2">
                {hasPlans ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                <span className={hasPlans ? 'text-emerald-700' : ''}>
                  Plans with macro splits (protein/carb/fat %) — {hasPlans ? `${plans.length} configured` : 'not set up'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasPortions ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                <span className={hasPortions ? 'text-emerald-700' : ''}>
                  Portion sizes with calorie targets — {hasPortions ? `${portionSizes.length} configured` : 'not set up'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasMealTypes ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                <span className={hasMealTypes ? 'text-emerald-700' : ''}>
                  Meal types (breakfast, lunch, dinner…) — {hasMealTypes ? `${mealTypes.length} configured` : 'not set up'}
                </span>
              </li>
            </ul>
            <p className="text-xs text-amber-600">
              Go to Plans Setup in the sidebar to configure these.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: Input step ─────────────────────────────────────────────────────

  if (step === 'input') {
    return (
      <div className="mt-8 space-y-6">
        {error && <ErrorBanner message={error} />}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Paste recipe document
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Include ingredients with quantities, preparation method, and cooking method. The AI will extract everything automatically.
          </p>
          <textarea
            value={recipeText}
            onChange={e => setRecipeText(e.target.value)}
            rows={14}
            placeholder={`Example:\n\nGrilled Chicken Salad\n\nIngredients:\n- 200g chicken breast\n- 100g mixed greens\n- 50g cherry tomatoes\n- 30g cucumber\n- 15ml olive oil\n- 5ml lemon juice\n\nPreparation:\n1. Season chicken with salt and pepper\n2. Grill at 200°C for 6 min each side\n\nCooking loss: chicken loses ~25% weight when grilled`}
            className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <button
          onClick={handleExtract}
          disabled={!recipeText.trim()}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          <Sparkles className="h-4 w-4" />
          Extract with AI
        </button>
      </div>
    )
  }

  // ─── Render: Loading states ─────────────────────────────────────────────────

  if (step === 'extracting' || step === 'saving' || step === 'scaling') {
    const messages: Record<string, { title: string; subtitle: string }> = {
      extracting: { title: 'AI is analyzing your recipe...', subtitle: 'Extracting ingredients, calculating macros, and identifying cuisine' },
      saving: { title: 'Saving recipe to database...', subtitle: 'Creating item, components, and ingredients' },
      scaling: { title: 'AI is generating portion versions...', subtitle: `Scaling to ${activePlans.length} plans × ${activePortions.length} portion sizes = ${totalVersions} versions` },
    }
    const msg = messages[step]
    return (
      <div className="mt-16 flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{msg.title}</p>
          <p className="mt-1 text-xs text-gray-400">{msg.subtitle}</p>
        </div>
      </div>
    )
  }

  // ─── Render: Review extracted data ──────────────────────────────────────────

  if (step === 'review' && extracted) {
    const canGenerate = selectedMealTypeIds.length > 0 && activePlans.length > 0 && activePortions.length > 0

    return (
      <div className="mt-8 space-y-6">
        {error && <ErrorBanner message={error} />}

        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">Recipe extracted successfully</p>
        </div>

        {/* Recipe summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{extracted.name_en}</h2>
              <p className="text-sm text-gray-400" dir="rtl">{extracted.name_ar}</p>
            </div>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {extracted.cuisine_tag}
            </span>
          </div>

          <p className="text-sm text-gray-600">{extracted.description}</p>

          <div className="grid grid-cols-4 gap-3">
            <MacroCard label="Calories" value={extracted.total_calories} unit="kcal" color="amber" />
            <MacroCard label="Protein" value={extracted.total_protein_g} unit="g" color="rose" />
            <MacroCard label="Carbs" value={extracted.total_carbs_g} unit="g" color="blue" />
            <MacroCard label="Fat" value={extracted.total_fat_g} unit="g" color="yellow" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Preparation</p>
              <p className="mt-1 text-gray-500">{extracted.prep_method}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Cooking</p>
              <p className="mt-1 text-gray-500">{extracted.cooking_method}</p>
            </div>
          </div>
        </div>

        {/* Ingredients tables */}
        {extracted.components.map((comp, ci) => (
          <div key={ci} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{comp.name_en}</p>
              <p className="text-xs text-gray-400" dir="rtl">{comp.name_ar}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="px-5 py-2.5 text-left font-medium">Ingredient</th>
                    <th className="px-3 py-2.5 text-right font-medium">Qty (raw)</th>
                    <th className="px-3 py-2.5 text-right font-medium">Unit</th>
                    <th className="px-3 py-2.5 text-right font-medium">Cook loss</th>
                    <th className="px-3 py-2.5 text-right font-medium">Cal/100g</th>
                    <th className="px-3 py-2.5 text-right font-medium">Pro/100g</th>
                    <th className="px-3 py-2.5 text-right font-medium">Carb/100g</th>
                    <th className="px-3 py-2.5 text-right font-medium">Fat/100g</th>
                  </tr>
                </thead>
                <tbody>
                  {comp.ingredients.map((ing, ii) => (
                    <tr key={ii} className={ii < comp.ingredients.length - 1 ? 'border-b border-gray-50' : ''}>
                      <td className="px-5 py-2.5 text-gray-700">{ing.name_en}</td>
                      <td className="px-3 py-2.5 text-right text-gray-600">{ing.quantity_raw}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.unit}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.cooking_loss_percent}%</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.calories_per_100g}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.protein_per_100g}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.carbs_per_100g}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400">{ing.fat_per_100g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* ─── Meal Type Selection ──────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <ChefHat className="h-4 w-4" />
            Assign meal type(s)
          </div>
          <p className="text-xs text-gray-400">
            Select one or more meal types. This determines where the dish appears on the menu.
          </p>
          <div className="flex flex-wrap gap-2">
            {mealTypes.map(mt => (
              <button
                key={mt.id}
                onClick={() => toggleMealType(mt.id)}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  selectedMealTypeIds.includes(mt.id)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                {mt.label_en}
              </button>
            ))}
          </div>
          {selectedMealTypeIds.length === 0 && (
            <p className="text-xs text-amber-600">Please select at least one meal type to continue.</p>
          )}
        </div>

        {/* ─── Plans Selection ──────────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-800">Select plans to generate</p>
          <p className="text-xs text-gray-400">
            Choose which dietary plans should get scaled versions of this recipe.
          </p>
          <div className="flex flex-wrap gap-2">
            {plans.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlan(p.id)}
                className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                  selectedPlanIds.includes(p.id)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {p.name_en}
                <span className="ml-1.5 text-xs opacity-60">
                  P{p.protein_pct}/C{p.carb_pct}/F{p.fat_pct}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Portion Sizes Selection ──────────────────────────────────── */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-800">Select portion sizes</p>
          <p className="text-xs text-gray-400">
            Choose which portion sizes (calorie targets) to generate.
          </p>
          <div className="flex flex-wrap gap-2">
            {portionSizes.map(ps => (
              <button
                key={ps.id}
                onClick={() => togglePortion(ps.id)}
                className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                  selectedPortionIds.includes(ps.id)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                    : 'border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {ps.symbol} — {ps.name_en}
                <span className="ml-1.5 text-xs opacity-60">{ps.calories} kcal</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Generation summary + action ──────────────────────────────── */}
        {canGenerate ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <p className="text-sm text-emerald-800">
              Will generate <strong>{totalVersions}</strong> versions: {activePlans.length} plan{activePlans.length > 1 ? 's' : ''} × {activePortions.length} portion size{activePortions.length > 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              {selectedMealTypeIds.length === 0 && 'Select at least one meal type. '}
              {activePlans.length === 0 && 'Select at least one plan. '}
              {activePortions.length === 0 && 'Select at least one portion size. '}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirmAndScale}
            disabled={!canGenerate}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm & Generate {totalVersions} Portions
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Start over
          </button>
        </div>
      </div>
    )
  }

  // ─── Render: Scaled versions grid ───────────────────────────────────────────

  if (step === 'versions' && extracted && scaledVersions.length > 0) {
    // Group versions by plan
    const versionsByPlan = activePlans.reduce<Record<string, ScaledVersion[]>>((acc, plan) => {
      acc[plan.id] = scaledVersions.filter(v => v.plan_id === plan.id)
      return acc
    }, {})

    return (
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-emerald-800">
              {scaledVersions.length} portion versions generated and saved
            </p>
            <p className="mt-0.5 text-xs text-emerald-600">
              {extracted.name_en} — {activePlans.length} plans × {activePortions.length} sizes
            </p>
          </div>
        </div>

        {/* Versions grid by plan */}
        {activePlans.map(plan => {
          const planVersions = versionsByPlan[plan.id] ?? []
          if (planVersions.length === 0) return null

          return (
            <div key={plan.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{plan.name_en}</p>
                  <p className="text-xs text-gray-400">
                    P {plan.protein_pct}% · C {plan.carb_pct}% · F {plan.fat_pct}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                {planVersions.map(v => {
                  const portion = portionSizes.find(p => p.id === v.portion_size_id)
                  const isSelected = selectedVersion === v
                  return (
                    <button
                      key={`${v.plan_id}-${v.portion_size_id}`}
                      onClick={() => setSelectedVersion(isSelected ? null : v)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {portion?.symbol ?? v.portion_name} — {portion?.name_en ?? v.portion_name}
                      </p>
                      <p className="mt-1 text-lg font-bold text-amber-600">
                        {Math.round(v.total_calories)} <span className="text-xs font-normal text-gray-400">kcal</span>
                      </p>
                      <div className="mt-2 flex gap-3 text-xs text-gray-500">
                        <span>P {Math.round(v.total_protein_g)}g</span>
                        <span>C {Math.round(v.total_carbs_g)}g</span>
                        <span>F {Math.round(v.total_fat_g)}g</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Selected version → Recipe Card */}
        {selectedVersion && extracted && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Recipe Card — {selectedVersion.plan_name} / {selectedVersion.portion_name}
            </h3>
            <RecipeCard
              recipe={{
                name_en: extracted.name_en,
                name_ar: extracted.name_ar,
                cuisine_tag: extracted.cuisine_tag,
                prep_method: extracted.prep_method,
                cooking_method: extracted.cooking_method,
                total_calories: selectedVersion.total_calories,
                total_protein_g: selectedVersion.total_protein_g,
                total_carbs_g: selectedVersion.total_carbs_g,
                total_fat_g: selectedVersion.total_fat_g,
                plan_name: selectedVersion.plan_name,
                portion_name: selectedVersion.portion_name,
                components: extracted.components.map(comp => ({
                  name_en: comp.name_en,
                  name_ar: comp.name_ar,
                  ingredients: comp.ingredients.map(origIng => {
                    const scaled = selectedVersion.ingredients.find(
                      si => si.name_en.toLowerCase().trim() === origIng.name_en.toLowerCase().trim(),
                    )
                    return {
                      name_en: origIng.name_en,
                      quantity_raw: scaled?.quantity_raw_scaled ?? origIng.quantity_raw,
                      quantity_cooked: scaled?.quantity_cooked,
                      unit: origIng.unit,
                      cooking_loss_percent: origIng.cooking_loss_percent,
                    }
                  }),
                })),
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Sparkles className="h-4 w-4" />
            Import another recipe
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function MacroCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber:  'bg-amber-50 text-amber-700',
    rose:   'bg-rose-50 text-rose-700',
    blue:   'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }
  return (
    <div className={`rounded-lg p-3 text-center ${colorMap[color] ?? 'bg-gray-50 text-gray-700'}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-0.5 text-lg font-bold">{Math.round(value)}<span className="text-xs font-normal ml-0.5">{unit}</span></p>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
      <div>
        <p className="text-sm font-medium text-red-800">Something went wrong</p>
        <p className="mt-0.5 text-sm text-red-600">{message}</p>
      </div>
    </div>
  )
}
