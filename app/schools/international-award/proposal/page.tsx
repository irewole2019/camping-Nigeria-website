import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import AwardProposalForm from '@/components/schools/international-award/AwardProposalForm'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Submit a Duke of Edinburgh Proposal Request | Camping Nigeria',
  description:
    'Tell us about your school or your child’s Duke of Edinburgh expedition. Bronze, Silver, and Gold tiers — equipment-only to fully managed. We respond within 48 hours.',
  path: '/schools/international-award/proposal',
})

export default function AwardProposalPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="award-proposal-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          {
            name: 'Duke of Edinburgh Expedition Support',
            path: '/schools/international-award',
          },
          {
            name: 'Submit Proposal',
            path: '/schools/international-award/proposal',
          },
        ])}
      />
      <Navbar />
      {/* AwardProposalForm reads ?tier= via useSearchParams — Suspense boundary
          required by Next 16 for client components that read search params. */}
      <Suspense fallback={null}>
        <AwardProposalForm />
      </Suspense>
      <Footer />
    </main>
  )
}
