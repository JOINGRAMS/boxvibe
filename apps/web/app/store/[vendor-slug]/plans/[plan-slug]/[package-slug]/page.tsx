import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getVendorBySlug,
  getPlanBySlug,
  getPackageBySlug,
  getTiersForPlan,
} from '@boxvibe/db'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'

interface PackagePageProps {
  params: Promise<{
    'vendor-slug': string
    'plan-slug': string
    'package-slug': string
  }>
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { 'vendor-slug': vendorSlug, 'plan-slug': planSlug, 'package-slug': packageSlug } =
    await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) return {}
  const plan = await getPlanBySlug(vendor.id, planSlug)
  if (!plan) return {}
  const pkg = await getPackageBySlug(vendor.id, packageSlug)
  if (!pkg) return {}
  const vendorName = vendor.brand_name ?? vendor.name_en
  return { title: `${pkg.category_en} · ${plan.name_en} — ${vendorName}` }
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const {
    'vendor-slug': vendorSlug,
    'plan-slug': planSlug,
    'package-slug': packageSlug,
  } = await params

  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const plan = await getPlanBySlug(vendor.id, planSlug)
  if (!plan) notFound()

  const pkg = await getPackageBySlug(vendor.id, packageSlug)
  if (!pkg) notFound()

  const tiers = await getTiersForPlan(plan.id)
  const storeBase = `/store/${vendorSlug}`

  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        {/* Back */}
        <Link
          href={`${storeBase}/plans/${planSlug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {plan.name_en}
        </Link>

        {/* Package header */}
        <div className="mb-10">
          <p className="mb-1 text-sm font-medium text-emerald-600">{plan.name_en}</p>
          <h1 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
            {pkg.category_en}
          </h1>
          {pkg.description_en && (
            <p className="text-base leading-relaxed text-slate-500">{pkg.description_en}</p>
          )}
        </div>

        {/* Package image */}
        {pkg.cover_image_url && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <Image
              src={pkg.cover_image_url}
              alt={pkg.category_en}
              width={800}
              height={400}
              className="h-56 w-full object-cover md:h-72"
            />
          </div>
        )}

        {/* Tier selector */}
        <div className="mb-10">
          <h2 className="mb-2 text-lg font-bold text-slate-900">Choose your portion tier</h2>
          <p className="mb-6 text-sm text-slate-500">
            Tiers control your daily calorie target and portion sizes.
          </p>

          {tiers.length === 0 ? (
            <p className="text-sm text-slate-400">No tiers configured yet.</p>
          ) : (
            <div className="grid gap-3">
              {tiers.map((tier, i) => (
                <label
                  key={tier.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 ${
                    i === 0
                      ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        i === 0
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {i === 0 && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tier.variance_name_en}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {vendor.currency}{' '}
                    {tier.total_price.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-slate-400">/mo</span>
                  </p>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Sparkles className="h-4 w-4" />
            Ready to start?
          </div>
          <p className="mb-5 text-sm text-emerald-700">
            Create your account to subscribe and get your first week of meals delivered.
          </p>
          {/* Phase 4: link will point to /store/[slug]/signup */}
          <Link
            href={`${storeBase}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Start your journey
          </Link>
        </div>
      </div>
    </div>
  )
}
