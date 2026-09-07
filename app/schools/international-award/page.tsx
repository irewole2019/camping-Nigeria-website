import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import AwardHero from '@/components/schools/AwardHero'
import AwardExplainer from '@/components/schools/AwardExplainer'
import ExpeditionOverview from '@/components/schools/ExpeditionOverview'
import OurRole from '@/components/schools/OurRole'
import OfferShowcase from '@/components/offers/OfferShowcase'
import ExpeditionAssessment from '@/components/schools/international-award/ExpeditionAssessment'
import ExpeditionFaq from '@/components/schools/ExpeditionFaq'
import { AWARD_FAQS } from '@/lib/award-faq'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from '@/lib/structured-data'

const schoolOffers = getOfferGroup('schools')

export const metadata = buildPageMetadata({
  title: 'Duke of Edinburgh Expedition Support | Camping Nigeria',
  description:
    'Camping Nigeria supports schools running the Duke of Edinburgh Award in Nigeria. Equipment, facilitators, and structured outdoor programming for school expeditions.',
  path: '/schools/international-award',
})

export default function InternationalAwardPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="international-award-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          {
            name: 'Duke of Edinburgh Expedition Support',
            path: '/schools/international-award',
          },
        ])}
      />
      <JsonLd id="international-award-faq-jsonld" data={buildFaqJsonLd(AWARD_FAQS)} />
      <JsonLd
        id="international-award-service-jsonld"
        data={buildServiceJsonLd({
          name: 'Duke of Edinburgh Expedition Support',
          description:
            'Expedition equipment, facilitation, and end-to-end programme delivery for Nigerian schools running the Duke of Edinburgh Award, through the Field Day, Campus Expedition and Outdoor Year packages.',
          path: '/schools/international-award',
          serviceType: 'Duke of Edinburgh expedition support',
          // Derived from the offers catalogue so this page and /offers/schools
          // can never publish different prices for the same package.
          offers: schoolOffers.packages.map((pkg) => ({
            name: pkg.name,
            description: pkg.summary,
            price: pkg.priceFromValue,
            url: '/offers/schools',
          })),
        })}
      />
      <Navbar />

      <AwardHero />
      <AwardExplainer />
      <ExpeditionOverview />
      <OurRole />
      <OfferShowcase
        group={schoolOffers}
        eyebrow="How We Work With Schools"
        heading="Our School Offers"
        intro={schoolOffers.packagesIntro}
      />

      <ExpeditionAssessment />

      <ExpeditionFaq />

      <Footer />
    </main>
  )
}
