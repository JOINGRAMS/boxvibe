'use client'

import { useState } from 'react'
import { Check, ChevronRight, Lock, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  StorefrontPackage,
  StorefrontPlan,
  StorefrontTier,
  StorefrontVendor,
  PlanPackageLink,
} from '@boxvibe/db'

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

function getPackageEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('full') || (n.includes('breakfast') && n.includes('dinner'))) return '🍽️'
  if (n.includes('breakfast') && n.includes('lunch')) return '🌅'
  if (n.includes('lunch') && n.includes('dinner')) return '🥗'
  if (n.includes('breakfast')) return '🍳'
  if (n.includes('lunch')) return '🥗'
  if (n.includes('dinner')) return '🌙'
  if (n.includes('snack')) return '🥜'
  return '🥘'
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${Math.round(amount).toLocaleString('en-AE')}`
}

function computePrice(
  tier: StorefrontTier,
  pkg: StorefrontPackage,
  daysPerWeek: number,
  durationWeeks: number,
): number {
  return Math.round((tier.total_price / 20) * daysPerWeek * durationWeeks * pkg.price_multiplier)
}

function formatDateShort(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-AE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Wizard state ─────────────────────────────────────────────────────────────

interface WizardState {
  selectedPlan: StorefrontPlan | null
  selectedPackage: StorefrontPackage | null
  selectedTier: StorefrontTier | null
  daysPerWeek: number | null
  durationWeeks: number | null
  startDate: string | null
}

const DAYS_OPTIONS = [
  { days: 5, label: 'Mon – Fri', sublabel: '5 days a week' },
  { days: 6, label: 'Mon – Sat', sublabel: '6 days a week' },
]

const DURATION_OPTIONS = [
  { weeks: 1, label: 'Weekly', badge: null },
  { weeks: 2, label: '2 Weeks', badge: 'Popular' },
  { weeks: 4, label: 'Monthly', badge: 'Best value' },
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ─── Phase nav ────────────────────────────────────────────────────────────────

function PhaseNav() {
  const phases = [
    { n: 1, label: 'Customize Plan' },
    { n: 2, label: 'Delivery & Payment' },
    { n: 3, label: 'Select Menu' },
  ]
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 md:px-6">
        {phases.map((ph, i) => (
          <div key={ph.n} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-4 text-sm font-medium md:px-5',
                ph.n === 1
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-slate-400',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                  ph.n === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400',
                )}
              >
                {ph.n}
              </span>
              <span className="hidden sm:inline">{ph.label}</span>
            </div>
            {i < phases.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  num,
  title,
  subtitle,
  animate = false,
  children,
}: {
  num: number
  title: string
  subtitle?: string
  animate?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6',
        animate && 'animate-step-in',
      )}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {num}
          </span>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        {subtitle && (
          <p className="mt-1 pl-8.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Summary sidebar ──────────────────────────────────────────────────────────

function SummarySidebar({
  state,
  currency,
  vendorSlug,
  isComplete,
}: {
  state: WizardState
  currency: string
  vendorSlug: string
  isComplete: boolean
}) {
  const { selectedPlan, selectedPackage, selectedTier, daysPerWeek, durationWeeks, startDate } = state

  const price =
    selectedPackage && selectedTier && daysPerWeek && durationWeeks
      ? computePrice(selectedTier, selectedPackage, daysPerWeek, durationWeeks)
      : null

  const durationLabel = DURATION_OPTIONS.find(d => d.weeks === durationWeeks)?.label ?? null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-slate-900 px-5 py-4">
        <p className="text-sm font-semibold text-white">Summary</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Selected plan */}
        {selectedPlan ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-2xl">{getPlanEmoji(selectedPlan.name_en)}</span>
            <div>
              <p className="font-semibold text-slate-900">{selectedPlan.name_en}</p>
              {selectedTier && (
                <p className="text-sm text-slate-500">{selectedTier.variance_name_en}</p>
              )}
              {selectedPackage && (
                <p className="text-sm text-slate-500">{selectedPackage.category_en}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">Make your selections to see a summary.</p>
        )}

        {/* Duration + date */}
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

        {/* Price */}
        {price !== null ? (
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(price, currency)}
              </span>
            </div>
            {durationLabel && (
              <p className="mt-0.5 text-right text-xs text-slate-400">for {durationLabel.toLowerCase()}</p>
            )}
          </div>
        ) : (
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-lg font-bold text-slate-300">—</span>
            </div>
          </div>
        )}

        {/* CTA */}
        {isComplete ? (
          <a
            href={`/store/${vendorSlug}/signup`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </a>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 py-3.5 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            <Lock className="h-3.5 w-3.5" />
            Complete your plan
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Calendar picker ──────────────────────────────────────────────────────────

function CalendarPicker({
  value,
  onChange,
}: {
  value: string | null
  onChange: (iso: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + 2)

  const [view, setView] = useState(() => ({
    year: minDate.getFullYear(),
    month: minDate.getMonth(),
  }))

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

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
        <button
          onClick={() => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-slate-900">
          {MONTH_NAMES[view.month]} {view.year}
        </span>
        <button
          onClick={() => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_NAMES.map(d => (
          <div key={d} className={cn('py-1 text-xs font-medium', d === 'Fri' ? 'text-red-400' : 'text-slate-400')}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const disabled = isDisabled(day)
          const selected = isSelected(day)
          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg text-sm transition-colors',
                disabled && 'cursor-not-allowed text-slate-200',
                !disabled && !selected && 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                selected && 'bg-emerald-600 font-semibold text-white',
              )}
            >
              {day}
            </button>
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
  vendor: StorefrontVendor
  plans: StorefrontPlan[]
  packages: StorefrontPackage[]
  tiers: StorefrontTier[]
  planPackageMap: PlanPackageLink[]
  vendorSlug: string
}

export default function SubscribeWizard({
  vendor,
  plans,
  packages,
  tiers,
  planPackageMap,
  vendorSlug,
}: WizardProps) {
  const [state, setState] = useState<WizardState>({
    selectedPlan: null,
    selectedPackage: null,
    selectedTier: null,
    daysPerWeek: null,
    durationWeeks: null,
    startDate: null,
  })

  function selectPlan(plan: StorefrontPlan) {
    setState(s => ({ ...s, selectedPlan: plan, selectedPackage: null, selectedTier: null }))
  }

  function selectPackage(pkg: StorefrontPackage) {
    setState(s => ({ ...s, selectedPackage: pkg, selectedTier: null }))
  }

  // Derived data
  const availablePackageIds = state.selectedPlan
    ? new Set(planPackageMap.filter(r => r.plan_id === state.selectedPlan!.id).map(r => r.package_id))
    : new Set<string>()
  const filteredPackages = packages.filter(p => availablePackageIds.has(p.id))
  const filteredTiers = state.selectedPlan ? tiers.filter(t => t.plan_id === state.selectedPlan!.id) : []

  const isComplete =
    state.selectedPlan !== null &&
    state.selectedPackage !== null &&
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

          {/* Section 1: Plan */}
          <Section num={1} title="Choose your plan" subtitle="Pick the dietary approach that fits your goal.">
            <div className="flex flex-wrap gap-2">
              {plans.length === 0 && (
                <p className="text-sm text-slate-400">No plans available yet.</p>
              )}
              {plans.map(plan => {
                const isSelected = state.selectedPlan?.id === plan.id
                return (
                  <button
                    key={plan.id}
                    onClick={() => selectPlan(plan)}
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

          {/* Section 2: Package / meals */}
          {state.selectedPlan && (
            <Section num={2} title="Select your meals" subtitle="Which meal times would you like each day?" animate>
              {filteredPackages.length === 0 ? (
                <p className="text-sm text-slate-400">No packages configured for this plan yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredPackages.map(pkg => {
                    const isSelected = state.selectedPackage?.id === pkg.id
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => selectPackage(pkg)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                        )}
                      >
                        <span>{getPackageEmoji(pkg.category_en)}</span>
                        <span>{pkg.category_en}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    )
                  })}
                </div>
              )}
              {state.selectedPackage?.description_en && (
                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">{state.selectedPackage.description_en}</p>
                </div>
              )}
            </Section>
          )}

          {/* Section 3: Calorie tier */}
          {state.selectedPackage && (
            <Section num={3} title="How many calories per day?" subtitle="Pick a tier that matches your goal." animate>
              {filteredTiers.length === 0 ? (
                <p className="text-sm text-slate-400">No calorie tiers configured for this plan yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTiers.map(tier => {
                    const isSelected = state.selectedTier?.id === tier.id
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setState(s => ({ ...s, selectedTier: tier }))}
                        className={cn(
                          'flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                        )}
                      >
                        <span>{tier.variance_name_en}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    )
                  })}
                </div>
              )}
              {state.selectedTier && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Base monthly rate</p>
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(state.selectedTier.total_price, vendor.currency)}
                  </p>
                </div>
              )}
            </Section>
          )}

          {/* Section 4: Delivery days */}
          {state.selectedTier && (
            <Section num={4} title="Preferred delivery days" animate>
              <div className="grid grid-cols-2 gap-3">
                {DAYS_OPTIONS.map(opt => {
                  const isSelected = state.daysPerWeek === opt.days
                  return (
                    <button
                      key={opt.days}
                      onClick={() => setState(s => ({ ...s, daysPerWeek: opt.days }))}
                      className={cn(
                        'relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300',
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

          {/* Section 5: Duration */}
          {state.daysPerWeek && (
            <Section num={5} title="Plan duration" animate>
              <div className="flex flex-col gap-2">
                {DURATION_OPTIONS.map(opt => {
                  const isSelected = state.durationWeeks === opt.weeks
                  const price =
                    state.selectedTier && state.selectedPackage
                      ? computePrice(state.selectedTier, state.selectedPackage, state.daysPerWeek!, opt.weeks)
                      : null
                  return (
                    <button
                      key={opt.weeks}
                      onClick={() => setState(s => ({ ...s, durationWeeks: opt.weeks }))}
                      className={cn(
                        'relative flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200',
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900">{opt.label}</p>
                            {opt.badge && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {price !== null && (
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {formatCurrency(price, vendor.currency)}
                          </p>
                          <p className="text-xs text-slate-400">total</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Section 6: Start date */}
          {state.durationWeeks && (
            <Section num={6} title="When do you want to start?" subtitle="Fridays unavailable · minimum 2 days from today." animate>
              <CalendarPicker
                value={state.startDate}
                onChange={date => setState(s => ({ ...s, startDate: date }))}
              />
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

        {/* ── Right: sticky summary (desktop only) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <SummarySidebar
              state={state}
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
            {state.selectedPlan ? (
              <>
                <p className="text-xs text-slate-500">{state.selectedPlan.name_en}</p>
                {state.selectedTier && state.selectedPackage && state.daysPerWeek && state.durationWeeks ? (
                  <p className="font-bold text-slate-900">
                    {formatCurrency(
                      computePrice(state.selectedTier, state.selectedPackage, state.daysPerWeek, state.durationWeeks),
                      vendor.currency,
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">Complete your plan above</p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">Select a plan to get started</p>
            )}
          </div>
          {isComplete ? (
            <a
              href={`/store/${vendorSlug}/signup`}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-1.5 rounded-full bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-400"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
