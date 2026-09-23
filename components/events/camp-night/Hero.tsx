'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import {
  COMMUNITY_NAME,
  DATE_STAMP,
  EVENT_DESCRIPTION,
  EVENT_HOST,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_STRAPLINE,
  EVENT_TAGLINE,
  EVENT_TIME_SHORT,
  HERO_IMAGE,
  HERO_IMAGE_ALT,
  LOWEST_PRICE,
  MIN_AGE,
  SIGNUP_OPEN,
  TENT_CAP,
  VENUE_PUBLIC_LABEL,
  formatNaira,
} from '@/lib/events/camp-night'

const HEADING_ID = 'camp-night-hero'

/**
 * Mirrors `components/events/base-camp-kids/Hero.tsx` — split grid, masked H1
 * reveal, magazine spec strip, passport date stamp and status pill — so the
 * two event pages read as one family. Content differs; structure does not.
 */
export default function Hero() {
  return (
    <section className="relative isolate bg-brand-light" aria-labelledby={HEADING_ID}>
      <div className="grid lg:min-h-[90dvh] lg:grid-cols-[1fr_1.05fr]">
        {/* Left — content */}
        <div className="relative order-2 flex items-center px-4 pb-16 pt-12 sm:px-6 lg:order-1 lg:px-12 lg:py-24 xl:px-16">
          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto lg:mr-12 xl:mr-20">
            <motion.p
              className="mb-7 inline-flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-readable sm:text-sm lg:mb-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
            >
              <span className="block h-px w-10 bg-brand-accent" aria-hidden="true" />
              {EVENT_STRAPLINE}
            </motion.p>

            <div className="mb-6 overflow-hidden">
              <motion.h1
                id={HEADING_ID}
                className="font-serif text-[3.25rem] font-bold leading-[1] tracking-tight text-brand-dark text-balance sm:text-6xl lg:text-7xl xl:text-[6.5rem]"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
              >
                September Camp <span className="text-brand-accent-readable">Night</span>
              </motion.h1>
            </div>

            {/* The partnership slot on the Base Camp Kids hero. African Dream
                Community is ours rather than a partner, so it reads "with the",
                not "×" — that symbol would imply two separate organisations. */}
            <motion.p
              className="mb-7 max-w-lg font-serif text-lg italic leading-snug text-brand-dark/85 sm:text-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
            >
              {EVENT_TAGLINE}, with the {COMMUNITY_NAME}. Hosted by {EVENT_HOST}.
            </motion.p>

            <motion.p
              className="mb-10 max-w-lg font-sans text-base leading-relaxed text-brand-dark/75 sm:text-lg lg:mb-12"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
            >
              {SIGNUP_OPEN ? (
                <>
                  One night under canvas at a private garden venue in {VENUE_PUBLIC_LABEL}. We pitch
                  the tents and put a mattress in each one. You bring a bedsheet and a hoodie. Three
                  DJs, karaoke, movies and games until the fire burns down.
                </>
              ) : (
                <>{EVENT_DESCRIPTION} Here’s how the night ran.</>
              )}
            </motion.p>

            {/* Magazine-style spec strip */}
            <motion.dl
              className="mb-10 flex flex-wrap items-stretch gap-y-4 divide-x divide-brand-dark/15 border-y border-brand-dark/15 py-5 lg:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.7 }}
            >
              <SpecItem first label="Time" value={EVENT_TIME_SHORT} />
              <SpecItem label="Where" value={VENUE_PUBLIC_LABEL} />
              <SpecItem label="Ages" value={`${MIN_AGE}+`} />
              <SpecItem
                label={SIGNUP_OPEN ? 'From' : 'Tents'}
                value={SIGNUP_OPEN ? formatNaira(LOWEST_PRICE) : String(TENT_CAP)}
              />
            </motion.dl>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.9 }}
            >
              <Link
                href={SIGNUP_OPEN ? '#signup' : '#tents'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-dark px-7 py-4 font-sans text-base font-semibold tracking-wide text-white transition-all duration-200 hover:bg-brand-accent hover:text-brand-dark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {SIGNUP_OPEN ? 'Save My Spot' : 'See How the Night Ran'}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href={SIGNUP_OPEN ? '#tents' : '/contact'}
                className="inline-flex items-center justify-center rounded-lg border border-brand-dark/30 bg-transparent px-7 py-4 font-sans text-base font-semibold tracking-wide text-brand-dark transition-colors duration-200 hover:border-brand-dark hover:bg-brand-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {SIGNUP_OPEN ? 'See the Night' : 'Tell Me About the Next One'}
              </Link>
            </motion.div>

            {/* Trust line — the practical detail, in the slot Base Camp Kids
                uses for its school credentials. */}
            <motion.p
              className="mt-10 font-sans text-xs leading-relaxed text-brand-dark/55 sm:text-sm lg:mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: premiumEase, delay: 1.1 }}
            >
              {TENT_CAP} tents only. Adults {MIN_AGE}+. The exact venue goes out to everyone who
              signs up.
              <br />
              Enquiries and bookings:{' '}
              <a
                href={EVENT_PHONE_TEL}
                className="font-semibold text-brand-accent-readable underline-offset-4 hover:underline"
              >
                {EVENT_PHONE_DISPLAY}
              </a>
            </motion.p>
          </div>
        </div>

        {/* Right — image with date stamp */}
        <div className="relative order-1 h-[58dvh] overflow-hidden sm:h-[64dvh] lg:order-2 lg:h-auto lg:min-h-full">
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            <Image
              src={HERO_IMAGE}
              alt={HERO_IMAGE_ALT}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {/* The Camp Night photograph is a night scene, so it needs a lift
                rather than the darkening Base Camp Kids uses on a bright one —
                the date stamp sits on sky that is already almost black. */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(180deg, rgba(14,62,46,0.45) 0%, rgba(14,62,46,0.05) 32%, rgba(14,62,46,0) 68%, rgba(14,62,46,0.35) 100%)',
              }}
            />
          </motion.div>

          {/* Passport-style date stamp — top-right corner.
              Top offset clears the navbar (h-16 mobile, h-20 desktop). */}
          <motion.div
            className="absolute right-5 top-20 z-10 sm:right-7 sm:top-24 lg:right-10 lg:top-28"
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.6 }}
          >
            <div className="rounded-md border-2 border-brand-dark bg-brand-light px-5 py-3 shadow-xl sm:px-6 sm:py-4">
              <p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-accent-readable sm:text-xs">
                {DATE_STAMP.weekday}
              </p>
              <p className="my-1 text-center font-serif text-4xl font-bold leading-none text-brand-dark sm:text-5xl">
                {DATE_STAMP.day}
              </p>
              <p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-dark sm:text-xs">
                {DATE_STAMP.monthYear}
              </p>
            </div>
          </motion.div>

          {/* Status pill — bottom-left */}
          <motion.div
            className="absolute bottom-5 left-5 z-10 sm:bottom-7 sm:left-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: premiumEase, delay: 0.9 }}
          >
            {SIGNUP_OPEN ? (
              <span className="inline-flex items-center rounded-full bg-brand-dark/90 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-brand-accent backdrop-blur-sm">
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-accent"
                  aria-hidden="true"
                />
                Now Booking · {TENT_CAP} Tents
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-brand-dark backdrop-blur-sm">
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-dark/40"
                  aria-hidden="true"
                />
                This Edition Has Ended
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SpecItem({
  label,
  value,
  first = false,
}: {
  label: string
  value: string
  first?: boolean
}) {
  return (
    <div className={first ? 'pr-5 sm:pr-6' : 'px-5 sm:px-6'}>
      <dt className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-dark/55">
        {label}
      </dt>
      <dd className="whitespace-nowrap font-serif text-base font-bold text-brand-dark sm:text-lg">
        {value}
      </dd>
    </div>
  )
}
