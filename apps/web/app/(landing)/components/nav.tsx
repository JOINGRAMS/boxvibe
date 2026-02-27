import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          BoxVibe
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block"
          >
            Book a Demo
          </Link>
          <Button
            asChild
            className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-700"
            size="sm"
          >
            <Link href="#contact">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
