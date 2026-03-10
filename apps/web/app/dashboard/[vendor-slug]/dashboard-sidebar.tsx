'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface DashboardSidebarProps {
  vendorSlug: string
  displayName: string
  logoUrl: string | null
}

const plansSetupItems = [
  { label: 'Pricing & Portions', href: 'pricing-portions' },
  // Future items will be added here as we build them:
  // { label: 'Diets', href: 'diets' },
  // { label: 'Packages', href: 'packages' },
]

export function DashboardSidebar({ vendorSlug, displayName, logoUrl }: DashboardSidebarProps) {
  const pathname = usePathname()
  const base = `/dashboard/${vendorSlug}`
  const [plansOpen, setPlansOpen] = useState(true)

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      {/* Vendor branding */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4">
        {logoUrl && (logoUrl.startsWith('/') || logoUrl.startsWith('http')) ? (
          <Image src={logoUrl} alt={displayName} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            {displayName.charAt(0)}
          </div>
        )}
        <span className="text-sm font-semibold text-gray-900">{displayName}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Dashboard link */}
        <Link
          href={base}
          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname === base
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          Dashboard
        </Link>

        {/* Plans Setup section */}
        <div className="mt-2">
          <button
            onClick={() => setPlansOpen(!plansOpen)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.includes('/plans-setup')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Plans setup
            <ChevronRight
              className={`h-4 w-4 transition-transform ${plansOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {plansOpen && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
              {plansSetupItems.map((item) => {
                const href = `${base}/plans-setup/${item.href}`
                const isActive = pathname === href
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'font-medium text-gray-900 bg-gray-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
            BA
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">Bara Awwad</p>
            <p className="truncate text-xs text-gray-500">hi@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
