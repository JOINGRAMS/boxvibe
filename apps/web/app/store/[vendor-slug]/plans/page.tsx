import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getVendorBySlug, getPlansByVendorId } from '@boxvibe/db'
import { ArrowRight, ChefHat } from 'lucide-react'

interface PlansPageProps {
  params: Promise<{ 'vendor-slug': string }>
}

export async function generateMetadata({ params }: PlansPageProps): Promise<Metadata> {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) return {}
  const name = vendor.brand_name ?? vendor.name_en
  return { title: `Plans — ${name}` }
}

export default async function PlansPage({ params }: PlansPageProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const plans = await getPlansByVendorId(vendor.id)
  const storeBase = `/store/${vendorSlug}`

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Choose your plan</h1>
          <p className="mt-2 text-slate-500">
            Each plan is a dietary approach — pick the one that matches your goals.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center">
            <ChefHat className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-400">No plans available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map(plan => (
              <Link
                key={plan.id}
                href={plan.slug ? `${storeBase}/plans/${plan.slug}` : '#'}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-t-2xl bg-slate-100">
                  {plan.cover_image ? (
                    <Image
                      src={plan.cover_image}
                      alt={plan.name_en}
                      width={400}
                      height={220}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                      <ChefHat className="h-10 w-10 text-emerald-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="mb-1 font-semibold text-slate-900 group-hover:text-emerald-700">
                    {plan.name_en}
                  </h2>
                  {plan.desc_en && (
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {plan.desc_en}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-1 text-sm font-medium text-emerald-600">
                    See packages <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
