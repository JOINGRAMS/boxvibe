import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  getVendorBySlug,
  getPlansByVendorId,
  getMealTypesForVendor,
  getAllTiersForVendor,
} from '@boxvibe/db'
import SubscribeWizard from './subscribe-wizard'

interface SubscribePageProps {
  params: Promise<{ 'vendor-slug': string }>
}

export async function generateMetadata({ params }: SubscribePageProps): Promise<Metadata> {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) return {}
  const name = vendor.brand_name ?? vendor.name_en
  return {
    title: `Subscribe — ${name}`,
    description: `Build your personalised meal plan from ${name} in a few easy steps.`,
  }
}

function WizardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 h-1.5 animate-pulse rounded-full bg-slate-100" />
      <div className="mb-6 space-y-3">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  )
}

export default async function SubscribePage({ params }: SubscribePageProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)
  if (!vendor) notFound()

  const [plans, mealTypes, tiers] = await Promise.all([
    getPlansByVendorId(vendor.id),
    getMealTypesForVendor(vendor.id),
    getAllTiersForVendor(vendor.id),
  ])

  return (
    <Suspense fallback={<WizardSkeleton />}>
      <SubscribeWizard
        vendor={vendor}
        plans={plans}
        mealTypes={mealTypes}
        tiers={tiers}
        vendorSlug={vendorSlug}
      />
    </Suspense>
  )
}
