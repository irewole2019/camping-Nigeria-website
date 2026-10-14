import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Instagram, MessageCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Section from '@/components/ui/Section'
import JsonLd from '@/components/seo/JsonLd'
import CommunityHero from '@/components/community/CommunityHero'
import EventGallery from '@/components/community/EventGallery'
import OfferShowcase from '@/components/offers/OfferShowcase'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'
import {
  ATTEND_STEPS,
  COMMUNITY_FACEBOOK_NAME,
  COMMUNITY_HANDLE,
  COMMUNITY_LINKS,
  COMMUNITY_WHATSAPP_DISPLAY,
  COMMUNITY_WHATSAPP_URL,
  EQUIPPED_BY,
  JOIN_URL,
  MOMENTS,
  PHOTOS,
  WHAT_WE_DO,
  WHO_WE_ARE,
  WHY_PEOPLE_RETURN,
  type CommunityPhoto,
} from '@/lib/community'

const communityOffers = getOfferGroup('community')

export const metadata = buildPageMetadata({
  title: 'The African Dream Community | Camping Nigeria',
  description:
    'A free community for people who want more from their weekends: meet new people, make real friends and step outside the city together, with ticketed camp nights, trips and retreats around Abuja.',
  path: '/community',
  keywords: [
    'African Dream Community',
    'community events Abuja',
    'camp night Abuja',
    'weekend camping Abuja',
    'meet new people Abuja',
  ],
})

