import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'
import { EVENT_TITLE, EVENT_PATH, formatNaira } from '@/lib/events/base-camp-kids'

export const metadata = buildPageMetadata({
  title: `Registration received | ${EVENT_TITLE} | Camping Nigeria`,
  description:
    'Thank you for registering for Base Camp Kids. Your invoice will arrive within 24 hours.',
  path: `${EVENT_PATH}/registered`,
})

interface Props {
  searchParams: Promise<{
    name?: string
    email?: string
    kids?: string
    total?: string
    ref?: string
  }>
}

export default async function RegisteredPage({ searchParams }: Props) {
  const sp = await searchParams
  const firstName = (sp.name || '').trim() || 'there'
  const email = (sp.email || '').trim()
  const kids = Number((sp.kids || '0').trim()) || 0
  const total = Number((sp.total || '0').trim()) || 0
  const reference = (sp.ref || '').trim()

  return (
    <main id="main-content">
      <JsonLd
        id="base-camp-kids-registered-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: EVENT_TITLE, path: EVENT_PATH },
          { name: 'Registration Received', path: `${EVENT_PATH}/registered` },
        ])}
      />
      <Navbar />

      <Section className="bg-brand-light min-h-[80dvh] flex items-center">
        <div className="max-w-2xl mx-auto text-center w-full py-16 md:py-24">
          <p className="inline-flex items-center gap-2 text-brand-accent-readable font-semibold text-sm uppercase tracking-widest mb-4">
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
            Registration Received
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark text-balance mb-4">
            Thank you, {firstName}.
          </h1>

          <p className="font-sans text-base md:text-lg text-brand-dark/70 leading-relaxed mb-10">
            Your seat{kids > 1 ? 's are' : ' is'} on hold. Here’s what happens next.
          </p>

          {(kids > 0 || total > 0 || reference) && (
            <div className="rounded-2xl border-2 border-brand-accent bg-white px-6 py-6 mb-10 max-w-md mx-auto">
              {reference && (
                <>
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable mb-1">
                    Your Reference
                  </p>
                  <p className="font-serif text-2xl font-bold text-brand-dark tracking-wide mb-4">
                    {reference}
                  </p>
                </>
              )}
              {kids > 0 && (
                <>
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable mb-1">
                    Children registered
                  </p>
                  <p className="font-serif text-xl font-bold text-brand-dark mb-4">
                    {kids} child{kids === 1 ? '' : 'ren'}
                  </p>
                </>
              )}
              {total > 0 && (
                <>
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable mb-1">
                    Total due (paid by invoice)
                  </p>
                  <p className="font-serif text-3xl font-bold text-brand-dark">
                    {formatNaira(total)}
                  </p>
                </>
              )}
            </div>
          )}

          <ol className="text-left space-y-5 mb-12 max-w-md mx-auto">
            <Step
              n={1}
              title="Invoice within 24 hours"
              body={`We'll email an invoice${email ? ` to ${email}` : ''} with payment instructions.`}
            />
            <Step
              n={2}
              title="Your seat locks in"
              body="Once payment clears, your seat is confirmed. We email a receipt and venue address."
            />
            <Step
              n={3}
              title="What to bring + house assignment"
              body="A week before the event, we send the packing list, drop-off plan, and your child's house."
            />
          </ol>

          <Link
            href={EVENT_PATH}
            className="inline-flex items-center justify-center px-7 py-3 bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide rounded-lg hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200"
          >
            Back to Base Camp Kids
          </Link>
        </div>
      </Section>

      <Footer />
    </main>
  )
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-dark text-brand-accent font-serif text-base font-bold">
        {n}
      </span>
      <div>
        <p className="font-serif text-lg font-bold text-brand-dark mb-0.5">{title}</p>
        <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">{body}</p>
      </div>
    </li>
  )
}
