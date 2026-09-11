import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/events/kiddies-hike/Hero'
import Schedule from '@/components/events/kiddies-hike/Schedule'
import Faq from '@/components/events/kiddies-hike/Faq'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildEventJsonLd, buildFaqJsonLd } from '@/lib/structured-data'
import {
  CHILDREN_ATTENDED,
  COST_FORWARD_LOOKING,
  COST_INCLUSIONS,
  COST_NOTE,
  EVENT_DATE_LABEL,
  EVENT_DESCRIPTION,
  EVENT_END_ISO,
  EVENT_PATH,
  EVENT_START_ISO,
  EVENT_TITLE,
  FAQS,
  GALLERY,
  HAS_EVENT_PHOTOGRAPHY,
  HERO_IMAGE,
  MAX_AGE,
  MIN_AGE,
  POSITIONING_BODY,
  POSITIONING_STRAPLINE,
  POSITIONING_SUBHEAD,
  POSITIONING_TITLE,
  SAFETY,
  SAFETY_CREDENTIAL,
  SAFETY_DETAILS,
  SOUVENIRS,
  VENUE_CITY,
  VENUE_COUNTRY,
  VENUE_REGION,
} from '@/lib/events/kiddies-hike'

export const metadata = buildPageMetadata({
  title: 'Kiddies Hike and Fun Day, Abuja, 2026 | Camping Nigeria',
  description: EVENT_DESCRIPTION,
  path: EVENT_PATH,
  keywords: [
    'kids hike Abuja',
    'family hike Nigeria',
    'children outdoor event Abuja',
    'Kiddies Hike',
    'family events Abuja',
  ],
})

export default function KiddiesHikePage() {
  return (
    <main id="main-content">
      <JsonLd
        id="kiddies-hike-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: EVENT_TITLE, path: EVENT_PATH },
        ])}
      />
      <JsonLd
        id="kiddies-hike-event-jsonld"
        data={buildEventJsonLd({
          name: EVENT_TITLE,
          description: EVENT_DESCRIPTION,
          path: EVENT_PATH,
          startDate: EVENT_START_ISO,
          endDate: EVENT_END_ISO,
          location: {
            locality: VENUE_CITY,
            region: VENUE_REGION,
            country: VENUE_COUNTRY,
          },
          // No Offer at all — this edition was free, and it has already run.
          // An Offer priced at zero would read as an open free booking.
          maximumAttendeeCapacity: CHILDREN_ATTENDED,
          audience: { suggestedMinAge: MIN_AGE, suggestedMaxAge: MAX_AGE },
          image: `${SITE_URL}${HERO_IMAGE}`,
        })}
      />
      <JsonLd id="kiddies-hike-faq-jsonld" data={buildFaqJsonLd(FAQS)} />

      <Navbar />
      <Hero />

      {/* Positioning — not a stroll, a climb */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            {POSITIONING_SUBHEAD}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-6">
            {POSITIONING_TITLE}
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-dark/75 leading-relaxed text-pretty">
            {POSITIONING_BODY}
          </p>
          <p className="font-serif text-xl md:text-2xl font-bold text-brand-accent-readable mt-8">
            {POSITIONING_STRAPLINE}
          </p>
        </div>
      </Section>

      {/* Souvenirs — text-only cards; the real objects are in photos we do not have yet */}
      <Section className="bg-brand-dark-tint">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
              Souvenirs they kept
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-4">
              Every child took home
            </h2>
            <p className="font-sans text-base text-brand-dark/65 max-w-xl mx-auto">
              The hero items below, plus a few small surprises we save for the day.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOUVENIRS.map((s) => (
              <li
                key={s.name}
                className="rounded-2xl bg-white border border-brand-dark/5 p-6 flex flex-col gap-3 shadow-sm"
              >
                <p className="font-serif text-xl font-bold text-brand-dark leading-snug">{s.name}</p>
                <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
                  {s.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Schedule />

      {/* Gallery — rendered only once real photography lands. See
          GALLERY_MANIFEST in the source module for the nine selected frames. */}
      {GALLERY.length > 0 && (
        <Section className="bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
                Straight from the trail.
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3">
                The Day, in Pictures
              </h2>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {GALLERY.map((img) => (
                <li key={img.src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Safety — the section parents read hardest */}
      <Section className="bg-brand-dark text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent">
              Run by the Camping Nigeria team
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-balance leading-tight mt-3">
              Trained staff. Real ratios. Zero compromises.
            </h2>
          </div>

          <dl className="grid sm:grid-cols-3 gap-6 sm:gap-10">
            {SAFETY.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-brand-accent text-xs uppercase tracking-widest font-semibold mb-2">
                  {s.label}
                </dt>
                <dd className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">
                  {s.value}
                </dd>
                <dd className="font-sans text-sm text-white/60 leading-relaxed">{s.hint}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-3 max-w-3xl mx-auto">
            {SAFETY_DETAILS.map((detail) => (
              <li
                key={detail}
                className="relative pl-5 font-sans text-sm text-white/70 leading-relaxed"
              >
                <span
                  className="absolute left-0 top-[0.55em] w-[6px] h-[6px] bg-brand-accent"
                  aria-hidden="true"
                />
                {detail}
              </li>
            ))}
          </ul>

          <p className="font-sans text-sm text-white/65 leading-relaxed text-center mt-10 max-w-2xl mx-auto">
            {SAFETY_CREDENTIAL}
          </p>
        </div>
      </Section>

      {/* What a seat cost — collapses to one card, since this edition was free */}
      <Section className="bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            Nothing. This one was on us.
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-8">
            What a Seat Cost
          </h2>

          <div className="rounded-2xl bg-white border border-brand-accent/40 p-7 md:p-9 text-left shadow-sm">
            <p className="font-serif text-xl md:text-2xl font-bold text-brand-dark mb-5 text-balance">
              Free entry for every child and every adult
            </p>
            <ul className="space-y-2.5">
              {COST_INCLUSIONS.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 font-sans text-sm sm:text-base text-brand-dark/75 leading-relaxed"
                >
                  <span
                    className="absolute left-0 top-[0.55em] w-[7px] h-[7px] bg-brand-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-sans text-sm text-brand-dark/65 leading-relaxed mt-6">{COST_NOTE}</p>
          <p className="font-sans text-sm text-brand-dark/65 leading-relaxed mt-3">
            {COST_FORWARD_LOOKING}
          </p>
        </div>
      </Section>

      <Faq />

      {/* Closing — same structure and buttons as Base Camp Kids */}
      <Section className="bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            Registration Closed
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-4">
            This edition ran on {EVENT_DATE_LABEL.replace('Friday, ', '')}
          </h2>
          <p className="font-sans text-base text-brand-dark/70 leading-relaxed mb-9">
            We are not taking registrations for it any more. If you want a day like this for your
            school, or you would like to hear when the next one opens, start here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/schools/proposal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Bring This to Your School
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-brand-dark/25 text-brand-dark font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Tell Me About the Next One
            </Link>
          </div>

          {!HAS_EVENT_PHOTOGRAPHY && (
            <p className="font-sans text-xs text-brand-dark/45 italic mt-10">
              Photography from the day is being added.
            </p>
          )}
        </div>
      </Section>

      <Footer />
    </main>
  )
}
