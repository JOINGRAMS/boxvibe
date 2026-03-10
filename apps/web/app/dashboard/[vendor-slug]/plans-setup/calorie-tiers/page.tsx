import { notFound } from 'next/navigation'
import { getVendorBySlug, getCalorieTiers, getPortionSizes, getMealTypesWithPortions } from '@boxvibe/db'
import { CalorieTiersClient } from './calorie-tiers-client'

interface PageProps {
  params: Promise<{ 'vendor-slug': string }>
}

export default async function CalorieTiersPage({ params }: PageProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const [calorieTiers, portionSizes, mealTypes] = await Promise.all([
    getCalorieTiers(vendor.id),
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
        <span className="text-gray-500">Calorie Tiers</span>
      </div>

      {/* Page header */}
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
        Calorie Tiers
      </h1>
      <p className="mt-1 text-[13px] text-gray-400">
        Define how portion sizes are assigned to each meal type per calorie tier. The store dynamically computes calorie ranges based on which meals the customer selects.
      </p>

      <CalorieTiersClient
        vendorId={vendor.id}
        vendorSlug={vendorSlug}
        initialTiers={calorieTiers}
        portionSizes={portionSizes}
        mealTypes={mealTypes}
      />
    </div>
  )
}
