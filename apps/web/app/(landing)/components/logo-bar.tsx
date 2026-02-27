const brands = [
  { name: 'GRAMS', style: 'font-black tracking-widest' },
  { name: 'NutriBox', style: 'font-bold tracking-tight' },
  { name: 'FitMeals', style: 'font-extrabold tracking-wide' },
  { name: 'DietHub', style: 'font-semibold tracking-normal' },
  { name: 'Macros+', style: 'font-black tracking-tight' },
  { name: 'CleanEats', style: 'font-bold tracking-wider' },
  { name: 'BodyFuel', style: 'font-extrabold tracking-normal' },
]

export default function LogoBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium uppercase tracking-widest text-slate-400">
          Trusted by meal plan brands across the GCC
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {brands.map(({ name, style }) => (
            <span
              key={name}
              className={`text-base text-slate-300 transition-colors hover:text-slate-500 ${style}`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
