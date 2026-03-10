import { notFound } from 'next/navigation'
import { getVendorBySlug, getPortionSizes, getMealTypesWithPortions } from '@boxvibe/db'
import { PricingPortionsClient } from './pricing-portions-client'

interface PageProps {
  params: Promise<{ 'vendor-slug': string }>
}

export default async function PricingPortionsPage({ params }: PageProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const [portionSizes, mealTypes] = await Promise.all([
    getPortionSizes(vendor.id),
    getMealTypesWithPortions(vendor.id),
  ])

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>Plans setup</span>
        <span className="text-gray-300">&gt;</span>
        <span className="text-gray-500">Pricing &amp; Portions</span>
      </div>

      {/* Page header */}
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
        Pricing &amp; Portions
      </h1>
      <p className="mt-1 text-[13px] text-gray-400">
        Manage your portion sizes, meal types, base pricing
      </p>

      <PricingPortionsClient
        vendorId={vendor.id}
        vendorSlug={vendorSlug}
        initialPortionSizes={portionSizes}
        initialMealTypes={mealTypes}
      />
    </div>
  )
}
