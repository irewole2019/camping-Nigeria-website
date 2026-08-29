import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import { cn } from '@/lib/utils'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'
import { UPCOMING_EVENTS, PAST_EVENTS, type EventSummary } from '@/lib/events'

export const metadata = buildPageMetadata({
  title: 'Events | Camping Nigeria',
  description:
    'One-day camps, holiday activations, and Children’s Day adventures run by Camping Nigeria in Abuja — what is coming up, and recaps of the editions we have already run.',
  path: '/events',
  keywords: [
    'kids camp Abuja',
    'holiday camp Nigeria',
    "Children's Day Abuja",
    'family events Abuja',
    'outdoor events Nigeria',
  ],
})

export default function EventsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="events-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ])}
      />

      <Navbar />

      {/* Header */}
      <Section className="bg-brand-dark text-white">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-brand-accent font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-6">
            <span className="block w-10 h-px bg-brand-accent" aria-hidden="true" />
            Events
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            One-day camps and holiday activations
          </h1>
          <p className="font-sans text-base md:text-lg text-white/75 leading-relaxed">
            Alongside our school programmes, we run standalone camps the public can book into —
            Children’s Day adventures, holiday camps, and family days out in and around Abuja.
            What’s open is below, and every edition we’ve run keeps its page.
          </p>
        </div>
      </Section>

      {/* Upcoming */}
      <Section className="bg-brand-light">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Upcoming"
            title={
              UPCOMING_EVENTS.length > 0 ? 'Open for registration' : 'Nothing on the calendar yet'
            }
          />

          {UPCOMING_EVENTS.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {UPCOMING_EVENTS.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-brand-dark/10 bg-white px-6 py-10 md:px-10 md:py-12 text-center max-w-2xl mx-auto">
              <p className="font-sans text-base md:text-lg text-brand-dark/75 leading-relaxed mb-8">
                We’re not taking public registrations at the moment. New dates go out by email and
                on Instagram first — or we can run a private edition for your school or community
                group whenever suits you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                >
                  Tell Me About the Next One
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/schools/proposal"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-brand-dark/25 text-brand-dark font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                >
                  Request a Private Edition
                </Link>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Past */}
      {PAST_EVENTS.length > 0 && (
        <Section className="bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Past Editions"
              title="What we’ve already run"
              lead="Every event keeps its page — the schedule, the standards we hold, and what the children took home."
            />

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {PAST_EVENTS.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Footer />
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: string
  lead?: string
}) {
  return (
    <div className="mb-10 md:mb-12">
      <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3">
        {title}
      </h2>
      {lead && (
        <p className="font-sans text-base text-brand-dark/65 leading-relaxed mt-4 max-w-2xl">
          {lead}
        </p>
      )}
    </div>
  )
}

function EventCard({ event }: { event: EventSummary }) {
  const isPast = event.status === 'past'

  return (
    <li className="group rounded-2xl border border-brand-dark/10 bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link
        href={event.path}
        className="flex flex-col h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-light">
          <Image
            src={event.image}
            alt={event.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-[1.03]',
              isPast && 'saturate-[0.85]',
            )}
          />
          <span
            className={cn(
              'absolute top-4 left-4 inline-flex items-center font-sans text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full',
              isPast
                ? 'bg-white/90 backdrop-blur-sm text-brand-dark'
                : 'bg-brand-dark text-brand-accent',
            )}
          >
            {!isPast && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent mr-2 animate-pulse"
                aria-hidden="true"
              />
            )}
            {isPast ? 'Ended' : 'Now Booking'}
          </span>
        </div>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          <h3 className="font-serif text-2xl font-bold text-brand-dark">{event.title}</h3>
          <p className="font-serif italic text-sm text-brand-dark/70 mt-1 mb-4">{event.tagline}</p>

          <p className="font-sans text-sm text-brand-dark/70 leading-relaxed mb-6">{event.blurb}</p>

          <dl className="grid gap-2 mb-6 mt-auto">
            <Meta
              icon={<CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />}
              label="Date"
              value={event.dateLabel}
            />
            <Meta
              icon={<MapPin className="w-3.5 h-3.5" aria-hidden="true" />}
              label="Venue"
              value={event.venueLabel}
            />
            <Meta
              icon={<Users className="w-3.5 h-3.5" aria-hidden="true" />}
              label="Who for"
              value={event.ageRange}
            />
          </dl>

          <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark group-hover:text-brand-accent-readable transition-colors duration-200">
            {isPast ? 'See how the day ran' : 'See the full day'}
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </li>
  )
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="flex items-center gap-1.5 text-brand-accent-readable text-[11px] uppercase tracking-widest font-semibold shrink-0">
        {icon}
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="font-sans text-sm text-brand-dark/75">{value}</dd>
    </div>
  )
}
