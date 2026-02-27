import { CheckCircle2 } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl space-y-24 px-4 md:px-6 md:space-y-32 lg:px-8">
        {/* Feature 1: Kitchen ops — left mockup, right text */}
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Left: Kitchen ops card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Kitchen Operations</p>
              <span className="text-xs text-slate-400">Today · 312 orders</span>
            </div>

            {/* Shopping list */}
            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Auto-Generated Shopping List
              </p>
              <div className="space-y-2.5">
                {[
                  { item: 'Chicken Breast', qty: '47.2 kg', done: true },
                  { item: 'Salmon Fillet', qty: '23.8 kg', done: true },
                  { item: 'Quinoa', qty: '18.5 kg', done: false },
                  { item: 'Broccoli', qty: '31.0 kg', done: false },
                ].map(({ item, qty, done }) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                        done ? 'bg-emerald-500' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {done && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span
                      className={`flex-1 text-xs ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                    >
                      {item}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing progress */}
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500">Packing Progress</span>
              <span className="font-medium text-slate-700">86% · 268 / 312</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-[86%] rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Kitchen Operations
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Auto-generate every kitchen task, every day.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              BoxVibe calculates your shopping list, cooking quantities, plating instructions, and
              packing checklists automatically — based on who ordered what, at what portion size.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="mt-1 text-sm text-slate-500">Hours of manual entry</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">2 min</p>
                <p className="mt-1 text-sm text-slate-500">To generate full kitchen report</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Customer store — left text, right phone */}
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Customer Experience
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              A white-labeled store your customers will love.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              Your brand. Your domain. Your colors. Customers never see the BoxVibe name. AI
              recommends the right plan based on their goals and biometrics during a guided
              onboarding flow.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">100%</p>
                <p className="mt-1 text-sm text-slate-500">Your brand, your domain</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">AI</p>
                <p className="mt-1 text-sm text-slate-500">Personalised plan recommendations</p>
              </div>
            </div>
          </div>

          {/* Right: Phone mockup (customer onboarding) */}
          <div className="flex justify-center">
            <div className="relative h-[480px] w-[234px] overflow-hidden rounded-[40px] border-[7px] border-slate-900 bg-white shadow-2xl">
              <div className="flex justify-center pt-3">
                <div className="h-4 w-20 rounded-full bg-slate-900" />
              </div>
              <div className="mt-4 px-3">
                <p className="text-center text-[10px] text-slate-400">Step 2 of 4</p>
                <div className="mt-1 h-1 w-full rounded-full bg-slate-100">
                  <div className="h-1 w-1/2 rounded-full bg-slate-900" />
                </div>
                <p className="mt-4 text-center text-sm font-bold text-slate-900">
                  What&apos;s your goal?
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: 'Lose Weight', sel: false },
                    { label: 'Build Muscle', sel: true },
                    { label: 'Maintain & Eat Clean', sel: false },
                  ].map(({ label, sel }) => (
                    <div
                      key={label}
                      className={`rounded-xl border p-3 text-center text-xs font-medium ${
                        sel
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-[10px] font-semibold text-emerald-700">AI Recommendation</p>
                  <p className="mt-1 text-xs font-bold text-slate-900">High Protein · Tier 2</p>
                  <p className="text-[10px] text-slate-500">2,200 kcal · Lunch + Dinner</p>
                </div>
                <button className="mt-3 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white">
                  Looks great, continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
