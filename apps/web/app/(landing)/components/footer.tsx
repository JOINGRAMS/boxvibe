import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold text-white">BoxVibe</p>
            <p className="text-sm text-slate-400">The Shopify of Meal Plans.</p>
            <p className="text-sm text-slate-500">Built in the UAE.</p>
            <p className="mt-4 text-xs text-slate-600">© 2026 BoxVibe. All rights reserved.</p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-300">Product</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How it Works', href: '#how-it-works' },
                { label: 'Pricing', href: '#pricing' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-300">Company</p>
            <nav className="flex flex-col gap-3">
              <a
                href="mailto:hello@boxvibe.com"
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                hello@boxvibe.com
              </a>
              <p className="text-sm text-slate-500">UAE — serving the GCC</p>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
