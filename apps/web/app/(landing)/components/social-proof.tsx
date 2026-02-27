const stats = [
  { value: '1', label: 'Active vendor', sub: 'GRAMS, UAE' },
  { value: 'GCC', label: 'Market focus', sub: 'UAE, Saudi, Kuwait, Bahrain' },
  { value: 'Day 1', label: 'Our own customer', sub: 'Dogfooding from launch' },
]

export default function SocialProof() {
  return (
    <section className="bg-indigo-600 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Quote */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-5xl font-bold leading-none text-indigo-400">&ldquo;</p>
          <blockquote className="mt-2 text-xl font-medium leading-relaxed text-white md:text-2xl">
            We built BoxVibe because we needed it ourselves. GRAMS — our own meal subscription
            company in the UAE — ran on spreadsheets and WhatsApp just like everyone else. Now
            we&apos;re building the platform we always wished existed, and GRAMS is our first
            customer.
          </blockquote>
          <p className="mt-6 text-indigo-200">
            — Mustafa, Founder of BoxVibe and GRAMS
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid gap-8 border-t border-indigo-500 pt-16 md:grid-cols-3">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-bold text-white">{value}</p>
              <p className="mt-1 font-medium text-indigo-200">{label}</p>
              <p className="mt-0.5 text-sm text-indigo-300">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
