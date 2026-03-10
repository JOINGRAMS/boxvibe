'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronRight, LayoutDashboard, Settings2, LifeBuoy, UserCircle, ChevronDown, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'

interface DashboardSidebarProps {
  vendorSlug: string
  displayName: string
  logoUrl: string | null
}

const plansSetupItems = [
  { label: 'Pricing & Portions', href: 'pricing-portions' },
  { label: 'Plans', href: 'plans' },
  { label: 'Calorie Tiers', href: 'calorie-tiers' },
]

export function DashboardSidebar({ vendorSlug, displayName, logoUrl }: DashboardSidebarProps) {
  const pathname = usePathname()
  const base = `/dashboard/${vendorSlug}`
  const [plansOpen, setPlansOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Vendor branding */}
      <div className="flex items-center gap-3 px-5 py-5">
        {logoUrl && (logoUrl.startsWith('/') || logoUrl.startsWith('http')) ? (
          <Image src={logoUrl} alt={displayName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            {displayName.charAt(0)}
          </div>
        )}
        <span className="text-[13px] font-semibold text-gray-900">{displayName}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {/* Dashboard */}
        <Link
          href={base}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
            pathname === base
              ? 'bg-gray-100 font-medium text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard className="h-[18px] w-[18px] text-gray-500" />
          Dashboard
        </Link>

        <div className="my-3 h-px bg-gray-100" />

        {/* Plans Setup — expandable */}
        <div>
          <button
            onClick={() => setPlansOpen(!plansOpen)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
              pathname.includes('/plans-setup')
                ? 'bg-gray-100 font-medium text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings2 className="h-[18px] w-[18px] text-gray-500" />
            Plans setup
            <ChevronRight
              className={`ml-auto h-4 w-4 text-gray-300 transition-transform duration-200 ${plansOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {plansOpen && (
            <div className="mt-0.5 space-y-0.5 pl-[42px]">
              {plansSetupItems.map((item) => {
                const href = `${base}/plans-setup/${item.href}`
                const isActive = pathname === href
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`block rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                      isActive
                        ? 'font-medium text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="my-3 h-px bg-gray-100" />

        {/* Menu Builder — expandable */}
        <div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
              pathname.includes('/menu')
                ? 'bg-gray-100 font-medium text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <UtensilsCrossed className="h-[18px] w-[18px] text-gray-500" />
            Menu Builder
            <ChevronRight
              className={`ml-auto h-4 w-4 text-gray-300 transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="mt-0.5 space-y-0.5 pl-[42px]">
              <Link
                href={`${base}/menu/import`}
                className={`block rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  pathname === `${base}/menu/import`
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Import Recipe
              </Link>
              <Link
                href={`${base}/menu/items`}
                className={`block rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  pathname === `${base}/menu/items`
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                All Items
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100">
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-gray-500 hover:text-gray-700"
        >
          <LifeBuoy className="h-[18px] w-[18px] text-gray-500" />
          Support
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-gray-500 hover:text-gray-700"
        >
          <UserCircle className="h-[18px] w-[18px] text-gray-500" />
          Account Settings
        </Link>
        <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-white">
            BA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-gray-900">Bara Awwad</p>
            <p className="truncate text-[11px] text-gray-400">hi@example.com</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </div>
      </div>
    </aside>
  )
}
