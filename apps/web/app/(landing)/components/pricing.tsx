import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const included = [
  'White-labeled customer store',
  'Full vendor dashboard',
  'AI menu mapping from Excel',
  'Kitchen operations module',
  'Tap Payments integration',
  'WhatsApp notifications',
  'Unlimited customers',
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
            Simple, transparent pricing for GCC businesses.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            A flat monthly platform fee plus a small transaction fee on orders. No hidden costs. No
            per-seat charges. Scale as you grow.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-10">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Platform fee</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">Contact for pricing</p>
            <p className="mt-2 text-sm text-slate-400">+ small transaction fee per order</p>
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
            <Link href="#contact">Book a Demo to Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
