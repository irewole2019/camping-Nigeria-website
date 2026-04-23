import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProposalForm from '@/components/proposal/ProposalForm'
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Request a School Proposal | Camping Nigeria',
  description:
    "Answer a few questions and we'll recommend the perfect outdoor programme for your school — then send you a tailored proposal.",
  path: '/schools/proposal',
})

export default function ProposalPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="proposal-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          { name: 'Request a School Proposal', path: '/schools/proposal' },
        ])}
      />
      <Navbar />
      <section className="min-h-screen pt-32 pb-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProposalForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
