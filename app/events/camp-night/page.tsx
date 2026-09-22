import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import SignupForm from '@/components/events/camp-night/SignupForm'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildEventJsonLd } from '@/lib/structured-data'
import {
  BRING,
  COMMUNITY_NAME,
  EVENT_DATE_LABEL,
  EVENT_DESCRIPTION,
  EVENT_END_ISO,
  EVENT_FULL_TITLE,
  EVENT_HOST,
  EVENT_PATH,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_START_ISO,
  EVENT_STRAPLINE,
  EVENT_TAGLINE,
  EVENT_TIME_SHORT,
  FLYER_IMAGE,
  FLYER_IMAGE_ALT,
  HERO_IMAGE,
  HERO_IMAGE_ALT,
  LOWEST_PRICE,
  MIN_AGE,
  PAYMENT_NOTE,
  PLEASE_NOTE,
  SIGNUP_OPEN,
  TENT_CAP,
  TENT_PACKAGES,
  VENUE_CITY,
  VENUE_COUNTRY,
  VENUE_LABEL,
  VENUE_MAP_URL,
  VENUE_NAME,
  VENUE_REGION,
  WE_PROVIDE,
  formatNaira,
} from '@/lib/events/camp-night'

export const metadata = buildPageMetadata({
  title: `${EVENT_FULL_TITLE} — ${EVENT_TAGLINE}, Abuja | Camping Nigeria`,
  description: EVENT_DESCRIPTION,
  path: EVENT_PATH,
  keywords: [
    'Camp Night Abuja',
    'camping Abuja',
    'outdoor night out Abuja',
    'bonfire party Abuja',
    'things to do in Abuja',
  ],
})

