import Nav from './components/nav'
import Hero from './components/hero'
import Problem from './components/problem'
import Solution from './components/solution'
import HowItWorks from './components/how-it-works'
import Features from './components/features'
import SocialProof from './components/social-proof'
import Pricing from './components/pricing'
import FinalCta from './components/final-cta'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <SocialProof />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  )
}
