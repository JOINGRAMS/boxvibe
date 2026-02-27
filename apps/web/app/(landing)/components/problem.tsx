import { Clock, FileSpreadsheet, MessageCircle } from 'lucide-react'

const painPoints = [
  {
    icon: FileSpreadsheet,
    title: 'Spreadsheet Hell',
    body: 'Customer orders, meal selections, ingredient quantities — all tracked manually in Excel. One wrong cell breaks the whole day.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Operations',
    body: 'Coordinating kitchen staff, delivery drivers, and customers through WhatsApp group chats. Nothing is logged. Errors happen daily.',
  },
  {
    icon: Clock,
    title: 'Hours of Manual Entry',
    body: "Your team spends hours entering data that should be automated. That's time and money that should go into growing your business.",
  },
]

export default function Problem() {
  return (
    <section className="bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            The Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Running a meal plan business shouldn&apos;t require an army of spreadsheets.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Most meal plan companies in the GCC run their entire operation through Excel, WhatsApp
            groups, and a team doing manual data entry every single day. There&apos;s no customer
            portal. No kitchen workflow system. No automated anything.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {painPoints.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