export default function CommunityPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="community-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Community', path: '/community' },
        ])}
      />
      <Navbar />
      <CommunityHero />

      {/* Who we are */}
      <Section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <Heading eyebrow="Who we are" title="Unity in shared experience" />
            <div className="mt-6 space-y-4">
              {WHO_WE_ARE.map((p) => (
                <p key={p} className="font-sans text-base leading-relaxed text-brand-dark/75 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <Photo photo={PHOTOS.whoWeAre} className="aspect-[4/3]" />
        </div>
      </Section>

      {/* What we do */}
      <Section className="bg-brand-dark">
        <div className="mx-auto max-w-6xl">
          <Heading eyebrow="What we do" title="Something new every time" light />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {WHAT_WE_DO.map((item, i) => (
                <li key={item.title} className="border-t border-white/15 pt-5">
                  <p className="font-sans text-xs font-semibold tracking-widest text-brand-accent">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 font-sans text-[15px] leading-relaxed text-white/70">{item.body}</p>
                </li>
              ))}
            </ol>
            <Photo photo={PHOTOS.whatWeDo} className="aspect-[4/5] lg:aspect-auto lg:h-full" />
          </div>
        </div>
      </Section>

      {/* Past events gallery */}
      <EventGallery />

      {/* Equipped by Camping Nigeria */}
      <Section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <Photo photo={PHOTOS.equipped} className="order-2 aspect-[4/3] md:order-1" />
          <div className="order-1 md:order-2">
            <Heading eyebrow="Equipped by Camping Nigeria" title="The community brings the people" />
            <div className="mt-6 space-y-4">
              {EQUIPPED_BY.map((p) => (
                <p key={p} className="font-sans text-base leading-relaxed text-brand-dark/75 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Why people keep coming back */}
      <Section className="bg-brand-dark-tint">
        <div className="mx-auto max-w-6xl">
          <Heading eyebrow="Why people keep coming back" title="Nobody is an outsider here" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_PEOPLE_RETURN.map((r) => (
              <li key={r.title} className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-brand-dark">{r.title}</h3>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-brand-dark/70">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Moments */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <Heading eyebrow="Life in the community" title="Moments from our gatherings" />
          <div className="mt-10">
            <Photo photo={PHOTOS.group} className="aspect-[16/9] md:aspect-[21/9]" sizes="100vw" />
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {MOMENTS.map((p) => (
              <li key={p.src}>
                <Photo photo={p} className="aspect-square" sizes="(max-width: 768px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Camping Nigeria's own published camps, for members who want to go
          further. Kept from the old /individuals page — the offers group was
          renamed with it. */}
      <OfferShowcase
        group={communityOffers}
        heading="Camp With Us"
        intro={communityOffers.packagesIntro}
        className="bg-brand-light"
      />

      {/* How to get involved */}
      <Section className="bg-white">
        <div className="mx-auto max-w-6xl">
          <Heading eyebrow="How to get involved" title="Join for free, or come along to an event" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-brand-dark/10 bg-brand-light p-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable">
                No cost
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-brand-dark">Join the community</h3>
              <p className="mt-3 flex-1 font-sans text-[15px] leading-relaxed text-brand-dark/70">
                Follow us on Instagram, TikTok and Facebook to meet other members and hear about
                what&apos;s coming up.
              </p>
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-brand-dark px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                Join on Instagram
              </a>
            </div>

            <div className="flex flex-col rounded-2xl border border-brand-dark/10 bg-brand-light p-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable">
                Ticketed
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-brand-dark">Attend an event</h3>
              <ol className="mt-4 flex-1 space-y-3">
                {ATTEND_STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 font-sans text-[15px] leading-relaxed text-brand-dark/75">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent font-sans text-xs font-bold text-brand-dark">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link
                href="/events"
                className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-lg border border-brand-dark/25 px-6 py-3.5 font-sans text-sm font-semibold tracking-wide text-brand-dark transition-colors duration-200 hover:border-brand-dark hover:bg-brand-dark hover:text-white"
              >
                See Upcoming Events
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Get in touch */}
      <Section className="bg-brand-dark">
        <div className="mx-auto max-w-4xl text-center">
          <Heading eyebrow="Get in touch" title="Say hello" light center />
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            <li>
              <ContactCard label="WhatsApp" href={COMMUNITY_WHATSAPP_URL} icon={<MessageCircle className="h-5 w-5" />}>
                {COMMUNITY_WHATSAPP_DISPLAY}
              </ContactCard>
            </li>
            <li>
              <ContactCard label="Instagram · TikTok · X" href={COMMUNITY_LINKS.instagram} icon={<Instagram className="h-5 w-5" />}>
                {COMMUNITY_HANDLE}
              </ContactCard>
            </li>
            <li>
              {/* No URL was given for the Facebook page, so it is text, not a link. */}
              <ContactCard label="Facebook">{COMMUNITY_FACEBOOK_NAME}</ContactCard>
            </li>
          </ul>
          <p className="mt-8 font-sans text-sm text-white/55">
            Also on{' '}
            <a href={COMMUNITY_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-accent underline-offset-4 hover:underline">
              TikTok
            </a>{' '}
            and{' '}
            <a href={COMMUNITY_LINKS.x} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-accent underline-offset-4 hover:underline">
              X
            </a>
            .
          </p>
        </div>
      </Section>

      <Footer />
    </main>
  )
}

function Heading({
  eyebrow,
  title,
  light = false,
  center = false,
}: {
  eyebrow: string
  title: string
  light?: boolean
  center?: boolean
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p
        className={`mb-3 font-sans text-sm font-semibold uppercase tracking-widest ${
          light ? 'text-brand-accent' : 'text-brand-accent-readable'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-serif text-3xl font-bold text-balance md:text-4xl ${
          light ? 'text-white' : 'text-brand-dark'
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-4 h-1 w-12 rounded-full bg-brand-accent ${center ? 'mx-auto' : ''}`}
        aria-hidden="true"
      />
    </div>
  )
}

function Photo({
  photo,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  photo: CommunityPhoto
  className?: string
  sizes?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-brand-dark/10 ${className ?? ''}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}

function ContactCard({
  label,
  href,
  icon,
  children,
}: {
  label: string
  href?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  const body = (
    <>
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">{label}</span>
      <span className="mt-2 inline-flex items-center justify-center gap-2 font-serif text-lg font-bold text-white">
        {icon && <span className="text-brand-accent" aria-hidden="true">{icon}</span>}
        {children}
      </span>
    </>
  )
  const cls =
    'flex h-full flex-col items-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-6'
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} transition-colors duration-200 hover:border-brand-accent/60 hover:bg-white/[0.08]`}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}
