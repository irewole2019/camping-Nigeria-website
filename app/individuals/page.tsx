import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import IndividualsHero from '@/components/individuals/IndividualsHero'
import Expectations from '@/components/individuals/Expectations'
import ImageGallery from '@/components/individuals/ImageGallery'
import IndividualsCta from '@/components/individuals/IndividualsCta'

export const metadata = {
  title: 'Individuals | Camping Nigeria',
  description:
    'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
  openGraph: {
    title: 'Individuals | Camping Nigeria',
    description:
      'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
    url: '/individuals',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Individuals | Camping Nigeria',
    description:
      'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
  },
}

export default function IndividualsPage() {
  return (
    <main id="main-content">
      <Navbar />
      <IndividualsHero />
      <Expectations />
      <ImageGallery />
      <IndividualsCta />
      <Footer />
    </main>
  )
}
