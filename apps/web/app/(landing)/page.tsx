import Nav from './components/nav'
import Hero from './components/hero'
import LogoBar from './components/logo-bar'
import Solution from './components/solution'
import Features from './components/features'
import Pricing from './components/pricing'
import FinalCta from './components/final-cta'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <LogoBar />
      <Solution />
      <Features />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  )
}
