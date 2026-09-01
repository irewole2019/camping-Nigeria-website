import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/home/Hero'
import WhyOutdoorLearning from '@/components/home/WhyOutdoorLearning'
import DoECallout from '@/components/schools/DoECallout'
import OfferShowcase from '@/components/offers/OfferShowcase'
import SafetySupervision from '@/components/home/SafetySupervision'
import MediaFeature from '@/components/home/MediaFeature'
import HowItWorks from '@/components/home/HowItWorks'
import SecondaryAudiences from '@/components/home/SecondaryAudiences'
import FinalCta from '@/components/home/FinalCta'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

const schoolOffers = getOfferGroup('schools')

/**
 * The programme sub-pages used to be reached from the "Structured for
 * Schools" card grid that this section replaced. Kept as links here so they
 * stay navigable and don't fall out of the internal link graph.
 */
const PROGRAMME_LINKS = [
  { label: 'Nature & Craft', href: '/schools/programs/nature-craft' },
  { label: 'Leadership Development', href: '/schools/programs/leadership-development' },
  { label: 'On-Campus Camps', href: '/schools/programs/on-campus-camps' },
]

export const metadata = buildPageMetadata({
  title: 'Schools | Camping Nigeria',
  description:
    'Outdoor education programmes designed for Nigerian schools — safe, structured, and transformative.',
  path: '/schools',
})

export default function SchoolsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="schools-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
        ])}
      />
      <Navbar />
      <Hero />
      <WhyOutdoorLearning />
      <DoECallout />
      <OfferShowcase
        group={schoolOffers}
        eyebrow="Structured for Schools"
        heading="Our School Offers"
        intro={schoolOffers.packagesIntro}
        footerLinks={PROGRAMME_LINKS}
      />
      <SafetySupervision />
      <MediaFeature />
      <HowItWorks />
      <SecondaryAudiences />
      <FinalCta />
      <Footer />
    </main>
  )
}
