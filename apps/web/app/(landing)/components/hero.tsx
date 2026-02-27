import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section id="hero" className="overflow-hidden bg-white pb-0 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Centered text */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600">
            Built for GCC Meal Businesses
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Your Meal Plan Business,{' '}
            <span className="text-slate-400">Finally on Autopilot.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Stop managing your meal subscription business on spreadsheets and WhatsApp. BoxVibe
            gives you a white-labeled store, AI-powered onboarding, and automated kitchen operations
            — all in one platform.
          </p>

          {/* Two pill CTAs */}
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

        {/* Dashboard visual with floating cards */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Floating card — top left */}
          <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:block">
            <p className="text-xs text-slate-400">Active Subscribers</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">248</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">↑ 12% this month</p>
          </div>

          {/* Floating card — top right */}
          <div className="absolute -right-4 top-8 z-10 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:block">
            <p className="text-xs text-slate-400">Today&apos;s Revenue</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">AED 8,420</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">↑ 312 orders packed</p>
          </div>

          {/* Floating card — bottom left */}
          <div className="absolute -left-2 bottom-16 z-10 hidden rounded-2xl border border-slate-100 bg-slate-900 p-4 shadow-lg md:block">
            <p className="text-xs text-slate-400">Shopping List</p>
            <p className="mt-0.5 text-sm font-semibold text-white">Auto-generated ✓</p>
            <p className="mt-1 text-xs text-slate-500">47 ingredients ready</p>
          </div>

          {/* Floating card — bottom right */}
          <div className="absolute -right-2 bottom-16 z-10 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:block">
            <p className="text-xs text-slate-400">AI Recommendation</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">High Protein · Tier 2</p>
            <p className="mt-1 text-xs text-slate-500">Based on biometrics</p>
          </div>

          {/* Central dashboard mockup */}
          <div className="relative rounded-t-2xl border border-b-0 border-slate-200 bg-white shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <div className="mx-auto h-5 w-56 rounded-full bg-slate-100" />
            </div>

            {/* Dashboard content */}
            <div className="grid grid-cols-4 divide-x divide-slate-100">
              {/* Sidebar */}
              <div className="col-span-1 space-y-2 p-4">
                <div className="h-7 w-full rounded-lg bg-slate-900" />
                {['bg-slate-100', 'bg-slate-100', 'bg-slate-100', 'bg-slate-50', 'bg-slate-50'].map(
                  (bg, i) => (
                    <div key={i} className={`h-7 w-full rounded-lg ${bg}`} />
                  ),
                )}
              </div>

              {/* Main content */}
              <div className="col-span-3 p-5">
                {/* Stat row */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Subscribers', val: '248', color: 'bg-slate-900' },
                    { label: 'Orders Today', val: '312', color: 'bg-emerald-500' },
                    { label: 'Revenue AED', val: '42.8K', color: 'bg-slate-100' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className={`rounded-xl p-4 ${color}`}>
                      <p
                        className={`text-xs ${color === 'bg-slate-100' ? 'text-slate-400' : 'text-white/70'}`}
                      >
                        {label}
                      </p>
                      <p
                        className={`mt-1 text-xl font-bold ${color === 'bg-slate-100' ? 'text-slate-900' : 'text-white'}`}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                <div className="space-y-2.5">
                  <div className="h-3 w-1/3 rounded bg-slate-200" />
                  {[92, 78, 85, 70, 88].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-7 w-7 flex-shrink-0 rounded-full bg-slate-100" />
                      <div className="flex-1">
                        <div className="h-2.5 rounded bg-slate-100" style={{ width: `${w}%` }} />
                      </div>
                      <div className="h-5 w-14 rounded-full bg-emerald-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
