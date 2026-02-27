import DemoForm from './demo-form'

export default function FinalCta() {
  return (
    <section id="contact" className="bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Ready to stop running your business on spreadsheets?
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Book a 30-minute demo. We&apos;ll show you how BoxVibe can replace your entire manual
            operation and get you live in days.
          </p>
          <div className="mt-8">
            <DemoForm variant="cta" />
          </div>
        </div>
      </div>
    </section>
  )
}
