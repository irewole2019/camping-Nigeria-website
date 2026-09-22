import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'
import { isValidSignupCode } from '@/lib/events/camp-night-records'
import {
  BRING,
  EVENT_DATE_LABEL,
  EVENT_FULL_TITLE,
  EVENT_PATH,
  EVENT_TIME_LABEL,
  REGISTERED_PATH,
  VENUE_LABEL,
  VENUE_MAP_URL,
  getTentPackage,
  isValidPackageId,
} from '@/lib/events/camp-night'

export const metadata = buildPageMetadata({
  title: `You are in — ${EVENT_FULL_TITLE} | Camping Nigeria`,
  description: 'Your Camp Night sign-up is in. Here is your camp code and what to bring.',
  path: REGISTERED_PATH,
})

/**
 * Reads the code back from the URL rather than the database, so the page is
 * static and needs no lookup. The email is the durable copy; this is the
 * "it worked" moment immediately after submitting.
 *
 * Everything here is validated before it renders: an invented `?code=` that
 * does not match the SCN shape is not echoed back, so this page cannot be
 * used to make a screenshot of a code we never issued.
 */
export default async function CampNightRegisteredPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; name?: string; package?: string }>
}) {
  const params = await searchParams

  const code = isValidSignupCode(params.code) ? params.code : null
  const firstName = (params.name || '').trim().split(' ')[0]
  const pkg = isValidPackageId(params.package) ? getTentPackage(params.package) : null

  return (
    <main id="main-content">
      <JsonLd
        id="camp-night-registered-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: EVENT_FULL_TITLE, path: EVENT_PATH },
          { name: 'You are in', path: REGISTERED_PATH },
        ])}
      />

      <Navbar />

      <Section className="bg-brand-light pt-32 md:pt-40">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
              Sign-up received
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-brand-dark text-balance md:text-5xl">
              {firstName ? `You are in, ${firstName}` : 'You are in'}
            </h1>
          </div>

          {code ? (
            <div className="mt-10 overflow-hidden rounded-2xl border-2 border-brand-accent bg-brand-accent-tint">
              <div className="px-6 py-8 text-center">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-readable">
                  Your camp code
                </p>
                <p className="mt-3 font-mono text-4xl font-bold tracking-[0.2em] text-brand-dark sm:text-5xl">
                  {code}
                </p>
                <p className="mt-3 font-sans text-sm text-brand-dark/65">
                  Keep this. It is how we find you at the gate.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center font-sans text-sm text-amber-900">
              Your sign-up went through, but we could not show your code here. Check your email — it
              is in there. If nothing arrives, email hello@campingnigeria.com.
            </p>
          )}

          <dl className="mt-8 divide-y divide-brand-dark/10 overflow-hidden rounded-2xl border border-brand-dark/10 bg-white">
            {pkg && <Row label="Tent" value={pkg.label} />}
            <Row label="When" value={`${EVENT_DATE_LABEL}, ${EVENT_TIME_LABEL}`} />
            <Row
              label="Where"
              value={
                <>
                  {VENUE_LABEL}
                  <br />
                  <a
                    href={VENUE_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 font-semibold text-brand-accent-readable hover:underline"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Open in Google Maps
                  </a>
                </>
              }
            />
          </dl>

          <div className="mt-10">
            <h2 className="font-serif text-xl font-bold text-brand-dark">Bring this</h2>
            <ul className="mt-4 space-y-2.5">
              {BRING.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 font-sans text-[15px] leading-relaxed text-brand-dark/75"
                >
                  <span
                    className="absolute left-0 top-[0.55em] h-[7px] w-[7px] bg-brand-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-sans text-sm text-brand-dark/55">
              The full list, including what we are providing, is in your email.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href={EVENT_PATH}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-dark px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark"
            >
              Back to Camp Night
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-brand-dark/25 px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-brand-dark transition-colors duration-200 hover:border-brand-dark hover:bg-brand-dark hover:text-white"
            >
              Ask us something
            </Link>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-4 px-5 py-4 sm:grid-cols-[110px_1fr] sm:px-6">
      <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45">
        {label}
      </dt>
      <dd className="font-sans text-sm leading-relaxed text-brand-dark/85">{value}</dd>
    </div>
  )
}
