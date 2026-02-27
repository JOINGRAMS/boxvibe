import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const included = [
  'White-labeled customer store',
  'Full vendor dashboard & analytics',
  'AI menu mapping from Excel',
  'Automated subscription management',
  'GCC-native payments via Tap',
  'Customer app with AI plan matching',
  'Unlimited customers & orders',
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Start free. Grow together.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            No monthly fees. No setup costs. Just 5% on transactions after your first three months
            — processor fees included.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-10">
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Launch Offer
            </span>
            <p className="mt-4 text-6xl font-bold text-slate-900">Free</p>
            <p className="mt-2 text-lg text-slate-500">for your first 3 months</p>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-sm text-slate-400">then</p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-4xl font-bold text-slate-900">5%</p>
            <p className="mt-2 text-base text-slate-500">per transaction — no monthly fees, ever</p>
            <p className="mt-1 text-xs text-slate-400">
              Includes all Tap Payments processor fees
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="mt-8 w-full rounded-full bg-slate-900 text-white hover:bg-slate-700"
          >
            <Link href="#contact">Start Free — Book a Demo</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">No credit card required to start</p>
        </div>
      </div>
    </section>
  )
}
