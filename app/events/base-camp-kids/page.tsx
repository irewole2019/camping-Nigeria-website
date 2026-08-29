import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/events/base-camp-kids/Hero'
import Schedule from '@/components/events/base-camp-kids/Schedule'
import Pricing from '@/components/events/base-camp-kids/Pricing'
import Faq from '@/components/events/base-camp-kids/Faq'
import RegistrationForm from '@/components/events/base-camp-kids/RegistrationForm'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  buildFaqJsonLd,
} from '@/lib/structured-data'
import {
  EVENT_TITLE,
  EVENT_TAGLINE,
  EVENT_DESCRIPTION,
  EVENT_START_ISO,
  EVENT_END_ISO,
  EVENT_PATH,
  EARLY_BIRD_PRICE,
  SEAT_CAP,
  MIN_AGE,
  MAX_AGE,
  VENUE_NAME,
  VENUE_CITY,
  VENUE_REGION,
  VENUE_COUNTRY,
  SOUVENIRS,
  FAQS,
  HERO_IMAGE,
  POSITIONING_IMAGE,
  POSITIONING_IMAGE_ALT,
  EVENT_DATE_LABEL,
  REGISTRATION_OPEN,
} from '@/lib/events/base-camp-kids'

export const metadata = buildPageMetadata({
  title: REGISTRATION_OPEN
    ? `${EVENT_TITLE} — Children's Day in Abuja | Camping Nigeria`
    : `${EVENT_TITLE} — Children's Day in Abuja, 2026 | Camping Nigeria`,
  description: REGISTRATION_OPEN
    ? "A camping-themed Children's Day at Durumi Recreational Park, Abuja, on Saturday 30 May 2026. Tents, house teams, outdoor games, and souvenirs for kids ages 6 to 12. Limited to 30 seats."
    : "How we ran Base Camp Kids — a camping-themed Children's Day at Durumi Recreational Park, Abuja, in May 2026. The full schedule, the souvenirs, and the safeguarding standards behind the day. Registration for this edition is closed.",
  path: EVENT_PATH,
  keywords: [
    "Children's Day Abuja",
    'kids camp Abuja',
    'Base Camp Kids',
    'kids activities Abuja',
    "Children's Day 2026",
    'family events Nigeria',
  ],
})

export default function BaseCampKidsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="base-camp-kids-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: EVENT_TITLE, path: EVENT_PATH },
        ])}
      />
      <JsonLd
        id="base-camp-kids-event-jsonld"
        data={buildEventJsonLd({
          name: `${EVENT_TITLE} — ${EVENT_TAGLINE}`,
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
          // Offer is dropped once the edition has run — quoting a live ticket
          // price against a date that has passed is misleading.
          ...(REGISTRATION_OPEN
            ? {
                offer: {
                  price: EARLY_BIRD_PRICE,
                  priceCurrency: 'NGN' as const,
                  availability: 'https://schema.org/LimitedAvailability' as const,
                },
              }
            : {}),
          maximumAttendeeCapacity: SEAT_CAP,
          audience: { suggestedMinAge: MIN_AGE, suggestedMaxAge: MAX_AGE },
          image: `${SITE_URL}${HERO_IMAGE}`,
        })}
      />
      <JsonLd
        id="base-camp-kids-faq-jsonld"
        data={buildFaqJsonLd(FAQS)}
      />

      <Navbar />
      <Hero />

      {/* Positioning — beyond the bouncing castle */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={POSITIONING_IMAGE}
              alt={POSITIONING_IMAGE_ALT}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
              Beyond the Bouncing Castle
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-6">
              A real camp adventure, scaled for small humans.
            </h2>
            <p className="font-sans text-base md:text-lg text-brand-dark/75 leading-relaxed">
              Most kids’ Children’s Day events end with face paint and a balloon. Base Camp Kids is
              built like a scaled-down version of our multi-day school camps — actual tents, actual
              house teams, real craft stations, real outdoor games. Kids leave with a T-shirt they
              made, a certificate, and the feeling of having done something. Parents leave knowing
              exactly who is watching their child and how.
            </p>
          </div>
        </div>
      </Section>

      {/* Souvenirs */}
      <Section className="bg-brand-dark-tint">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
              Every child takes home
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-4">
              Souvenirs they’ll remember
            </h2>
            <p className="font-sans text-base text-brand-dark/65 max-w-xl mx-auto">
              The hero items below — plus a few surprises we save for the day.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {SOUVENIRS.map((s) => (
              <li
                key={s.name}
                className="group rounded-2xl bg-white border border-brand-dark/5 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <p className="font-serif text-xl font-bold text-brand-dark">{s.name}</p>
                  <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-center font-sans text-sm text-brand-dark/55 mt-8 italic">
            Illustrative imagery. Photography from the day is being added.
          </p>
        </div>
      </Section>

      <Schedule />

      {/* Trust strip — staff ratios, first aid, schools delivered to */}
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
            <Trust label="Staff to child" value="1:8 / 1:10" hint="ages 6–8 / 9–12" />
            <Trust label="On-site" value="First aider" hint="branded vest, full kit" />
            <Trust label="Sign-out" value="Wristband match" hint="no code, no pickup" />
          </dl>

          <p className="font-sans text-sm text-white/65 leading-relaxed text-center mt-10 max-w-2xl mx-auto">
            Camping Nigeria has delivered programmes at Vivian Fowler, Regent Primary, Springhall
            Secondary, and Doveland. Same team, same standards, scaled for a one-day adventure.
          </p>
        </div>
      </Section>

      <Pricing />
      <Faq />

      {/* Registration — or, once the edition has run, where to go next.
          The form is not rendered when closed, so its client bundle never
          ships and there is no live control to submit. `/api/event-registration`
          refuses POSTs independently, for stale caches and bots. */}
      {REGISTRATION_OPEN ? (
        <Section id="register" className="bg-brand-light">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
                Reserve a Seat
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-4">
                Register your child{`(ren)`}
              </h2>
              <p className="font-sans text-base text-brand-dark/70 leading-relaxed">
                You’ll receive an invoice within 24 hours. Your seat is locked in once payment clears.
              </p>
            </div>

            <RegistrationForm />
          </div>
        </Section>
      ) : (
        <Section id="register" className="bg-brand-light">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
              Registration Closed
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight mt-3 mb-4">
              This edition ran on {EVENT_DATE_LABEL.replace('Saturday, ', '')}
            </h2>
            <p className="font-sans text-base text-brand-dark/70 leading-relaxed mb-9">
              We’re not taking registrations for it any more. If you want a day like this for your
              school, or you’d like to hear when the next one opens, start here.
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
          </div>
        </Section>
      )}

      <Footer />
    </main>
  )
}

function Trust({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="text-center">
      <dt className="text-brand-accent text-xs uppercase tracking-widest font-semibold mb-2">
        {label}
      </dt>
      <dd className="font-serif text-2xl md:text-3xl font-bold text-white mb-1">{value}</dd>
      <dd className="font-sans text-sm text-white/60">{hint}</dd>
    </div>
  )
}
