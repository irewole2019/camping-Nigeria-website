import Navbar from '@/components/layout/Navbar'
import OrganizationsHero from '@/components/organizations/OrganizationsHero'
import WhatWeOffer from '@/components/organizations/WhatWeOffer'
import OrganizationsCta from '@/components/organizations/OrganizationsCta'

export const metadata = {
  title: 'Organizations | Camping Nigeria',
  description:
    'Structured outdoor team experiences for companies, NGOs, churches, and social groups — designed to foster meaningful connection and collaboration.',
}

export default function OrganizationsPage() {
  return (
    <main>
      <Navbar />
      <OrganizationsHero />
      <WhatWeOffer />
      <OrganizationsCta />
    </main>
  )
}
