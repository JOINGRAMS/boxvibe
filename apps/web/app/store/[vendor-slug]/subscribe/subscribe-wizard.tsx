'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  StorefrontPackage,
  StorefrontPlan,
  StorefrontTier,
  StorefrontVendor,
  PlanPackageLink,
} from '@boxvibe/db'

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6

const DAYS_OPTIONS = [
  { days: 5, label: '5 Days', sublabel: 'Mon – Fri' },
  { days: 6, label: '6 Days', sublabel: 'Mon – Sat' },
]

const DURATION_OPTIONS = [
  { weeks: 1, label: '1 Week', sublabel: 'Try it out' },
  { weeks: 2, label: '2 Weeks', sublabel: 'Most popular' },
  { weeks: 4, label: '1 Month', sublabel: 'Best value' },
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
  if (
    n.includes('full') ||
    (n.includes('breakfast') && n.includes('lunch') && n.includes('dinner'))
  )
    return '🍽️'
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

/** Prorate: total_price is a monthly rate (4 weeks × 5 days). */
function computePrice(
  tier: StorefrontTier,
  pkg: StorefrontPackage,
  daysPerWeek: number,
  durationWeeks: number,
): number {
  const dailyRate = tier.total_price / (4 * 5)
  return Math.round(dailyRate * daysPerWeek * durationWeeks * pkg.price_multiplier)
}

function formatDateLong(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-AE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
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

function canProceed(step: number, state: WizardState): boolean {
  switch (step) {
    case 1: return state.selectedPlan !== null
    case 2: return state.selectedPackage !== null
    case 3: return state.selectedTier !== null
    case 4: return state.daysPerWeek !== null && state.durationWeeks !== null
    case 5: return state.startDate !== null
    case 6: return true
    default: return false
  }
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100)
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">Step {step} of {TOTAL_STEPS}</span>
        <span className="text-xs font-semibold text-emerald-600">{pct}% complete</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between px-0.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
          <div
            key={s}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              s < step && 'bg-emerald-500',
              s === step && 'bg-emerald-500 ring-2 ring-emerald-200 ring-offset-1',
              s > step && 'bg-slate-200',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-slate-500">{subtitle}</p>}
    </div>
  )
}

function SelectionCheckmark() {
  return (
    <span className="absolute top-4 right-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500">
      <Check className="h-3.5 w-3.5 text-white" />
    </span>
  )
}

// ─── Step 1: Plan ─────────────────────────────────────────────────────────────

function StepPlan({
  plans,
  selected,
  onSelect,
}: {
  plans: StorefrontPlan[]
  selected: StorefrontPlan | null
  onSelect: (plan: StorefrontPlan) => void
}) {
  if (plans.length === 0) {
    return (
      <>
        <StepHeader title="Choose your plan" />
        <p className="text-slate-400">No plans available yet — check back soon.</p>
      </>
    )
  }

  return (
    <>
      <StepHeader
        title="Choose your plan"
        subtitle="Pick the dietary approach that fits your goal."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan)}
            className={cn(
              'group relative text-left rounded-2xl border-2 p-5 transition-all duration-200',
              selected?.id === plan.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
            )}
          >
            {selected?.id === plan.id && <SelectionCheckmark />}
            <div className="mb-3 text-4xl">{getPlanEmoji(plan.name_en)}</div>
            <h3 className="mb-1 pr-8 font-semibold text-slate-900">{plan.name_en}</h3>
            {plan.desc_en && (
              <p className="line-clamp-2 text-sm text-slate-500">{plan.desc_en}</p>
            )}
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Step 2: Package ──────────────────────────────────────────────────────────

