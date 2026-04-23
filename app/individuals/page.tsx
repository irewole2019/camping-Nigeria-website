import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import IndividualsHero from '@/components/individuals/IndividualsHero'
import Expectations from '@/components/individuals/Expectations'
import ImageGallery from '@/components/individuals/ImageGallery'
import IndividualsCta from '@/components/individuals/IndividualsCta'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Individuals | Camping Nigeria',
  description:
    'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
  path: '/individuals',
})

export default function IndividualsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="individuals-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Individuals', path: '/individuals' },
        ])}
      />
      <Navbar />
      <IndividualsHero />
      <Expectations />
      <ImageGallery />
      <IndividualsCta />
      <Footer />
    </main>
  )
}
