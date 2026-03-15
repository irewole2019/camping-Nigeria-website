import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProposalForm from '@/components/proposal/ProposalForm'

export const metadata = {
  title: 'Request a School Proposal | Camping Nigeria',
  description:
    'Answer a few questions and we\'ll recommend the perfect outdoor programme for your school — then send you a tailored proposal.',
  openGraph: {
    title: 'Request a School Proposal | Camping Nigeria',
    description:
      'Answer a few questions and we\'ll recommend the perfect outdoor programme for your school.',
    url: '/schools/proposal',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Request a School Proposal | Camping Nigeria',
    description:
      'Answer a few questions and we\'ll recommend the perfect outdoor programme for your school.',
  },
}

export default function ProposalPage() {
  return (
    <main id="main-content">
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
