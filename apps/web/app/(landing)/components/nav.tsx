import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          BoxVibe
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
        </div>

        {/* CTA */}
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          size="sm"
        >
          <Link href="#contact">Book a Demo</Link>
        </Button>
      </nav>
    </header>
  )
}