function StepPackage({
  packages,
  selected,
  onSelect,
}: {
  packages: StorefrontPackage[]
  selected: StorefrontPackage | null
  onSelect: (pkg: StorefrontPackage) => void
}) {
  if (packages.length === 0) {
    return (
      <>
        <StepHeader title="Choose your meals" />
        <p className="text-slate-400">No packages configured for this plan yet.</p>
      </>
    )
  }

  return (
    <>
      <StepHeader
        title="Choose your meals"
        subtitle="Which meal times would you like covered each day?"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => onSelect(pkg)}
            className={cn(
              'group relative text-left rounded-2xl border-2 p-5 transition-all duration-200',
              selected?.id === pkg.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
            )}
          >
            {selected?.id === pkg.id && <SelectionCheckmark />}
            <div className="mb-3 text-4xl">{getPackageEmoji(pkg.category_en)}</div>
            <h3 className="mb-1 pr-8 font-semibold text-slate-900">{pkg.category_en}</h3>
            {pkg.description_en && (
              <p className="line-clamp-2 text-sm text-slate-500">{pkg.description_en}</p>
            )}
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Step 3: Calorie tier ─────────────────────────────────────────────────────

function StepTier({
  tiers,
  selected,
  onSelect,
  currency,
}: {
  tiers: StorefrontTier[]
  selected: StorefrontTier | null
  onSelect: (tier: StorefrontTier) => void
  currency: string
}) {
  if (tiers.length === 0) {
    return (
      <>
        <StepHeader title="How many calories per day?" />
        <p className="text-slate-400">No calorie tiers configured for this plan yet.</p>
      </>
    )
  }

  return (
    <>
      <StepHeader
        title="How many calories per day?"
        subtitle="Pick a calorie tier that matches your goal."
      />
      <div className="flex flex-col gap-3">
        {tiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={cn(
              'relative flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200',
              selected?.id === tier.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
            )}
          >
            {selected?.id === tier.id && (
              <span className="absolute top-1/2 left-4 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" />
              </span>
            )}
            <p
              className={cn(
                'font-semibold text-slate-900 transition-all',
                selected?.id === tier.id && 'ml-8',
              )}
            >
              {tier.variance_name_en}
            </p>
            <div className="text-right">
              <p className="font-bold text-slate-900">
                {formatCurrency(tier.total_price, currency)}
              </p>
              <p className="text-xs text-slate-400">/ month (base)</p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Step 4: Duration ─────────────────────────────────────────────────────────

function StepDuration({
  daysPerWeek,
  durationWeeks,
  onSetDays,
  onSetDuration,
}: {
  daysPerWeek: number | null
  durationWeeks: number | null
  onSetDays: (days: number) => void
  onSetDuration: (weeks: number) => void
}) {
  return (
    <>
      <StepHeader title="How long?" subtitle="Choose how many days per week and for how long." />

      <div className="mb-7">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Days per week
        </p>
        <div className="grid grid-cols-2 gap-3">
          {DAYS_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => onSetDays(opt.days)}
              className={cn(
                'relative rounded-2xl border-2 p-5 text-left transition-all duration-200',
                daysPerWeek === opt.days
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
              )}
            >
              {daysPerWeek === opt.days && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
              <p className="text-2xl font-bold text-slate-900">{opt.days}</p>
              <p className="text-sm text-slate-400">{opt.sublabel}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Duration
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.weeks}
              onClick={() => onSetDuration(opt.weeks)}
              className={cn(
                'relative rounded-2xl border-2 p-4 text-left transition-all duration-200',
                durationWeeks === opt.weeks
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
              )}
            >
              {durationWeeks === opt.weeks && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              )}
              <p className="font-bold text-slate-900">{opt.label}</p>
              <p className="text-xs text-slate-400">{opt.sublabel}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Step 5: Start date (custom calendar) ─────────────────────────────────────

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

  function isDisabled(day: number): boolean {
    const d = new Date(view.year, view.month, day)
    return d.getDay() === 5 || d < minDate
  }

  function isSelected(day: number): boolean {
    if (!value) return false
    const d = new Date(value + 'T00:00:00')
    return (
      d.getFullYear() === view.year &&
      d.getMonth() === view.month &&
      d.getDate() === day
    )
  }

  function handleSelect(day: number) {
    if (isDisabled(day)) return
    const d = new Date(view.year, view.month, day)
    const iso = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
    onChange(iso)
  }

  function prevMonth() {
    setView(v =>
      v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 },
    )
  }

  function nextMonth() {
    setView(v =>
      v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 },
    )
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-slate-900">
          {MONTH_NAMES[view.month]} {view.year}
        </span>
        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAY_NAMES.map(d => (
          <div
            key={d}
            className={cn('py-1 text-xs font-medium', d === 'Fri' ? 'text-red-300' : 'text-slate-400')}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
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
                selected && 'bg-emerald-500 font-semibold text-white',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Earliest start:{' '}
        {minDate.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })} · Fridays
        unavailable
      </p>
    </div>
  )
}

function StepStartDate({
  value,
  onChange,
}: {
  value: string | null
  onChange: (iso: string) => void
}) {
  return (
    <>
      <StepHeader
        title="When do you want to start?"
        subtitle="Pick your first delivery day. Fridays are unavailable."
      />
      <CalendarPicker value={value} onChange={onChange} />
      {value && (
        <p className="mt-5 text-center text-sm font-medium text-emerald-600">
          Starting {formatDateLong(value)}
        </p>
      )}
    </>
  )
}

// ─── Step 6: Summary ──────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4">
      <span className="shrink-0 text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  )
}

function StepSummary({
  state,
  currency,
  vendorSlug,
}: {
  state: WizardState
  currency: string
  vendorSlug: string
}) {
  const { selectedPlan, selectedPackage, selectedTier, daysPerWeek, durationWeeks, startDate } = state

  const price =
    selectedPackage && selectedTier && daysPerWeek && durationWeeks
      ? computePrice(selectedTier, selectedPackage, daysPerWeek, durationWeeks)
      : null

  const durationLabel =
    DURATION_OPTIONS.find(d => d.weeks === durationWeeks)?.label ?? '—'

  return (
    <>
      <StepHeader title="Your order summary" subtitle="Review your selections before checking out." />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          <SummaryRow label="Plan" value={selectedPlan?.name_en ?? '—'} />
          <SummaryRow label="Meals" value={selectedPackage?.category_en ?? '—'} />
          <SummaryRow label="Calorie tier" value={selectedTier?.variance_name_en ?? '—'} />
          <SummaryRow
            label="Days / week"
            value={daysPerWeek ? `${daysPerWeek} days` : '—'}
          />
          <SummaryRow label="Duration" value={durationLabel} />
          <SummaryRow
            label="Start date"
            value={startDate ? formatDateLong(startDate) : '—'}
          />
        </div>

        {/* Price row */}
        <div className="bg-emerald-50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-700">Total</span>
              <p className="text-xs text-slate-400">
                {durationWeeks === 4 ? '1 month' : durationWeeks === 2 ? '2 weeks' : '1 week'}
              </p>
            </div>
            <span className="text-3xl font-bold text-emerald-700">
              {price !== null ? formatCurrency(price, currency) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href={`/store/${vendorSlug}/signup`}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        Proceed to Checkout
      </a>
      <p className="mt-3 text-center text-xs text-slate-400">
        You&apos;ll create your account on the next screen
      </p>
    </>
  )
}

// ─── Main wizard component ────────────────────────────────────────────────────

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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>({
    selectedPlan: null,
    selectedPackage: null,
    selectedTier: null,
    daysPerWeek: null,
    durationWeeks: null,
    startDate: null,
  })

  // Sync step from URL on first render
  useEffect(() => {
    const s = parseInt(searchParams.get('step') ?? '1', 10)
    if (s >= 1 && s <= TOTAL_STEPS) setStep(s)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function goToStep(n: number) {
    const clamped = Math.max(1, Math.min(n, TOTAL_STEPS))
    setStep(clamped)
    router.replace(`?step=${clamped}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectPlan(plan: StorefrontPlan) {
    // Reset downstream selections whenever the plan changes
    setState(s => ({
      ...s,
      selectedPlan: plan,
      selectedPackage: null,
      selectedTier: null,
    }))
  }

  function selectPackage(pkg: StorefrontPackage) {
    // Reset tier whenever the package changes
    setState(s => ({ ...s, selectedPackage: pkg, selectedTier: null }))
  }

  // Derive packages available for the selected plan
  const availablePackageIds = state.selectedPlan
    ? new Set(
        planPackageMap
          .filter(r => r.plan_id === state.selectedPlan!.id)
          .map(r => r.package_id),
      )
    : new Set<string>()

  const filteredPackages = packages.filter(p => availablePackageIds.has(p.id))

  // Derive tiers for the selected plan
  const filteredTiers = state.selectedPlan
    ? tiers.filter(t => t.plan_id === state.selectedPlan!.id)
    : []

  const ready = canProceed(step, state)
  const isLastStep = step === TOTAL_STEPS

  return (
    <div className="pb-32 md:pb-16">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
        <ProgressBar step={step} />

        {/* Animated step content — key forces re-mount on step change */}
        <div key={step} className="animate-step-in">
          {step === 1 && (
            <StepPlan
              plans={plans}
              selected={state.selectedPlan}
              onSelect={selectPlan}
            />
          )}

          {step === 2 && (
            <StepPackage
              packages={filteredPackages}
              selected={state.selectedPackage}
              onSelect={selectPackage}
            />
          )}

          {step === 3 && (
            <StepTier
              tiers={filteredTiers}
              selected={state.selectedTier}
              onSelect={tier => setState(s => ({ ...s, selectedTier: tier }))}
              currency={vendor.currency}
            />
          )}

          {step === 4 && (
            <StepDuration
              daysPerWeek={state.daysPerWeek}
              durationWeeks={state.durationWeeks}
              onSetDays={days => setState(s => ({ ...s, daysPerWeek: days }))}
              onSetDuration={weeks => setState(s => ({ ...s, durationWeeks: weeks }))}
            />
          )}

          {step === 5 && (
            <StepStartDate
              value={state.startDate}
              onChange={date => setState(s => ({ ...s, startDate: date }))}
            />
          )}

          {step === 6 && (
            <StepSummary state={state} currency={vendor.currency} vendorSlug={vendorSlug} />
          )}
        </div>
      </div>

      {/* Sticky nav footer — hidden on the summary step (it has its own CTA) */}
      {!isLastStep && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-sm md:static md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="mx-auto flex max-w-2xl items-center gap-3 md:mt-8">
            {step > 1 && (
              <button
                onClick={() => goToStep(step - 1)}
                className="flex h-12 items-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            <button
              onClick={() => goToStep(step + 1)}
              disabled={!ready}
              className={cn(
                'flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all duration-200',
                ready
                  ? 'bg-emerald-600 shadow-sm hover:bg-emerald-700'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400',
              )}
            >
              {step === TOTAL_STEPS - 1 ? 'Review my order' : 'Continue'}
              {ready && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
