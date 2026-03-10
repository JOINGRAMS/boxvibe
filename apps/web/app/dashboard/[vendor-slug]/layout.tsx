import { notFound } from 'next/navigation'
import { getVendorBySlug } from '@boxvibe/db'
import { DashboardSidebar } from './dashboard-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ 'vendor-slug': string }>
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)

  if (!vendor) notFound()

  const displayName = vendor.brand_name ?? vendor.name_en

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <DashboardSidebar vendorSlug={vendorSlug} displayName={displayName} logoUrl={vendor.logo_image_url} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[840px] px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
