'use client'

import { useRef } from 'react'
import { Printer } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RecipeIngredient {
  name_en: string
  quantity_raw: number
  quantity_cooked?: number
  unit: string
  cooking_loss_percent: number
}

interface RecipeComponent {
  name_en: string
  name_ar: string
  ingredients: RecipeIngredient[]
}

interface RecipeCardData {
  name_en: string
  name_ar: string
  cuisine_tag: string
  prep_method: string
  cooking_method: string
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  components: RecipeComponent[]
  // Optional: portion-specific info
  plan_name?: string
  portion_name?: string
}

// ─── Recipe Card Component ─────────────────────────────────────────────────────

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    if (!cardRef.current) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.name_en} — Recipe Card</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #1a1a1a; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #e5e5e5; }
            .title { font-size: 20px; font-weight: 700; }
            .title-ar { font-size: 14px; color: #666; direction: rtl; }
            .badge { background: #f3e8ff; color: #7c3aed; font-size: 11px; padding: 4px 10px; border-radius: 999px; font-weight: 600; }
            .macros { display: flex; gap: 12px; margin-bottom: 16px; }
            .macro-box { flex: 1; text-align: center; padding: 8px; border: 1px solid #e5e5e5; border-radius: 8px; }
            .macro-val { font-size: 18px; font-weight: 700; }
            .macro-label { font-size: 10px; color: #888; margin-top: 2px; }
            .section-title { font-size: 13px; font-weight: 700; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #444; }
            .method { font-size: 12px; color: #555; line-height: 1.5; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
            th { text-align: left; padding: 6px 8px; border-bottom: 2px solid #ddd; font-weight: 600; color: #555; font-size: 10px; text-transform: uppercase; }
            td { padding: 5px 8px; border-bottom: 1px solid #f0f0f0; }
            .component-name { font-size: 13px; font-weight: 600; margin: 12px 0 4px; padding: 4px 0; border-bottom: 1px solid #eee; }
            .portion-tag { background: #ecfdf5; color: #059669; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
            @media print { body { padding: 12px; } }
          </style>
        </head>
        <body>
          ${cardRef.current.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const proteinPct = recipe.total_calories > 0 ? Math.round((recipe.total_protein_g * 4 / recipe.total_calories) * 100) : 0
  const carbPct = recipe.total_calories > 0 ? Math.round((recipe.total_carbs_g * 4 / recipe.total_calories) * 100) : 0
  const fatPct = recipe.total_calories > 0 ? Math.round((recipe.total_fat_g * 9 / recipe.total_calories) * 100) : 0

  return (
    <div>
      {/* Print button */}
      <button
        onClick={handlePrint}
        className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      >
        <Printer className="h-4 w-4" />
        Print recipe card
      </button>

      {/* Printable card */}
      <div ref={cardRef} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 text-sm">
        {/* Header */}
        <div className="header flex items-start justify-between border-b border-gray-200 pb-4">
          <div>
            <div className="title text-lg font-bold text-gray-900">{recipe.name_en}</div>
            <div className="title-ar text-sm text-gray-400" dir="rtl">{recipe.name_ar}</div>
            {recipe.plan_name && recipe.portion_name && (
              <span className="portion-tag mt-2 inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {recipe.plan_name} — {recipe.portion_name}
              </span>
            )}
          </div>
          <span className="badge rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {recipe.cuisine_tag}
          </span>
        </div>

        {/* Macros */}
        <div className="macros grid grid-cols-4 gap-3">
          <div className="macro-box rounded-lg border border-gray-100 p-3 text-center">
            <div className="macro-val text-lg font-bold text-amber-600">{Math.round(recipe.total_calories)}</div>
            <div className="macro-label text-[10px] text-gray-400">CALORIES</div>
          </div>
          <div className="macro-box rounded-lg border border-gray-100 p-3 text-center">
            <div className="macro-val text-lg font-bold text-rose-600">{Math.round(recipe.total_protein_g)}g <span className="text-xs font-normal text-gray-400">({proteinPct}%)</span></div>
            <div className="macro-label text-[10px] text-gray-400">PROTEIN</div>
          </div>
          <div className="macro-box rounded-lg border border-gray-100 p-3 text-center">
            <div className="macro-val text-lg font-bold text-blue-600">{Math.round(recipe.total_carbs_g)}g <span className="text-xs font-normal text-gray-400">({carbPct}%)</span></div>
            <div className="macro-label text-[10px] text-gray-400">CARBS</div>
          </div>
          <div className="macro-box rounded-lg border border-gray-100 p-3 text-center">
            <div className="macro-val text-lg font-bold text-yellow-600">{Math.round(recipe.total_fat_g)}g <span className="text-xs font-normal text-gray-400">({fatPct}%)</span></div>
            <div className="macro-label text-[10px] text-gray-400">FAT</div>
          </div>
        </div>

        {/* Methods */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="section-title text-xs font-bold uppercase tracking-wide text-gray-400">Preparation</div>
            <div className="method text-sm text-gray-600">{recipe.prep_method}</div>
          </div>
          <div>
            <div className="section-title text-xs font-bold uppercase tracking-wide text-gray-400">Cooking</div>
            <div className="method text-sm text-gray-600">{recipe.cooking_method}</div>
          </div>
        </div>

        {/* Components & Ingredients table */}
        {recipe.components.map((comp, ci) => (
          <div key={ci}>
            <div className="component-name text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">
              {comp.name_en} <span className="text-xs font-normal text-gray-400" dir="rtl">{comp.name_ar}</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="pb-2 pt-2 text-left font-semibold">Ingredient</th>
                  <th className="pb-2 pt-2 text-right font-semibold">Raw (g)</th>
                  <th className="pb-2 pt-2 text-right font-semibold">Cooked (g)</th>
                  <th className="pb-2 pt-2 text-right font-semibold">Cook loss</th>
                </tr>
              </thead>
              <tbody>
                {comp.ingredients.map((ing, ii) => {
                  const cooked = ing.quantity_cooked ?? Math.round(ing.quantity_raw * (1 - ing.cooking_loss_percent / 100) * 10) / 10
                  return (
                    <tr key={ii} className={ii < comp.ingredients.length - 1 ? 'border-b border-gray-50' : ''}>
                      <td className="py-1.5 text-gray-700">{ing.name_en}</td>
                      <td className="py-1.5 text-right text-gray-600">{ing.quantity_raw}{ing.unit}</td>
                      <td className="py-1.5 text-right text-gray-500">{cooked}{ing.unit}</td>
                      <td className="py-1.5 text-right text-gray-400">{ing.cooking_loss_percent}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
