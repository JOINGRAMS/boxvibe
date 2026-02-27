import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  'White-labeled store with your brand, domain, and colors',
  'AI-powered customer onboarding with plan recommendations',
  'Flexible subscription management — plans, packages, and billing',
  'GCC-native payments via Tap — AED, SAR, KWD and more',
]

export default function Solution() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Left: text */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              The Platform
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Everything a meal plan business needs, in one platform.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              BoxVibe is the operating system for your meal subscription business.
              White-labeled for your brand. Built for the GCC market.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-8 rounded-full bg-slate-900 px-7 text-white hover:bg-slate-700"
            >
              <Link href="#contact">Book a Demo</Link>
            </Button>
          </div>

          {/* Right: real dashboard mockup */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2.5 border-b border-slate-100 bg-white px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-400">Dashboard Overview</span>
            </div>

            <div className="flex bg-stone-50">
              {/* Sidebar */}
              <div className="hidden w-28 flex-shrink-0 border-r border-slate-100 bg-white p-3 md:block">
                <div className="mb-3 flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded bg-slate-900" />
                  <span className="text-[10px] font-bold text-slate-900">BoxVibe</span>
                </div>
                {['Dashboard', 'Subscriptions', 'Customers', 'Analytics', 'Meals', 'Settings'].map(
                  (item) => (
                    <div
                      key={item}
                      className={`mb-1 rounded-lg px-2 py-1.5 text-[9px] ${
                        item === 'Subscriptions'
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4">
                <p className="text-sm font-bold text-slate-900">Subscriptions</p>

                {/* 4 stat cards */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { label: 'Total Sales', value: 'AED 42.8K', change: '+35%' },
                    { label: 'Subscribers', value: '248', change: '+12%' },
                    { label: 'Avg. Value', value: 'AED 810', change: '+10%' },
                    { label: 'Avg. Length', value: '3.2 wks', change: '+5%' },
                  ].map(({ label, value, change }) => (
                    <div key={label} className="rounded-xl bg-white p-3 shadow-sm">
                      <p className="text-[9px] text-slate-400">{label}</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
                      <p className="mt-0.5 text-[8px] font-medium text-emerald-600">{change}</p>
                    </div>
                  ))}
                </div>

                {/* Area chart */}
                <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-[9px] font-semibold text-slate-700">Subscription trend</p>
                  <div className="mt-2 h-14 w-full">
                    <svg
                      viewBox="0 0 200 56"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                    >
                      <path
                        d="M0,38 C30,30 50,18 80,22 C110,26 140,12 170,16 L200,14 L200,56 L0,56 Z"
                        fill="#5eead4"
                        fillOpacity="0.35"
                      />
                      <path
                        d="M0,38 C30,30 50,18 80,22 C110,26 140,12 170,16 L200,14"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M0,46 C30,42 50,34 80,38 C110,42 140,36 170,40 L200,38 L200,56 L0,56 Z"
                        fill="#fca5a5"
                        fillOpacity="0.25"
                      />
                      <path
                        d="M0,46 C30,42 50,34 80,38 C110,42 140,36 170,40 L200,38"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div className="mt-1 flex gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <p className="text-[8px] text-slate-400">This week</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-300" />
                      <p className="text-[8px] text-slate-400">Last week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
