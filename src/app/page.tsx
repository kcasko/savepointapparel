import Hero from '@/components/home/hero'
import FeaturedProducts from '@/components/home/featured-products'
import NewsletterSignup from '@/components/home/newsletter-signup'
import RetroSection from '@/components/home/retro-section'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedProducts />
      <RetroSection />
      <NewsletterSignup />
    </div>
  )
}