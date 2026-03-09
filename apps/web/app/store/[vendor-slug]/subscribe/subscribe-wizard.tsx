'use client'

import { useState } from 'react'
import { Check, ChevronRight, Lock, CalendarDays, Sparkles, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  StorefrontMealType,
  StorefrontPlan,
  StorefrontTier,
  StorefrontVendor,
} from '@boxvibe/db'

// ─── Meal type metadata ───────────────────────────────────────────────────────

// Calorie fraction each meal contributes to daily intake.
// lunch+dinner = 0.35+0.25 = 0.60 → matches the "60%" example.
const MEAL_KCAL_FRACTION: Record<string, number> = {
  breakfast:     0.25,
  morning_snack: 0.10,
  lunch:         0.35,
  dinner:        0.25,
  evening_snack: 0.05,
}

const MEAL_EMOJI: Record<string, string> = {
  breakfast:     '🍳',
  morning_snack: '🌅',
  lunch:         '🥗',
  dinner:        '🌙',
  evening_snack: '🍵',
}

function mealEmoji(key: string) { return MEAL_EMOJI[key] ?? '🍽️' }
function mealFraction(keys: string[]) {
  return keys.reduce((s, k) => s + (MEAL_KCAL_FRACTION[k] ?? 0), 0)
}

// ─── TDEE helpers (Mifflin-St Jeor) ─────────────────────────────────────────

const ACTIVITY_MULT: Record<string, number> = {
  sedentary:  1.2,
  light:      1.375,
  moderate:   1.55,
  active:     1.725,
  very_active: 1.9,
}
const GOAL_MULT: Record<string, number> = {
  lose:     0.80,
  maintain: 1.00,
  build:    1.10,
}

function calcTdee(
  gender: 'male' | 'female',
  age: number,
  weightKg: number,
  heightCm: number,
  activity: string,
  goal: string,
): number {
  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  return Math.round(bmr * (ACTIVITY_MULT[activity] ?? 1.55) * (GOAL_MULT[goal] ?? 1.0))
}

// Parse "900-1000 kcal" → midpoint 950
function parseTierMidpoint(name: string): number | null {
  const range = name.match(/(\d+)\s*[-–—]\s*(\d+)/)
  if (range) return (parseInt(range[1]) + parseInt(range[2])) / 2
  const single = name.match(/(\d+)\s*k?cal/i)
  if (single) return parseInt(single[1])
  return null
}

function findClosestTier(tiers: StorefrontTier[], targetKcal: number): StorefrontTier | null {
  if (tiers.length === 0) return null
  return tiers.reduce((best, t) => {
    const bm = parseTierMidpoint(best.variance_name_en) ?? 0
    const tm = parseTierMidpoint(t.variance_name_en) ?? 0
    return Math.abs(tm - targetKcal) < Math.abs(bm - targetKcal) ? t : best
  })
}

