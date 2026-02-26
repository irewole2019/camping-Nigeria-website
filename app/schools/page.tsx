import Navbar from '@/components/layout/Navbar'
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
  description: 'Outdoor education programmes designed for Nigerian schools — safe, structured, and transformative.',
}

export default function SchoolsPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhyOutdoorLearning />
      <OurSchoolPrograms />
      <SafetySupervision />
      <MediaFeature />
      <HowItWorks />
      <SecondaryAudiences />
      <FinalCta />
    </main>
  )
}
