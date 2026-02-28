import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getVendorBySlug, getPlansByVendorId } from '@boxvibe/db'
import { ArrowRight, Leaf } from 'lucide-react'

interface StoreHomeProps {
  params: Promise<{ 'vendor-slug': string }>
}

export async function generateMetadata({ params }: StoreHomeProps): Promise<Metadata> {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) return {}
  const name = vendor.brand_name ?? vendor.name_en
  return {
    title: name,
    description: `Subscribe to healthy meal plans from ${name}.`,
  }
}

export default async function StoreHomePage({ params }: StoreHomeProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const plans = await getPlansByVendorId(vendor.id)
  const displayName = vendor.brand_name ?? vendor.name_en
  const storeBase = `/store/${vendorSlug}`

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        {vendor.cover_image_url && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={vendor.cover_image_url}
              alt=""
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        )}
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Leaf className="h-3 w-3" />
            Meal Plans
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Eat well, every day.
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-500">
            Fresh, chef-prepared meals from {displayName} delivered to your door. Choose a plan
            that matches your goals.
          </p>
          <Link
            href={`${storeBase}/plans`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Browse Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Plans preview */}
      {plans.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
              Our Plans
            </h2>
            <p className="mb-10 text-center text-slate-500">
              Pick the dietary approach that fits your lifestyle.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map(plan => (
                <Link
                  key={plan.id}
                  href={plan.slug ? `${storeBase}/plans/${plan.slug}` : `${storeBase}/plans`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  {plan.cover_image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={plan.cover_image}
                        alt={plan.name_en}
                        width={400}
                        height={200}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-emerald-700">
                    {plan.name_en}
                  </h3>
                  {plan.desc_en && (
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500">{plan.desc_en}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                    View packages <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
