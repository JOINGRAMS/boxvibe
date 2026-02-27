const brands = ['GRAMS', 'NutriBox', 'FitMeals', 'DietHub', 'Macros+', 'CleanEats']

export default function LogoBar() {
  return (
    <section className="border-b border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-400">
          Trusted by meal plan brands across the GCC
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold tracking-tight text-slate-300 transition-colors hover:text-slate-500"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
