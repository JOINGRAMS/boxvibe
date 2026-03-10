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
      <div className="mb-1 text-sm text-gray-500">
        Plans setup &gt; Pricing &amp; Portions
      </div>

      {/* Page header */}
      <h1 className="text-2xl font-semibold text-gray-900">Pricing &amp; Portions</h1>
      <p className="mt-1 text-sm text-gray-500">
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
