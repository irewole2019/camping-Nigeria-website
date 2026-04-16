import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AwardHero from '@/components/schools/AwardHero'
import AwardExplainer from '@/components/schools/AwardExplainer'
import ExpeditionOverview from '@/components/schools/ExpeditionOverview'
import OurRole from '@/components/schools/OurRole'
import ExpeditionTiers from '@/components/schools/ExpeditionTiers'
import ExpeditionAssessment from '@/components/schools/international-award/ExpeditionAssessment'
import ExpeditionFaq from '@/components/schools/ExpeditionFaq'

export const metadata = {
  title: 'Duke of Edinburgh Expedition Support | Camping Nigeria',
  description:
    'Camping Nigeria supports schools running the Duke of Edinburgh Award in Nigeria. Equipment, facilitators, and structured outdoor programming for school expeditions.',
  openGraph: {
    title: 'Duke of Edinburgh Expedition Support | Camping Nigeria',
    description:
      'Camping Nigeria supports schools running the Duke of Edinburgh Award in Nigeria. Equipment, facilitators, and structured outdoor programming for school expeditions.',
    url: '/schools/international-award',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Duke of Edinburgh Expedition Support | Camping Nigeria',
    description:
      'Camping Nigeria supports schools running the Duke of Edinburgh Award in Nigeria. Equipment, facilitators, and structured outdoor programming for school expeditions.',
  },
}

export default function InternationalAwardPage() {
  return (
    <main id="main-content">
      <Navbar />

      <AwardHero />
      <AwardExplainer />
      <ExpeditionOverview />
      <OurRole />
      <ExpeditionTiers />

      <ExpeditionAssessment />

      <ExpeditionFaq />

      <Footer />
    </main>
  )
}
