import { Rocket, Settings2, UserPlus } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign up & book a demo',
    body: 'Tell us about your business. We set up your account and configure your branded store with your plans and menu.',
  },
  {
    number: '02',
    icon: Settings2,
    title: 'Configure your store',
    body: 'Upload your menu — our AI reads your Excel and maps everything automatically. Customize your brand colors and package details.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch to your customers',
    body: 'Share your store link. Customers sign up, get AI recommendations, and subscribe. Your kitchen operations run automatically from day one.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
            How it Works
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            From sign-up to launch in days, not months.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, body }) => (
            <div key={number} className="relative flex flex-col gap-4">
              {/* Large decorative number */}
              <span className="text-7xl font-bold leading-none text-slate-100">{number}</span>
              <div className="-mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
