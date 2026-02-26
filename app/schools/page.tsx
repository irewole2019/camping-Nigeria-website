import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import WhyOutdoorLearning from '@/components/home/WhyOutdoorLearning'
import OurSchoolPrograms from '@/components/home/OurSchoolPrograms'
import SafetySupervision from '@/components/home/SafetySupervision'
import MediaFeature from '@/components/home/MediaFeature'
import HowItWorks from '@/components/home/HowItWorks'
import SecondaryAudiences from '@/components/home/SecondaryAudiences'
import FinalCta from '@/components/home/FinalCta'

export const metadata = {
  title: 'Schools | Camping Nigeria',
  description:
    'Outdoor education programmes designed for Nigerian schools — safe, structured, and transformative.',
  openGraph: {
    title: 'Schools | Camping Nigeria',
    description:
      'Outdoor education programmes designed for Nigerian schools — safe, structured, and transformative.',
    url: '/schools',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Schools | Camping Nigeria',
    description:
      'Outdoor education programmes designed for Nigerian schools — safe, structured, and transformative.',
  },
}

export default function SchoolsPage() {
  return (
    <main id="main-content">
      <Navbar />
      <Hero />
      <WhyOutdoorLearning />
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
