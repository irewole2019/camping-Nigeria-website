import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/events/camp-night/Hero'
import SignupForm from '@/components/events/camp-night/SignupForm'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildEventJsonLd } from '@/lib/structured-data'
import {
  BRING,
  EVENT_DESCRIPTION,
  EVENT_END_ISO,
  EVENT_FULL_TITLE,
  EVENT_PATH,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_START_ISO,
  EVENT_TAGLINE,
  FLYER_IMAGE,
  FLYER_IMAGE_ALT,
  HERO_IMAGE,
  LOWEST_PRICE,
  MIN_AGE,
  PAYMENT_NOTE,
  PLEASE_NOTE,
  SIGNUP_OPEN,
  TENT_CAP,
  TENT_PACKAGES,
  VENUE_CITY,
  VENUE_COUNTRY,
  VENUE_PUBLIC_LABEL,
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
          // City-level only, deliberately. This is the most public surface of
          // the lot — Google indexes it and shows it in event rich results —
          // so naming the venue here would undo the whole point. The builder
          // falls back to "Abuja, NG" when `name` is omitted.
          location: {
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

      <Hero />

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
            <p className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-brand-dark/60">
              <MapPin className="h-4 w-4 shrink-0 text-brand-accent-readable" aria-hidden="true" />
              A private garden venue in {VENUE_PUBLIC_LABEL}. The address and map link go out to
              everyone who signs up.
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
