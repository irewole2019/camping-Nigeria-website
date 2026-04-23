import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import GearHero from '@/components/gear-rental/GearHero'
import EquipmentAndOptions from '@/components/gear-rental/EquipmentAndOptions'
import QuoteForm from '@/components/gear-rental/QuoteForm'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Gear Rental | Camping Nigeria',
  description:
    'Rent premium camping equipment for schools, individuals, and organizations. Tents, sleeping mats, cooking equipment and more.',
  path: '/gear-rental',
})

export default function GearRentalPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="gear-rental-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Gear Rental', path: '/gear-rental' },
        ])}
      />
      <Navbar />
      <GearHero />
      <EquipmentAndOptions />
      <QuoteForm />
      <Footer />
    </main>
  )
}
