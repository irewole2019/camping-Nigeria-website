import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GearHero from '@/components/gear-rental/GearHero'
import EquipmentAndOptions from '@/components/gear-rental/EquipmentAndOptions'
import QuoteForm from '@/components/gear-rental/QuoteForm'

export const metadata = {
  title: 'Gear Rental | Camping Nigeria',
  description:
    'Rent premium camping equipment for schools, individuals, and organizations. Tents, sleeping mats, cooking equipment and more.',
  openGraph: {
    title: 'Gear Rental | Camping Nigeria',
    description:
      'Rent premium camping equipment for schools, individuals, and organizations. Tents, sleeping mats, cooking equipment and more.',
    url: '/gear-rental',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Gear Rental | Camping Nigeria',
    description:
      'Rent premium camping equipment for schools, individuals, and organizations. Tents, sleeping mats, cooking equipment and more.',
  },
}

export default function GearRentalPage() {
  return (
    <main id="main-content">
      <Navbar />
      <GearHero />
      <EquipmentAndOptions />
      <QuoteForm />
      <Footer />
    </main>
  )
}
