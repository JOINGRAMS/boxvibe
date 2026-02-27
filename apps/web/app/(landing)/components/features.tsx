export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl space-y-24 px-4 md:px-6 md:space-y-32 lg:px-8">
        {/* Feature 1: Subscription management — left mockup, right text */}
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Left: New Subscription form mockup */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
              <span className="text-xs text-slate-400">←</span>
              <p className="text-xs font-semibold text-slate-900">New Subscription</p>
            </div>
            <div className="p-5">
              {/* Plan */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-slate-900">Plan</p>
                <div className="flex flex-wrap gap-2">
                  {['High Protein', 'Low Carb', 'Balanced', 'Vegetarian'].map((p, i) => (
                    <span
                      key={p}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        i === 0
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {/* Package */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-slate-900">Package</p>
                <div className="flex flex-wrap gap-2">
                  {['Full day', 'B & Lunch', 'Lunch', 'Dinner'].map((p, i) => (
                    <span
                      key={p}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        i === 0
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {/* Calories */}
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold text-slate-900">Calories</p>
                <div className="flex flex-wrap gap-2">
                  {['600–800', '800–1000', '1000–1200', '1200–1400'].map((p, i) => (
                    <span
                      key={p}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        i === 0
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {/* Duration */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold text-slate-900">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map((p, i) => (
                    <span
                      key={p}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        i === 0
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {/* Subtotal */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Subscription subtotal</p>
                <p className="text-sm font-bold text-slate-900">AED 490.00</p>
              </div>
              <div className="mt-3 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-semibold text-white">
                Confirm details
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Subscription Management
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Create and manage subscriptions in minutes.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              Set up any plan configuration — diet type, calorie tier, meal package, and delivery
              schedule — in just a few clicks. BoxVibe handles the pricing, scheduling, and
              customer management automatically.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">2 min</p>
                <p className="mt-1 text-sm text-slate-500">To configure any subscription</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-3xl font-bold text-slate-900">∞</p>
                <p className="mt-1 text-sm text-slate-500">Unlimited subscriptions & customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Customer app — left text, right phone */}
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          {/* Left: Text */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Customer Experience
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              A white-labeled app your customers will love.
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
