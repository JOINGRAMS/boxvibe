import { BrainCircuit, ChefHat, CreditCard, Globe, MessageSquare, Users } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'White-Labeled Store',
    body: 'Your brand, your domain, your colors. Customers never see the BoxVibe name.',
  },
  {
    icon: Users,
    title: 'Customer Onboarding',
    body: 'AI-powered plan recommendations based on biometrics. Multi-step onboarding with goal setting.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Meal Planning',
    body: 'Upload an Excel menu. AI auto-maps meals to your plan hierarchy. Hours of entry become minutes.',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Operations',
    body: 'Auto-generated shopping lists, cooking quantities, plating instructions, and packing checklists.',
  },
  {
    icon: CreditCard,
    title: 'Tap Payments',
    body: 'GCC-native payments. AED, SAR, KWD and more. Recurring subscriptions handled automatically.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Notifications',
    body: 'Order confirmations, delivery alerts, and subscription reminders sent automatically via WhatsApp.',
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Built for how meal plan businesses actually operate.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 p-6 transition-colors duration-200 hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
