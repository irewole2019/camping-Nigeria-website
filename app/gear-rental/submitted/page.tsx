import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Quote Request Received | Camping Nigeria',
  description: 'Thank you for your gear rental request. We will send your quote shortly.',
  path: '/gear-rental/submitted',
})

interface Props {
  searchParams: Promise<{ ref?: string; email?: string; name?: string }>
}

export default async function GearRentalSubmittedPage({ searchParams }: Props) {
  const sp = await searchParams
  const firstName = (sp.name || '').trim() || 'there'
  const reference = (sp.ref || '').trim()
  const email = (sp.email || '').trim()

  return (
    <main id="main-content">
      <JsonLd
        id="gear-rental-submitted-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Gear Rental', path: '/gear-rental' },
          { name: 'Quote Request Received', path: '/gear-rental/submitted' },
        ])}
      />
      <Navbar />
      <Section className="bg-brand-light min-h-[80dvh] flex items-center">
        <div className="max-w-2xl mx-auto text-center w-full py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-brand-accent-readable font-semibold text-sm uppercase tracking-widest mb-4">
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
            Quote Request Received
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark text-balance mb-4">
            Thank you, {firstName}.
          </h1>

          <p className="font-sans text-base md:text-lg text-brand-dark/70 leading-relaxed mb-10">
            We have received your gear rental request.
          </p>

          {reference && (
            <div className="rounded-2xl border-2 border-brand-accent bg-white px-6 py-6 mb-8 max-w-md mx-auto">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable mb-2">
                Your Reference
              </p>
              <p className="font-serif text-2xl md:text-3xl font-bold text-brand-dark tracking-wide">
                {reference}
              </p>
            </div>
          )}

          {email && (
            <p className="font-sans text-sm md:text-base text-brand-dark/70 mb-12">
              We will send your quote to{' '}
              <span className="font-semibold text-brand-dark">{email}</span> shortly.
            </p>
          )}

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide rounded-lg hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </Section>
      <Footer />
    </main>
  )
}
