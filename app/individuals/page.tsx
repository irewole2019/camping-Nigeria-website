import Navbar from '@/components/layout/Navbar'
import IndividualsHero from '@/components/individuals/IndividualsHero'
import Expectations from '@/components/individuals/Expectations'
import ImageGallery from '@/components/individuals/ImageGallery'
import IndividualsCta from '@/components/individuals/IndividualsCta'

export const metadata = {
  title: 'Individuals | Camping Nigeria',
  description:
    'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
}

export default function IndividualsPage() {
  return (
    <main>
      <Navbar />
      <IndividualsHero />
      <Expectations />
      <ImageGallery />
      <IndividualsCta />
    </main>
  )
}
