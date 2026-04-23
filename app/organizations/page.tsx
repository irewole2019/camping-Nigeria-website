import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import OrganizationsHero from '@/components/organizations/OrganizationsHero'
import WhatWeOffer from '@/components/organizations/WhatWeOffer'
import OrganizationsCta from '@/components/organizations/OrganizationsCta'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Organizations | Camping Nigeria',
  description:
    'Structured outdoor team experiences for companies, NGOs, churches, and social groups — designed to foster meaningful connection and collaboration.',
  path: '/organizations',
})

export default function OrganizationsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="organizations-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Organizations', path: '/organizations' },
        ])}
      />
      <Navbar />
      <OrganizationsHero />
      <WhatWeOffer />
      <OrganizationsCta />
      <Footer />
    </main>
  )
}