function findBestPlan(plans: StorefrontPlan[], goal: string): StorefrontPlan | null {
  if (plans.length === 0) return null
  const keywords: Record<string, string[]> = {
    build:    ['protein', 'muscle'],
    lose:     ['keto', 'low carb', 'lowcarb', 'deficit'],
    maintain: ['balanced', 'balance'],
  }
  const targets = keywords[goal] ?? []
  const match = plans.find(p => targets.some(kw => p.name_en.toLowerCase().includes(kw)))
  return match ?? plans[0]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlanEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('keto')) return '🥑'
  if (n.includes('protein')) return '💪'
  if (n.includes('balance') || n.includes('balanced')) return '⚖️'
  if (n.includes('low carb') || n.includes('lowcarb')) return '🥦'
  if (n.includes('vegan') || n.includes('plant')) return '🌱'
  if (n.includes('weight') || n.includes('loss')) return '🔥'
  return '🥗'
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${Math.round(amount).toLocaleString('en-AE')}`
}

function computePrice(
  dailyRate: number,
  daysPerWeek: number,
  durationWeeks: number,
): number {
  return Math.round(dailyRate * daysPerWeek * durationWeeks)
}

function formatDateShort(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-AE', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

// ─── Wizard state ─────────────────────────────────────────────────────────────

interface WizardState {
  selectedPlan:         StorefrontPlan | null
  selectedMealTypeKeys: string[]          // additive: any combo, price = sum of daily rates
  selectedTier:         StorefrontTier | null
  daysPerWeek:          number | null
  durationWeeks:        number | null
  startDate:            string | null
  targetTdee:           number | null     // set by AI recommender; drives tier hint
}

const DAYS_OPTIONS = [
  { days: 5, label: 'Mon – Fri',  sublabel: '5 days a week' },
  { days: 6, label: 'Mon – Sat',  sublabel: '6 days a week' },
]

const DURATION_OPTIONS = [
  { weeks: 1, label: 'Weekly',   badge: null },
  { weeks: 2, label: '2 Weeks',  badge: 'Popular' },
  { weeks: 4, label: 'Monthly',  badge: 'Best value' },
]

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Phase nav ────────────────────────────────────────────────────────────────

function PhaseNav() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 md:px-6">
        {[{ n: 1, label: 'Customize Plan' }, { n: 2, label: 'Delivery & Payment' }, { n: 3, label: 'Select Menu' }]
          .map((ph, i, arr) => (
          <div key={ph.n} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2 px-3 py-4 text-sm font-medium md:px-5',
              ph.n === 1 ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-400',
            )}>
              <span className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                ph.n === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400',
              )}>{ph.n}</span>
              <span className="hidden sm:inline">{ph.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ num, title, subtitle, animate = false, children }: {
  num: number; title: string; subtitle?: string; animate?: boolean; children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-6', animate && 'animate-step-in')}>
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {num}
          </span>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        {subtitle && <p className="mt-1 pl-8.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── AI Recommender ───────────────────────────────────────────────────────────

interface AiProfile {
  gender:   'male' | 'female'
  age:      string
  weightKg: string
  heightCm: string
  activity: string
  goal:     string
}

interface AiResult {
  tdee:              number
  recommendedPlan:   StorefrontPlan | null
  recommendedTier:   StorefrontTier | null   // based on full-day TDEE
  coverageFraction:  number                  // fraction of TDEE covered by selected meals
}

function AiRecommender({
  plans,
  tiers,
  selectedMealTypeKeys,
  onApply,
}: {
  plans:                StorefrontPlan[]
  tiers:                StorefrontTier[]
  selectedMealTypeKeys: string[]
  onApply:              (planId: string, tierId: string, tdee: number) => void
}) {
  const [open, setOpen]       = useState(false)
  const [result, setResult]   = useState<AiResult | null>(null)
  const [profile, setProfile] = useState<AiProfile>({
    gender: 'male', age: '', weightKg: '', heightCm: '',
    activity: 'moderate', goal: 'maintain',
  })

  const allPlanTiers = result
    ? tiers.filter(t => t.plan_id === result.recommendedPlan?.id)
    : []

  function calculate() {
    const age  = parseInt(profile.age)
    const wkg  = parseFloat(profile.weightKg)
    const hcm  = parseFloat(profile.heightCm)
    if (!age || !wkg || !hcm || age < 10 || age > 120) return

    const tdee       = calcTdee(profile.gender, age, wkg, hcm, profile.activity, profile.goal)
    const bestPlan   = findBestPlan(plans, profile.goal)
    const planTiers  = bestPlan ? tiers.filter(t => t.plan_id === bestPlan.id) : []
    const bestTier   = findClosestTier(planTiers, tdee)
    const fraction   = selectedMealTypeKeys.length > 0
      ? mealFraction(selectedMealTypeKeys)
      : 1.0

    setResult({ tdee, recommendedPlan: bestPlan, recommendedTier: bestTier, coverageFraction: fraction })
  }

  // Recompute coverage when meal selection changes
  const coverage = result ? mealFraction(
    selectedMealTypeKeys.length > 0 ? selectedMealTypeKeys : Object.keys(MEAL_KCAL_FRACTION)
  ) : null
  const adjustedKcal = result && coverage ? Math.round(result.tdee * coverage) : null
  const adjustedTier = result && adjustedKcal
    ? findClosestTier(allPlanTiers, adjustedKcal)
    : result?.recommendedTier ?? null

  const set = (k: keyof AiProfile, v: string) => setProfile(p => ({ ...p, [k]: v }))

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
      {/* Banner */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-900">Not sure what to choose?</p>
            <p className="text-xs text-emerald-700">Let us calculate your perfect plan based on your body & goals</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-emerald-700 shrink-0" />
          : <ChevronDown className="h-4 w-4 text-emerald-700 shrink-0" />
        }
      </button>

      {/* Expandable form */}
      {open && (
        <div className="border-t border-emerald-200 px-5 pb-5 pt-4 animate-step-in">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Gender */}
            <div className="col-span-2 sm:col-span-3">
              <p className="mb-1.5 text-xs font-medium text-slate-600">Gender</p>
              <div className="flex gap-2">
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => set('gender', g)}
                    className={cn(
                      'flex-1 rounded-xl border-2 py-2 text-sm font-medium transition-all',
                      profile.gender === g
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                    )}
                  >
                    {g === 'male' ? '♂ Male' : '♀ Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Age</label>
              <input
                type="number" inputMode="numeric" placeholder="28"
                value={profile.age} onChange={e => set('age', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Weight (kg)</label>
              <input
                type="number" inputMode="decimal" placeholder="75"
                value={profile.weightKg} onChange={e => set('weightKg', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Height */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Height (cm)</label>
              <input
                type="number" inputMode="numeric" placeholder="175"
                value={profile.heightCm} onChange={e => set('heightCm', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            {/* Activity */}
            <div className="col-span-2 sm:col-span-3">
              <p className="mb-1.5 text-xs font-medium text-slate-600">Activity level</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { k: 'sedentary',   l: 'Sedentary' },
                  { k: 'light',       l: 'Light' },
                  { k: 'moderate',    l: 'Moderate' },
                  { k: 'active',      l: 'Active' },
                  { k: 'very_active', l: 'Very active' },
                ].map(({ k, l }) => (
                  <button key={k} onClick={() => set('activity', k)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                      profile.activity === k
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                    )}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="col-span-2 sm:col-span-3">
              <p className="mb-1.5 text-xs font-medium text-slate-600">Goal</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: 'lose',     l: '🔥 Lose weight' },
                  { k: 'maintain', l: '⚖️ Maintain' },
                  { k: 'build',    l: '💪 Build muscle' },
                ].map(({ k, l }) => (
                  <button key={k} onClick={() => set('goal', k)}
                    className={cn(
                      'rounded-xl border-2 py-2 text-xs font-medium transition-all',
                      profile.goal === k
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                    )}
                  >{l}</button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!profile.age || !profile.weightKg || !profile.heightCm}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Calculate my plan
          </button>

          {/* Result */}
          {result && (
            <div className="mt-4 space-y-3 rounded-xl bg-white p-4 border border-emerald-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Your daily need</p>
                  <p className="text-2xl font-bold text-slate-900">{result.tdee.toLocaleString()} kcal</p>
                </div>
                <button onClick={() => setResult(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {result.recommendedPlan && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{getPlanEmoji(result.recommendedPlan.name_en)}</span>
                  <span className="text-slate-700">Recommended plan: <strong>{result.recommendedPlan.name_en}</strong></span>
                </div>
              )}

              {adjustedTier && (
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                  {selectedMealTypeKeys.length > 0 && coverage !== null && coverage < 0.99 ? (
                    <>
                      <p className="font-medium text-emerald-800">
                        Your {selectedMealTypeKeys.length} meal{selectedMealTypeKeys.length > 1 ? 's' : ''} cover{selectedMealTypeKeys.length === 1 ? 's' : ''}{' '}
                        ~{Math.round(coverage * 100)}% of your daily intake
                      </p>
                      <p className="mt-0.5 text-emerald-700">
                        We recommend <strong>{adjustedTier.variance_name_en}</strong> ({adjustedKcal?.toLocaleString()} kcal from your selected meals)
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-emerald-800">
                      Recommended tier: <strong>{adjustedTier.variance_name_en}</strong>
                    </p>
                  )}
                </div>
              )}

              {result.recommendedPlan && adjustedTier && (
                <button
                  onClick={() => {
                    onApply(result.recommendedPlan!.id, adjustedTier.id, result.tdee)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4" />
                  Apply this recommendation
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Summary sidebar ──────────────────────────────────────────────────────────

function SummarySidebar({
  state, mealTypes, currency, vendorSlug, isComplete,
}: {
  state:       WizardState
  mealTypes:   StorefrontMealType[]
  currency:    string
  vendorSlug:  string
  isComplete:  boolean
}) {
  const { selectedPlan, selectedMealTypeKeys, selectedTier, daysPerWeek, durationWeeks, startDate } = state

  const dailyRate   = mealTypes.filter(m => selectedMealTypeKeys.includes(m.key)).reduce((s, m) => s + m.price_per_day, 0)
  const totalPrice  = daysPerWeek && durationWeeks ? computePrice(dailyRate, daysPerWeek, durationWeeks) : null
  const durationLabel = DURATION_OPTIONS.find(d => d.weeks === durationWeeks)?.label ?? null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-900 px-5 py-4">
        <p className="text-sm font-semibold text-white">Summary</p>
      </div>

      <div className="p-5 space-y-4">
        {selectedPlan ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-2xl">{getPlanEmoji(selectedPlan.name_en)}</span>
            <div>
              <p className="font-semibold text-slate-900">{selectedPlan.name_en}</p>
              {selectedTier && <p className="text-sm text-slate-500">{selectedTier.variance_name_en}</p>}
              {selectedMealTypeKeys.length > 0 && (
                <p className="text-sm text-slate-500">
                  {mealTypes.filter(m => selectedMealTypeKeys.includes(m.key)).map(m => m.label_en).join(' + ')}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">Make your selections to see a summary.</p>
        )}

        {/* Per-meal breakdown */}
        {selectedMealTypeKeys.length > 0 && (
          <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
            {mealTypes.filter(m => selectedMealTypeKeys.includes(m.key)).map(m => (
              <div key={m.key} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{mealEmoji(m.key)} {m.label_en}</span>
                <span className="font-medium text-slate-700">{currency} {m.price_per_day}/day</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 text-xs">
              <span className="font-medium text-slate-700">Daily total</span>
              <span className="font-bold text-slate-900">{currency} {dailyRate}/day</span>
            </div>
          </div>
        )}

        {(durationLabel || daysPerWeek || startDate) && (
          <div className="rounded-xl bg-slate-50 p-3 text-sm space-y-1">
            {durationLabel && daysPerWeek && (
              <p className="text-slate-700">
                <span className="font-medium">{durationLabel}</span>
                <span className="text-slate-400"> · {daysPerWeek} days/week</span>
              </p>
            )}
            {startDate && (
              <p className="flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                Starting {formatDateShort(startDate)}
              </p>
            )}
          </div>
        )}

        {/* Total price */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total</span>
            {totalPrice !== null ? (
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalPrice, currency)}
              </span>
            ) : (
              <span className="text-lg font-bold text-slate-300">—</span>
            )}
          </div>
          {durationLabel && totalPrice !== null && (
            <p className="mt-0.5 text-right text-xs text-slate-400">for {durationLabel.toLowerCase()}</p>
          )}
        </div>

        {isComplete ? (
          <a
            href={`/store/${vendorSlug}/signup`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <button disabled className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 py-3.5 text-sm font-medium text-slate-400 cursor-not-allowed">
            <Lock className="h-3.5 w-3.5" />
            Complete your plan
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Calendar picker ──────────────────────────────────────────────────────────

function CalendarPicker({ value, onChange }: { value: string | null; onChange: (iso: string) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + 2)
  const [view, setView] = useState(() => ({ year: minDate.getFullYear(), month: minDate.getMonth() }))

  const firstDay    = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  function isDisabled(day: number) {
    const d = new Date(view.year, view.month, day)
    return d.getDay() === 5 || d < minDate
  }
  function isSelected(day: number) {
    if (!value) return false
    const d = new Date(value + 'T00:00:00')
    return d.getFullYear() === view.year && d.getMonth() === view.month && d.getDate() === day
  }
  function handleSelect(day: number) {
    if (isDisabled(day)) return
    const d = new Date(view.year, view.month, day)
    onChange([d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'))
  }

  return (
    <div className="max-w-xs">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">‹</button>
        <span className="text-sm font-semibold text-slate-900">{MONTH_NAMES[view.month]} {view.year}</span>
        <button onClick={() => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">›</button>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_NAMES.map(d => (
          <div key={d} className={cn('py-1 text-xs font-medium', d === 'Fri' ? 'text-red-400' : 'text-slate-400')}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const disabled = isDisabled(day); const selected = isSelected(day)
          return (
            <button key={day} onClick={() => handleSelect(day)} disabled={disabled}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg text-sm transition-colors',
                disabled && 'cursor-not-allowed text-slate-200',
                !disabled && !selected && 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                selected && 'bg-emerald-600 font-semibold text-white',
              )}
            >{day}</button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Earliest: {minDate.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })} · Fridays unavailable
      </p>
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

interface WizardProps {
  vendor:     StorefrontVendor
  plans:      StorefrontPlan[]
  mealTypes:  StorefrontMealType[]
  tiers:      StorefrontTier[]
  vendorSlug: string
}

export default function SubscribeWizard({ vendor, plans, mealTypes, tiers, vendorSlug }: WizardProps) {
  const [state, setState] = useState<WizardState>({
    selectedPlan: null, selectedMealTypeKeys: [], selectedTier: null,
    daysPerWeek: null, durationWeeks: null, startDate: null, targetTdee: null,
  })

  function selectPlan(plan: StorefrontPlan) {
    setState(s => ({ ...s, selectedPlan: plan, selectedTier: null }))
  }

  function toggleMealType(key: string) {
    setState(s => ({
      ...s,
      selectedMealTypeKeys: s.selectedMealTypeKeys.includes(key)
        ? s.selectedMealTypeKeys.filter(k => k !== key)
        : [...s.selectedMealTypeKeys, key],
      selectedTier: null,  // recalculate tier when meals change
    }))
  }

  // Apply AI recommendation: pre-fill plan + tier + store TDEE for coverage hints
  function applyAiRecommendation(planId: string, tierId: string, tdee: number) {
    const plan = plans.find(p => p.id === planId) ?? null
    const tier = tiers.find(t => t.id === tierId) ?? null
    setState(s => ({ ...s, selectedPlan: plan, selectedTier: tier, targetTdee: tdee }))
  }

  // Derived
  const filteredTiers = state.selectedPlan
    ? tiers.filter(t => t.plan_id === state.selectedPlan!.id)
    : []

  // AI-driven tier hint: when TDEE is known, find the best tier for the current meal selection
  const coverageFraction = state.selectedMealTypeKeys.length > 0
    ? mealFraction(state.selectedMealTypeKeys)
    : null
  const aiTargetKcal = state.targetTdee && coverageFraction
    ? Math.round(state.targetTdee * coverageFraction)
    : null
  const aiRecommendedTier = aiTargetKcal
    ? findClosestTier(filteredTiers, aiTargetKcal)
    : null

  const dailyRate = mealTypes
    .filter(m => state.selectedMealTypeKeys.includes(m.key))
    .reduce((s, m) => s + m.price_per_day, 0)

  const isComplete =
    state.selectedPlan !== null &&
    state.selectedMealTypeKeys.length > 0 &&
    state.selectedTier !== null &&
    state.daysPerWeek !== null &&
    state.durationWeeks !== null &&
    state.startDate !== null

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
      <PhaseNav />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 xl:grid-cols-[1fr_380px]">

        {/* ── Left: cascading form ── */}
        <div className="space-y-4">

          {/* AI Recommender banner */}
          <AiRecommender
            plans={plans}
            tiers={tiers}
            selectedMealTypeKeys={state.selectedMealTypeKeys}
            onApply={applyAiRecommendation}
          />

          {/* 1. Dietary plan */}
          <Section num={1} title="Choose your plan" subtitle="Pick the dietary approach that fits your goal.">
            <div className="flex flex-wrap gap-2">
              {plans.length === 0 && <p className="text-sm text-slate-400">No plans available yet.</p>}
              {plans.map(plan => {
                const isSelected = state.selectedPlan?.id === plan.id
                return (
                  <button key={plan.id} onClick={() => selectPlan(plan)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                    )}
                  >
                    <span>{getPlanEmoji(plan.name_en)}</span>
                    <span>{plan.name_en}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                )
              })}
            </div>
            {state.selectedPlan?.desc_en && (
              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">{state.selectedPlan.desc_en}</p>
              </div>
            )}
          </Section>

          {/* 2. Meal types — Delicut-style checkboxes with price per meal */}
          {state.selectedPlan && (
            <Section num={2} title="Select the meals you need daily" subtitle="Pick any combination — you'll pay the sum of their daily rates." animate>
              {mealTypes.length === 0 ? (
                <p className="text-sm text-slate-400">No meal types configured yet.</p>
              ) : (
                <div className="space-y-2">
                  {mealTypes.map(m => {
                    const isChecked = state.selectedMealTypeKeys.includes(m.key)
                    return (
                      <button
                        key={m.key}
                        onClick={() => toggleMealType(m.key)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200',
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-slate-300',
                        )}
                      >
                        {/* Radio circle */}
                        <span className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                          isChecked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white',
                        )}>
                          {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </span>

                        <span className="text-xl">{mealEmoji(m.key)}</span>

                        <div className="flex-1">
                          <p className={cn('text-sm font-medium', isChecked ? 'text-emerald-800' : 'text-slate-800')}>
                            {m.label_en}
                          </p>
                        </div>

                        <p className={cn('text-sm font-semibold tabular-nums', isChecked ? 'text-emerald-700' : 'text-slate-500')}>
                          {vendor.currency} {m.price_per_day}/day
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Daily total + coverage hint */}
              {state.selectedMealTypeKeys.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
                    <p className="text-sm font-medium text-slate-300">Daily total</p>
                    <p className="text-base font-bold text-white">{vendor.currency} {dailyRate}/day</p>
                  </div>

                  {/* AI coverage hint */}
                  {state.targetTdee && coverageFraction !== null && coverageFraction < 0.99 && (
                    <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3">
                      <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <p className="text-sm text-emerald-700">
                        These {state.selectedMealTypeKeys.length} meals cover{' '}
                        <strong>~{Math.round(coverageFraction * 100)}%</strong> of your{' '}
                        {state.targetTdee.toLocaleString()} kcal target.
                        {aiTargetKcal && <> We recommend a <strong>{aiTargetKcal.toLocaleString()} kcal</strong> tier below.</>}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Section>
          )}

          {/* 3. Calorie tier */}
          {state.selectedMealTypeKeys.length > 0 && state.selectedPlan && (
            <Section num={3} title="How many calories per day?" subtitle="Pick a tier that matches your goal." animate>
              {filteredTiers.length === 0 ? (
                <p className="text-sm text-slate-400">No calorie tiers configured for this plan yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTiers.map(tier => {
                    const isSelected = state.selectedTier?.id === tier.id
                    const isAiRecommended = aiRecommendedTier?.id === tier.id
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setState(s => ({ ...s, selectedTier: tier }))}
                        className={cn(
                          'relative flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                        )}
                      >
                        <span>{tier.variance_name_en}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                        {isAiRecommended && !isSelected && (
                          <span className="absolute -top-2 -right-1 flex items-center gap-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            <Sparkles className="h-2.5 w-2.5" /> AI
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </Section>
          )}

          {/* 4. Delivery days */}
          {state.selectedTier && (
            <Section num={4} title="Preferred delivery days" animate>
              <div className="grid grid-cols-2 gap-3">
                {DAYS_OPTIONS.map(opt => {
                  const isSelected = state.daysPerWeek === opt.days
                  return (
                    <button key={opt.days} onClick={() => setState(s => ({ ...s, daysPerWeek: opt.days }))}
                      className={cn(
                        'relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200',
                        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300',
                      )}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.sublabel}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-slate-400">We don&apos;t deliver on Fridays.</p>
            </Section>
          )}

          {/* 5. Duration */}
          {state.daysPerWeek && (
            <Section num={5} title="Plan duration" animate>
              <div className="flex flex-col gap-2">
                {DURATION_OPTIONS.map(opt => {
                  const isSelected = state.durationWeeks === opt.weeks
                  const price = computePrice(dailyRate, state.daysPerWeek!, opt.weeks)
                  return (
                    <button key={opt.weeks} onClick={() => setState(s => ({ ...s, durationWeeks: opt.weeks }))}
                      className={cn(
                        'relative flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200',
                        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{opt.label}</p>
                          {opt.badge && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(price, vendor.currency)}</p>
                        <p className="text-xs text-slate-400">total</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          {/* 6. Start date */}
          {state.durationWeeks && (
            <Section num={6} title="When do you want to start?" subtitle="Fridays unavailable · minimum 2 days from today." animate>
              <CalendarPicker value={state.startDate} onChange={date => setState(s => ({ ...s, startDate: date }))} />
              {state.startDate && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">
                    First delivery: {formatDateShort(state.startDate)}
                  </p>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* ── Right: sticky summary (desktop) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <SummarySidebar
              state={state}
              mealTypes={mealTypes}
              currency={vendor.currency}
              vendorSlug={vendorSlug}
              isComplete={isComplete}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {state.selectedMealTypeKeys.length > 0 && state.daysPerWeek && state.durationWeeks ? (
              <>
                <p className="text-xs text-slate-500">{state.selectedPlan?.name_en ?? 'Your plan'}</p>
                <p className="font-bold text-slate-900">
                  {formatCurrency(computePrice(dailyRate, state.daysPerWeek, state.durationWeeks), vendor.currency)}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400">
                {state.selectedPlan ? 'Select your meals above' : 'Select a plan to get started'}
              </p>
            )}
          </div>
          {isComplete ? (
            <a href={`/store/${vendorSlug}/signup`}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
              Continue <ChevronRight className="h-4 w-4" />
            </a>
          ) : (
            <button disabled className="flex items-center gap-1.5 rounded-full bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-400">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
