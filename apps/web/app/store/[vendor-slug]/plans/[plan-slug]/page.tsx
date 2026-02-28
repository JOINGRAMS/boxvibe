import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getVendorBySlug, getPlanBySlug, getPackagesForPlan, getTiersForPlan } from '@boxvibe/db'
import { ArrowLeft, ArrowRight, Clock, Utensils } from 'lucide-react'

interface PlanPageProps {
  params: Promise<{ 'vendor-slug': string; 'plan-slug': string }>
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const { 'vendor-slug': vendorSlug, 'plan-slug': planSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) return {}
  const plan = await getPlanBySlug(vendor.id, planSlug)
  if (!plan) return {}
  const vendorName = vendor.brand_name ?? vendor.name_en
  return { title: `${plan.name_en} — ${vendorName}` }
}

export default async function PlanDetailPage({ params }: PlanPageProps) {
  const { 'vendor-slug': vendorSlug, 'plan-slug': planSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const plan = await getPlanBySlug(vendor.id, planSlug)
  if (!plan) notFound()

  const [packages, tiers] = await Promise.all([
    getPackagesForPlan(plan.id),
    getTiersForPlan(plan.id),
  ])

  const storeBase = `/store/${vendorSlug}`

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Back link */}
        <Link
          href={`${storeBase}/plans`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All plans
        </Link>

        {/* Plan hero */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center">
          {plan.cover_image && (
            <div className="overflow-hidden rounded-2xl md:w-2/5">
              <Image
                src={plan.cover_image}
                alt={plan.name_en}
                width={600}
                height={400}
                className="h-56 w-full object-cover md:h-72"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">{plan.name_en}</h1>
            {plan.desc_en && (
              <p className="text-base leading-relaxed text-slate-500">{plan.desc_en}</p>
            )}

            {/* Tiers summary pill */}
            {tiers.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tiers.map(tier => (
                  <span
                    key={tier.id}
                    className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    {tier.variance_name_en} — {vendor.currency} {tier.total_price.toLocaleString()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Packages */}
        <div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">Choose your package</h2>
          <p className="mb-8 text-slate-500">
            A package defines which meals you receive each day.
          </p>

          {packages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <Utensils className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-slate-400">No packages available for this plan yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {packages.map(pkg => (
                <Link
                  key={pkg.id}
                  href={pkg.slug ? `${storeBase}/plans/${planSlug}/${pkg.slug}` : '#'}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  {pkg.cover_image_url && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={pkg.cover_image_url}
                        alt={pkg.category_en}
                        width={400}
                        height={180}
                        className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                      {pkg.category_en}
                    </h3>
                    {pkg.price_multiplier !== 1 && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        ×{pkg.price_multiplier}
                      </span>
                    )}
                  </div>

                  {pkg.description_en && (
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                      {pkg.description_en}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Daily delivery
                    </span>
                    <span className="ml-auto flex items-center gap-1 font-medium text-emerald-600">
                      Select <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
