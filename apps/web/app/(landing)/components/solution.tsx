import { ChefHat, LayoutDashboard, Sparkles, Store } from 'lucide-react'

const tiles = [
  {
    icon: Store,
    title: 'Your Branded Store',
    body: 'A beautiful web store under your brand. Customers browse your plans, sign up, and manage their subscription — all without seeing the BoxVibe name.',
  },
  {
    icon: LayoutDashboard,
    title: 'Operations Dashboard',
    body: 'Manage customers, menus, kitchen workflows, and delivery schedules from one place. Replace your entire operations stack.',
  },
  {
    icon: Sparkles,
    title: 'AI That Works for You',
    body: 'AI agents that read your Excel menus and auto-configure your store. Automatic plan recommendations for customers based on their biometrics and goals.',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Intelligence',
    body: 'Auto-generated shopping lists, cooking quantities, per-customer plating instructions, and packing checklists. Zero manual calculation.',
  },
]

export default function Solution() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            The Solution
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Everything a meal plan business needs, in one platform.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            BoxVibe is the operating system for your meal subscription business. White-labeled for
            your brand. Built for the GCC market.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {tiles.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl bg-slate-50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <Icon className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
