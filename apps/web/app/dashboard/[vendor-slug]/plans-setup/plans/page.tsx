import { notFound } from 'next/navigation'
import { getVendorBySlug, getDashboardPlans } from '@boxvibe/db'
import { PlansClient } from './plans-client'

interface PageProps {
  params: Promise<{ 'vendor-slug': string }>
}

export default async function PlansPage({ params }: PageProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const plans = await getDashboardPlans(vendor.id)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>Plans</span>
        <span className="text-gray-300">&gt;</span>
        <span className="text-gray-500">Diets</span>
      </div>

      {/* Page header */}
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
        Plans
      </h1>
      <p className="mt-1 text-[13px] text-gray-400">
        Diets are used to categorize the meals into dietary preferences, and helps you control the pricing for each
      </p>

      <PlansClient
        vendorId={vendor.id}
        vendorSlug={vendorSlug}
        initialPlans={plans}
      />
    </div>
  )
}
