import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getVendorBySlug } from '@boxvibe/db'

interface StoreLayoutProps {
  children: React.ReactNode
  params: Promise<{ 'vendor-slug': string }>
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { 'vendor-slug': vendorSlug } = await params
  const vendor = await getVendorBySlug(vendorSlug)

  if (!vendor) notFound()

  const displayName = vendor.brand_name ?? vendor.name_en
  const storeHref = `/store/${vendorSlug}`

  return (
    <div className="min-h-screen bg-white">
      {/* Store nav */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          {/* Vendor logo / name */}
          <Link href={storeHref} className="flex items-center gap-2">
            {vendor.logo_image_url ? (
              <Image
                src={vendor.logo_image_url}
                alt={displayName}
                width={120}
                height={36}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {displayName}
              </span>
            )}
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              href={`${storeHref}/plans`}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              Plans
            </Link>
            <Link
              href={`${storeHref}/plans`}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Store footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <p className="text-sm text-slate-400">
            Powered by{' '}
            <Link href="/" className="font-medium text-slate-500 hover:text-slate-700">
              BoxVibe
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
