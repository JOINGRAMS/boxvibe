import { Badge } from '@/components/ui/badge'
import DemoForm from './demo-form'

export default function Hero() {
  return (
    <section id="hero" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text content */}
          <div className="flex flex-col gap-6">
            <Badge className="w-fit bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
              Built for GCC Meal Businesses
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              The Complete Tech Stack for Meal Plan Businesses.
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-slate-500">
              Stop managing your meal subscription business on spreadsheets and WhatsApp. BoxVibe
              gives you a white-labeled store, automated kitchen operations, and AI that does the
              work for you.
            </p>

            <DemoForm variant="hero" />

            <p className="text-sm text-slate-400">
              Trusted by{' '}
              <span className="font-medium text-slate-600">GRAMS</span>
              {', UAE\'s fastest-growing meal subscription brand.'}
            </p>
          </div>

          {/* Right — abstract dashboard mockup */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              {/* Mock top bar */}
              <div className="mb-6 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-4 h-4 w-40 rounded bg-slate-100" />
              </div>

              {/* Mock stat cards */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Active Subscribers', value: '248' },
                  { label: "Today's Orders", value: '312' },
                  { label: 'Revenue (AED)', value: '42,800' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Mock table rows */}
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-100" />
                {[80, 90, 70, 85, 60].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className={`h-3 rounded bg-slate-100`} style={{ width: `${w}%` }} />
                      <div className="h-2 w-1/3 rounded bg-slate-50" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-green-100" />
                  </div>
                ))}
              </div>

              {/* Indigo accent bar at bottom */}
              <div className="mt-6 rounded-lg bg-indigo-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-3 w-28 rounded bg-indigo-400" />
                    <div className="h-2 w-20 rounded bg-indigo-500" />
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-white/20" />
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -right-4 -top-4 -z-10 h-72 w-72 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
