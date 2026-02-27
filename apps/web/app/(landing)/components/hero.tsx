import Link from 'next/link'
import { ChevronUp, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section id="hero" className="overflow-hidden bg-white pb-0 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Centered headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Your Meal Plan Business,{' '}
            <span className="text-slate-400">Finally on Autopilot.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            White-labeled stores, AI-powered onboarding, and automated kitchen
            operations — built for GCC meal subscription businesses.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-slate-900 px-8 text-base text-white hover:bg-slate-700"
            >
              <Link href="#contact">Book a Demo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-slate-300 px-8 text-base text-slate-700 hover:bg-slate-50"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Hero visual — phone + floating cards */}
        <div className="relative mx-auto mt-16 h-[600px] max-w-5xl">
          {/* Warm arc behind phone */}
          <div className="absolute bottom-0 left-1/2 h-[440px] w-[560px] -translate-x-1/2 rounded-t-full bg-amber-50" />

          {/* Phone mockup */}
          <div className="absolute left-1/2 top-0 z-10 h-[575px] w-[272px] -translate-x-1/2 overflow-hidden rounded-[44px] border-[8px] border-slate-900 bg-white shadow-2xl">
            {/* Dynamic island */}
            <div className="flex justify-center pt-3">
              <div className="h-5 w-24 rounded-full bg-slate-900" />
            </div>

            {/* Store UI */}
            <div className="mt-3 px-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Good morning</p>
                  <p className="text-sm font-bold text-slate-900">GRAMS Store</p>
                </div>
                <div className="h-7 w-7 rounded-full bg-slate-900" />
              </div>

              {/* Plan card */}
              <div className="mt-3 rounded-2xl bg-slate-900 p-3">
                <p className="text-[10px] text-slate-400">Your Plan</p>
                <p className="text-sm font-bold text-white">High Protein · Tier 2</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Lunch + Dinner</p>
                <div className="mt-2 flex gap-1">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">
                    2,200 kcal
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                    Active
                  </span>
                </div>
              </div>

              {/* Today's menu */}
              <p className="mt-3 text-xs font-semibold text-slate-900">Today&apos;s Menu</p>
              <div className="mt-2 space-y-2">
                {[
                  { meal: 'Grilled Chicken Bowl', cal: '680 kcal', type: 'Lunch' },
                  { meal: 'Salmon & Quinoa', cal: '720 kcal', type: 'Dinner' },
                ].map(({ meal, cal, type }) => (
                  <div key={type} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2">
                    <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-slate-200" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-slate-900">{meal}</p>
                      <p className="text-[10px] text-slate-400">
                        {type} · {cal}
                      </p>
                    </div>
                    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery status */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-900">Delivery Today</p>
                  <p className="text-[10px] text-slate-400">Arriving 7–9 AM</p>
                </div>
              </div>

              {/* Subscriber count bar */}
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between">
                  <p className="text-[10px] text-slate-400">Packing Progress</p>
                  <p className="text-[10px] font-medium text-slate-700">86%</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 w-[86%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating card — top left (blue) */}
          <div className="absolute left-[6%] top-[6%] z-20 hidden rounded-2xl bg-blue-50 p-4 shadow-lg md:block">
            <p className="text-xs font-medium text-blue-600">Orders Today</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">312</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ChevronUp className="h-3 w-3" />
              18% vs yesterday
            </p>
          </div>

          {/* Floating card — left middle (yellow) */}
          <div className="absolute left-[2%] top-[44%] z-20 hidden rounded-2xl bg-amber-100 p-4 shadow-lg md:block">
            <p className="text-xs font-medium text-amber-700">Monthly Revenue</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">AED 42.8K</p>
            {/* Mini bar chart */}
            <div className="mt-2 flex items-end gap-0.5">
              {[40, 65, 50, 80, 70, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-2.5 rounded-sm bg-amber-400"
                  style={{ height: `${h * 0.32}px` }}
                />
              ))}
            </div>
          </div>

          {/* Floating card — left lower (stars) */}
          <div className="absolute left-[14%] top-[70%] z-20 hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-md md:block">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-900">GRAMS Store</p>
            <p className="text-[10px] text-slate-400">4.9 · 128 reviews</p>
          </div>

          {/* Floating card — top right (green) */}
          <div className="absolute right-[6%] top-[6%] z-20 hidden rounded-2xl bg-green-50 p-4 shadow-lg md:block">
            <p className="text-xs font-medium text-green-700">Active Subscribers</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">248</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ChevronUp className="h-3 w-3" />
              12% this month
            </p>
          </div>

          {/* Floating card — right middle (white) */}
          <div className="absolute right-[4%] top-[48%] z-20 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:block">
            <p className="text-xs font-medium text-slate-500">AI Meal Mapping</p>
            <p className="mt-1 text-sm font-bold text-slate-900">Menu uploaded ✓</p>
            <p className="mt-0.5 text-[10px] text-slate-400">47 meals mapped in 2 min</p>
            <div className="mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600">Auto-generated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
