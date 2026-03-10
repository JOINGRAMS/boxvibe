import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVendorBySlug, getDashboardPlans, getPortionSizes } from '@boxvibe/db'
import { RecipeImportClient } from './recipe-import-client'

export const metadata: Metadata = { title: 'Import Recipe — Meal Builder' }

interface Props {
  params: Promise<{ 'vendor-slug': string }>
}

export default async function RecipeImportPage({ params }: Props) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const [plans, portionSizes] = await Promise.all([
    getDashboardPlans(vendor.id),
    getPortionSizes(vendor.id),
  ])

  // Only pass active plans & portions
  const activePlans = plans.filter(p => p.is_active)
  const activePortions = portionSizes.filter(p => p.is_active)

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Import Recipe</h1>
      <p className="mt-1 text-sm text-gray-500">
        Paste or upload a recipe document and let AI extract structured data, calculate macros, and generate portion-scaled versions.
      </p>
      <RecipeImportClient
        vendorId={vendor.id}
        vendorSlug={vendorSlug}
        plans={activePlans}
        portionSizes={activePortions}
      />
    </div>
  )
}
