import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/home/Hero'
import WhyOutdoorLearning from '@/components/home/WhyOutdoorLearning'
import DoECallout from '@/components/schools/DoECallout'
import OurSchoolPrograms from '@/components/home/OurSchoolPrograms'
import SafetySupervision from '@/components/home/SafetySupervision'
import MediaFeature from '@/components/home/MediaFeature'
import HowItWorks from '@/components/home/HowItWorks'
import SecondaryAudiences from '@/components/home/SecondaryAudiences'
import FinalCta from '@/components/home/FinalCta'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

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
      <OurSchoolPrograms />
      <SafetySupervision />
      <MediaFeature />
      <HowItWorks />
      <SecondaryAudiences />
      <FinalCta />
      <Footer />
    </main>
  )
}
