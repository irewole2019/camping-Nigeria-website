import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import OffersHero from '@/components/offers/OffersHero'
import OfferGroupCards from '@/components/offers/OfferGroupCards'
import OfferTerms from '@/components/offers/OfferTerms'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Offers & Pricing | Camping Nigeria',
  description:
    'Published packages and prices for Camping Nigeria outdoor programmes — school field days and expeditions, corporate offsites, and open or private camps for individuals.',
  path: '/offers',
  keywords: [
    'camping packages Nigeria',
    'school camp pricing Nigeria',
    'corporate retreat packages Abuja',
    'outdoor programme prices Nigeria',
  ],
})

export default function OffersPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="offers-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Offers', path: '/offers' },
        ])}
      />
      <Navbar />
      <OffersHero />
      <OfferGroupCards />
      <OfferTerms />
      <Footer />
    </main>
  )
}
