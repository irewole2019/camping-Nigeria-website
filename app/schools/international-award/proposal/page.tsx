import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import AwardProposalForm from '@/components/schools/international-award/AwardProposalForm'
import { buildPageMetadata } from '@/lib/seo'
import { DOE_ENABLED } from '@/lib/feature-flags'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

/** Metadata is gated too: otherwise the 404 still carries a DoE <title>. */
const HIDDEN_METADATA = {
  title: 'Not Found',
  robots: { index: false, follow: false },
}

export const metadata = DOE_ENABLED
  ? buildPageMetadata({
      title: 'Submit a Duke of Edinburgh Proposal Request | Camping Nigeria',
      description:
        'Tell us about your school or your child’s Duke of Edinburgh expedition. Bronze, Silver, and Gold tiers — equipment-only to fully managed. We respond within 48 hours.',
      path: '/schools/international-award/proposal',
    })
  : HIDDEN_METADATA

export default function AwardProposalPage() {
  // The whole DoE surface is temporarily hidden. See lib/feature-flags.ts.
  if (!DOE_ENABLED) notFound()

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
