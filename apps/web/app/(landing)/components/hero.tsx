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
            White-labeled stores, AI-powered onboarding, and automated operations — built for GCC
            meal subscription businesses.
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
              <Link href="#features">See Features</Link>
            </Button>
          </div>
        </div>

        {/* Hero visual — phone + floating cards */}
        <div className="relative mx-auto mt-16 h-[600px] max-w-5xl">
          {/* Warm arc behind phone */}
          <div className="absolute bottom-0 left-1/2 h-[440px] w-[560px] -translate-x-1/2 rounded-t-full bg-amber-50" />

          {/* Phone mockup — customer app */}
          <div className="absolute left-1/2 top-0 z-10 h-[575px] w-[272px] -translate-x-1/2 overflow-hidden rounded-[44px] border-[8px] border-slate-900 bg-white shadow-2xl">
            {/* Dynamic island */}
            <div className="flex justify-center pt-3">
              <div className="h-5 w-24 rounded-full bg-slate-900" />
            </div>

            {/* Date picker strip */}
            <div className="mt-3 flex items-center justify-center gap-1 px-3">
              {[
                { label: '14', sub: 'Oct' },
                { label: '15', sub: 'Oct' },
                { label: 'Today', sub: '' },
                { label: '17', sub: 'Oct' },
                { label: '18', sub: 'Oct' },
              ].map(({ label, sub }) => {
                const isToday = label === 'Today'
                return (
                  <div
                    key={label}
                    className={`flex flex-col items-center rounded-xl px-2 py-1.5 ${isToday ? 'bg-orange-500' : ''}`}
                  >
                    <span
                      className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-slate-600'}`}
                    >
                      {label}
                    </span>
                    {sub && (
                      <span className={`text-[8px] ${isToday ? 'text-orange-200' : 'text-slate-400'}`}>
                        {sub}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Nutritional Summary */}
            <div className="mx-3 mt-3 rounded-2xl border border-slate-100 p-3">
              <p className="text-[11px] font-bold text-slate-900">Nutritional Summary</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[8px] text-slate-400">Planned</p>
                  <p className="text-xs font-bold text-slate-900">1830</p>
                  <p className="text-[8px] text-slate-400">Daily</p>
                </div>
                {/* SVG ring */}
                <svg viewBox="0 0 44 44" width="54" height="54">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#fce7f3" strokeWidth="4" />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeDasharray="50 113"
                    strokeLinecap="round"
                    transform="rotate(-90 22 22)"
                  />
                  <text x="22" y="20" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1e293b">
                    1020
                  </text>
                  <text x="22" y="27" textAnchor="middle" fontSize="4.5" fill="#94a3b8">
                    Cal Left
                  </text>
                </svg>
                <div className="text-center">
                  <p className="text-[8px] text-slate-400">Consumed</p>
                  <p className="text-xs font-bold text-slate-900">1030</p>
                  <p className="text-[8px] text-slate-400">Add</p>
                </div>
              </div>
              {/* Macros */}
              <div className="mt-2 flex gap-1">
                <div className="flex-1 rounded-lg bg-green-100 px-1 py-1 text-center">
                  <p className="text-[7px] text-slate-500">Protein</p>
                  <p className="text-[9px] font-bold text-slate-900">185g</p>
                </div>
                <div className="flex-1 rounded-lg bg-yellow-100 px-1 py-1 text-center">
                  <p className="text-[7px] text-slate-500">Carbs</p>
                  <p className="text-[9px] font-bold text-slate-900">139g</p>
                </div>
                <div className="flex-1 rounded-lg bg-red-100 px-1 py-1 text-center">
                  <p className="text-[7px] text-slate-500">Fat</p>
                  <p className="text-[9px] font-bold text-slate-900">62g</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mx-3 mt-3 rounded-2xl bg-orange-50 p-3">
              <p className="text-[11px] font-bold text-slate-900">Quick Actions</p>
              <div className="mt-2 flex gap-2">
                <div className="flex-1 rounded-xl bg-white py-2 text-center text-[10px] font-semibold text-slate-700 shadow-sm">
                  🚚 Delivery
                </div>
                <div className="flex-1 rounded-xl bg-white py-2 text-center text-[10px] font-semibold text-slate-400 shadow-sm">
                  ↺ Skip day
                </div>
              </div>
            </div>

            {/* Meals of the day */}
            <div className="mx-3 mt-3">
              <p className="text-[11px] font-bold text-slate-900">Meals of the day</p>
              <p className="mt-1 text-[9px] font-semibold text-slate-400">Lunch</p>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 p-2">
                <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-slate-200" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-slate-900">
                    Grilled Chicken Salad
                  </p>
                  <div className="mt-0.5 flex gap-1">
                    <span className="rounded bg-green-100 px-1 py-0.5 text-[7px] text-slate-600">
                      Protein 185g
                    </span>
                    <span className="rounded bg-yellow-100 px-1 py-0.5 text-[7px] text-slate-600">
                      Carbs 139g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom tab bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-slate-100 bg-white px-4 py-2">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-4 w-4 rounded-sm bg-orange-500" />
                <p className="text-[7px] font-semibold text-orange-500">Home</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-4 w-4 rounded-sm bg-slate-200" />
                <p className="text-[7px] text-slate-400">Body Scan</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-4 w-4 rounded-full bg-slate-200" />
                <p className="text-[7px] text-slate-400">Profile</p>
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