export default function CampNightPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="camp-night-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: EVENT_FULL_TITLE, path: EVENT_PATH },
        ])}
      />
      <JsonLd
        id="camp-night-event-jsonld"
        data={buildEventJsonLd({
          name: `${EVENT_FULL_TITLE} — ${EVENT_TAGLINE}`,
          description: EVENT_DESCRIPTION,
          path: EVENT_PATH,
          startDate: EVENT_START_ISO,
          endDate: EVENT_END_ISO,
          location: {
            name: VENUE_NAME,
            locality: VENUE_CITY,
            region: VENUE_REGION,
            country: VENUE_COUNTRY,
          },
          // Cheapest tent, as the advertised entry price. Dropped once the
          // night has run — quoting a live price against a past date misleads.
          ...(SIGNUP_OPEN
            ? {
                offer: {
                  price: LOWEST_PRICE,
                  priceCurrency: 'NGN' as const,
                  availability: 'https://schema.org/LimitedAvailability' as const,
                },
              }
            : {}),
          // No maximumAttendeeCapacity: the cap is 50 *tents*, and that field
          // counts people. A couple tent holds two, so the two numbers differ.
          audience: { suggestedMinAge: MIN_AGE },
          image: `${SITE_URL}${HERO_IMAGE}`,
        })}
      />

      <Navbar />

      {/* Hero */}
      <section className="relative isolate bg-brand-dark" aria-labelledby="camp-night-hero">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-dark/75" aria-hidden="true" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 md:pb-28 md:pt-44 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-6 inline-flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent sm:text-sm">
              <span className="block h-px w-10 bg-brand-accent" aria-hidden="true" />
              {EVENT_STRAPLINE}
            </p>

            <h1
              id="camp-night-hero"
              className="font-serif text-5xl font-bold leading-[1.02] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl"
            >
              September <span className="text-brand-accent">Camp Night</span>
            </h1>

            <p className="mt-5 font-serif text-xl italic leading-snug text-white/85">
              {EVENT_TAGLINE}. Hosted by {EVENT_HOST}.
            </p>

            {/* African Dream Community is ours, not a third-party partner —
                credited on the hero at the founders' request. */}
            <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/25 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white/80 sm:text-[13px]">
              Camping Nigeria
              <span className="text-brand-accent" aria-hidden="true">
                &middot;
              </span>
              <span className="text-brand-accent">{COMMUNITY_NAME}</span>
            </p>

            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
              One night under canvas, with the city behind you and a bonfire in front of you. We
              pitch the tents and put a mattress in each one. You bring a bedsheet and a hoodie.
              Three DJs, karaoke, movies on the big screen, and games until the fire burns down.
            </p>

            <dl className="mt-10 flex flex-wrap items-stretch gap-y-4 divide-x divide-white/20 border-y border-white/20 py-5">
              <Spec first label="When" value={EVENT_DATE_LABEL.replace('Saturday, ', 'Sat 26 Sep')} />
              <Spec label="Time" value={EVENT_TIME_SHORT} />
              <Spec label="Where" value={VENUE_CITY} />
              <Spec label="From" value={formatNaira(LOWEST_PRICE)} />
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-7 py-4 font-sans text-base font-semibold tracking-wide text-brand-dark transition-transform duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Save my spot
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <a
                href={VENUE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-7 py-4 font-sans text-base font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-white hover:text-brand-dark"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
                See the venue
              </a>
            </div>

            <p className="mt-8 font-sans text-xs leading-relaxed text-white/55 sm:text-sm">
              {TENT_CAP} tents only. Adults {MIN_AGE}+. {VENUE_LABEL}.
              <br className="hidden sm:block" />
              <span className="mt-1 block sm:mt-2">
                Enquiries and bookings:{' '}
                <a
                  href={EVENT_PHONE_TEL}
                  className="font-semibold text-brand-accent underline-offset-4 hover:underline"
                >
                  {EVENT_PHONE_DISPLAY}
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Tent packages */}
      <Section id="tents" className="bg-brand-light">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
              Pick your tent
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-dark text-balance md:text-4xl">
              Three ways to sleep
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-dark/70">
              Every tent comes pitched, with a mattress in it, before you arrive. The only
              difference is how much of it is yours.
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-3">
            {TENT_PACKAGES.map((pkg) => (
              <li
                key={pkg.id}
                className="flex flex-col rounded-2xl border border-brand-dark/10 bg-white p-7 shadow-sm"
              >
                <p className="font-serif text-2xl font-bold text-brand-dark">{pkg.name}</p>
                <p className="mt-2 font-sans text-3xl font-bold tabular-nums text-brand-dark">
                  {formatNaira(pkg.price)}
                </p>
                <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-brand-dark/65">
                  {pkg.detail}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-sans text-sm leading-relaxed text-brand-dark/60">
            Tents are paid for before you sign up — call{' '}
            <a
              href={EVENT_PHONE_TEL}
              className="font-semibold text-brand-accent-readable underline-offset-4 hover:underline"
            >
              {EVENT_PHONE_DISPLAY}
            </a>{' '}
            to pay, then fill in the form below to get your camp code. Nothing to pay on the night.
          </p>
        </div>
      </Section>

      {/* What is provided / what to bring */}
      <Section className="bg-white">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
              On us
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-brand-dark md:text-3xl">
              We are providing
            </h2>
            <ul className="mt-6 space-y-3">
              {WE_PROVIDE.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
              On you
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-brand-dark md:text-3xl">
              You should come with
            </h2>
            <ul className="mt-6 space-y-3">
              {BRING.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl rounded-2xl border border-brand-dark/10 bg-brand-dark-tint p-7 md:p-9">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-dark/60">
            Please note
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-x-10">
            {PLEASE_NOTE.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </div>
      </Section>

      {/* Sign-up */}
      <Section id="signup" className="bg-brand-light">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
              {SIGNUP_OPEN ? `${TENT_CAP} tents only` : 'Sign-ups closed'}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-dark text-balance md:text-4xl">
              {SIGNUP_OPEN ? 'Save your spot' : 'This night has passed'}
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-dark/70">
              {SIGNUP_OPEN
                ? `Fill this in and your camp code lands in your inbox straight away, with everything to bring on the night. Adults ${MIN_AGE} and over.`
                : 'Camp Night ran on 26 September 2026. Tell us you want in on the next one.'}
            </p>

            {SIGNUP_OPEN && (
              <div className="mx-auto mt-6 max-w-xl rounded-xl border border-brand-accent/40 bg-brand-accent-tint px-5 py-4">
                <p className="font-sans text-sm font-semibold text-brand-dark">Pay first, then sign up</p>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-brand-dark/70">
                  {PAYMENT_NOTE} To pay, call{' '}
                  <a
                    href={EVENT_PHONE_TEL}
                    className="font-semibold text-brand-accent-readable underline-offset-4 hover:underline"
                  >
                    {EVENT_PHONE_DISPLAY}
                  </a>
                  .
                </p>
              </div>
            )}
          </div>

          {SIGNUP_OPEN ? (
            <SignupForm />
          ) : (
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-dark px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark"
              >
                Tell me about the next one
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </Section>

      {/* The flyer, so the page and the DM match */}
      <Section className="bg-white">
        <div className="mx-auto max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-brand-dark/10 shadow-sm">
            <Image
              src={FLYER_IMAGE}
              alt={FLYER_IMAGE_ALT}
              width={864}
              height={1080}
              sizes="(max-width: 640px) 100vw, 384px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  )
}

function Spec({ label, value, first = false }: { label: string; value: string; first?: boolean }) {
  return (
    <div className={first ? 'pr-5 sm:pr-6' : 'px-5 sm:px-6'}>
      <dt className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
        {label}
      </dt>
      <dd className="whitespace-nowrap font-serif text-base font-bold text-white sm:text-lg">
        {value}
      </dd>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-5 font-sans text-[15px] leading-relaxed text-brand-dark/75">
      <span
        className="absolute left-0 top-[0.55em] h-[7px] w-[7px] bg-brand-accent"
        aria-hidden="true"
      />
      {children}
    </li>
  )
}
