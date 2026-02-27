import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  'White-labeled store with your brand, domain, and colors',
  'AI-powered customer onboarding with plan recommendations',
  'Auto-generated kitchen ops: shopping lists, packing, plating',
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

          {/* Right: dashboard mockup card */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Vendor Dashboard</p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Live
              </span>
            </div>

            {/* Stat tiles */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-900 p-3">
                <p className="text-[10px] text-slate-400">Subscribers</p>
                <p className="mt-1 text-lg font-bold text-white">248</p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <p className="text-[10px] text-emerald-100">Orders Today</p>
                <p className="mt-1 text-lg font-bold text-white">312</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] text-slate-400">Revenue AED</p>
                <p className="mt-1 text-lg font-bold text-slate-900">42.8K</p>
              </div>
            </div>

            {/* Order rows */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Recent Orders
              </p>
              {[
                { name: 'Ahmed Al Rashid', plan: 'High Protein · Tier 2', status: 'Packed' },
                { name: 'Sara Mohammad', plan: 'Keto · Tier 1', status: 'In Transit' },
                { name: 'Khalid Ibrahim', plan: 'Balanced · Tier 3', status: 'Packed' },
              ].map(({ name, plan, status }) => (
                <div key={name} className="flex items-center gap-3 rounded-xl bg-white p-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">{name}</p>
                    <p className="text-[10px] text-slate-400">{plan}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      status === 'Packed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
