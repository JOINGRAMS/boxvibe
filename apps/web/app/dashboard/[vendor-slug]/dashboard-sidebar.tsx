'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  CreditCard,
  Percent,
  BarChart3,
  CalendarDays,
  UtensilsCrossed,
  Settings2,
  ChefHat,
  Smartphone,
  LifeBuoy,
  UserCircle,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

interface DashboardSidebarProps {
  vendorSlug: string
  displayName: string
  logoUrl: string | null
}

const plansSetupItems = [
  { label: 'Pricing & Portions', href: 'pricing-portions' },
]

export function DashboardSidebar({ vendorSlug, displayName, logoUrl }: DashboardSidebarProps) {
  const pathname = usePathname()
  const base = `/dashboard/${vendorSlug}`
  const [plansOpen, setPlansOpen] = useState(true)

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: base },
    { icon: CreditCard, label: 'Subscriptions', href: '#' },
    { icon: Users, label: 'Customers', href: '#' },
    { icon: Percent, label: 'Discounts', href: '#' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
  ]

  const navItems2 = [
    { icon: CalendarDays, label: 'Menu Calendar', href: '#' },
    { icon: UtensilsCrossed, label: 'Meals', href: '#', hasChevron: true },
  ]

  const navItems3 = [
    { icon: ChefHat, label: 'Kitchen', href: '#' },
    { icon: Settings2, label: 'Settings', href: '#' },
    { icon: Smartphone, label: 'Customer App', href: '#' },
  ]

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
        {/* Primary nav */}
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-gray-100 font-medium text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-[18px] w-[18px] text-gray-500" />
                {item.label}
                {item.label === 'Subscriptions' || item.label === 'Customers' ? (
                  <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
                ) : null}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gray-100" />

        {/* Menu section */}
        <div className="space-y-0.5">
          {navItems2.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="h-[18px] w-[18px] text-gray-500" />
              {item.label}
              {item.hasChevron && <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />}
            </Link>
          ))}

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

          {navItems3.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="h-[18px] w-[18px] text-gray-500" />
              {item.label}
            </Link>
          ))}
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
