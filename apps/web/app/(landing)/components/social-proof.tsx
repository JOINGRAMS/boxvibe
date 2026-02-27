export default function SocialProof() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 md:items-start">
          {/* Left: headline + stats */}
          <div>
            <span className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Our Story
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Built by operators, for operators.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              We built BoxVibe because we needed it ourselves. GRAMS — our own meal subscription
              company in the UAE — ran on spreadsheets and WhatsApp just like everyone else.
            </p>

            <div className="mt-10 space-y-6 border-t border-slate-100 pt-10">
              {[
                {
                  value: '1',
                  label: 'Active vendor on day one',
                  sub: 'GRAMS, UAE — the founder\'s own meal subscription company',
                },
                {
                  value: 'GCC',
                  label: 'Market focus',
                  sub: 'UAE, Saudi Arabia, Kuwait, Bahrain — built for the region',
                },
                {
                  value: 'Day 1',
                  label: 'Dogfooding from launch',
                  sub: 'We use BoxVibe to run GRAMS, so it has to actually work',
                },
              ].map(({ value, label, sub }) => (
                <div key={label} className="flex gap-5">
                  <p className="w-20 flex-shrink-0 text-4xl font-bold text-slate-900">{value}</p>
                  <div>
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: quote card + stat cards */}
          <div className="md:pt-8">
            <div className="rounded-2xl bg-slate-900 p-8">
              <p className="text-5xl font-bold leading-none text-slate-600">&ldquo;</p>
              <blockquote className="mt-3 text-lg font-medium leading-relaxed text-white">
                We&apos;re building the platform we always wished existed. GRAMS is our first
                customer — and our harshest critic.
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700">
                  <span className="text-lg font-bold text-white">M</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Mustafa</p>
                  <p className="text-sm text-slate-400">Founder, BoxVibe &amp; GRAMS</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-amber-50 p-5">
                <p className="text-4xl font-bold text-slate-900">GCC</p>
                <p className="mt-1 text-sm text-slate-600">First market — UAE, SA, Kuwait</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-4xl font-bold text-slate-900">100%</p>
                <p className="mt-1 text-sm text-slate-600">White-labeled. Your brand only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
