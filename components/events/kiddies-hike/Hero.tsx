'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import {
  ADULTS_ATTENDED,
  CHILDREN_ATTENDED,
  EVENT_DATE_LABEL,
  EVENT_EYEBROW,
  EVENT_HERO_PARAGRAPH,
  EVENT_PARTNERS,
  EVENT_TAGLINE,
  EVENT_TIME_LABEL,
  HERO_IMAGE,
  HERO_IMAGE_ALT,
  MAX_AGE,
  MIN_AGE,
  TRUST_LINE,
  VENUE_CITY,
} from '@/lib/events/kiddies-hike'

const HEADING_ID = 'kiddies-hike-hero'

/**
 * Mirrors the Base Camp Kids hero: split layout, passport-style date stamp,
 * spec strip, two CTAs. This edition has already run, so there is no
 * upcoming/past branching — it is a recap from the start.
 */
export default function Hero() {
  // 'Friday, 21 August 2026' → a 3-line stack for the date stamp.
  const [weekday, restA] = EVENT_DATE_LABEL.split(', ')
  const [day, ...rest] = restA.split(' ')
  const monthYear = rest.join(' ')

  return (
    <section className="relative bg-brand-light isolate" aria-labelledby={HEADING_ID}>
      <div className="grid lg:grid-cols-[1fr_1.05fr] lg:min-h-[90dvh]">
        {/* Left — content */}
        <div className="relative flex items-center order-2 lg:order-1 px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 pb-16 lg:py-24">
          <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-12 xl:mr-20">
            <motion.p
              className="inline-flex items-center gap-3 text-brand-accent-readable font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-7 lg:mb-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
            >
              <span className="block w-10 h-px bg-brand-accent" aria-hidden="true" />
              {EVENT_EYEBROW}
            </motion.p>

            <div className="overflow-hidden mb-6">
              <motion.h1
                id={HEADING_ID}
                className="font-serif text-[2.75rem] sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-tight text-brand-dark text-balance"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
              >
                Kiddies Hike <span className="text-brand-accent-readable">and Fun Day</span>
              </motion.h1>
            </div>

            <motion.p
              className="font-serif italic text-lg sm:text-xl text-brand-dark/85 leading-snug mb-3 max-w-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
            >
              {EVENT_TAGLINE}
            </motion.p>

            <motion.p
              className="font-sans text-sm text-brand-dark/60 mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.45 }}
            >
              {EVENT_PARTNERS}
            </motion.p>

            <motion.p
              className="font-sans text-base sm:text-lg text-brand-dark/75 leading-relaxed mb-10 lg:mb-12 max-w-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
            >
              {EVENT_HERO_PARAGRAPH}
            </motion.p>

            {/* Magazine-style spec strip */}
            <motion.dl
              className="flex flex-wrap items-stretch gap-y-4 mb-10 lg:mb-12 border-y border-brand-dark/15 py-5 divide-x divide-brand-dark/15"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.7 }}
            >
              <SpecItem first label="Time" value={EVENT_TIME_LABEL} />
              <SpecItem label="Where" value={VENUE_CITY} />
              <SpecItem label="Ages" value={`${MIN_AGE} to ${MAX_AGE}`} />
              <SpecItem label="Turnout" value={`${CHILDREN_ATTENDED} + ${ADULTS_ATTENDED}`} />
              <SpecItem label="Entry" value="Free" />
            </motion.dl>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.9 }}
            >
              <Link
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-dark text-white font-semibold rounded-lg text-base tracking-wide hover:bg-brand-accent hover:text-brand-dark active:scale-[0.98] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                See How the Day Ran
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/schools/proposal"
                className="inline-flex items-center justify-center px-7 py-4 bg-transparent border border-brand-dark/30 text-brand-dark font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Bring This to Your School
              </Link>
            </motion.div>

            <motion.p
              className="mt-10 lg:mt-14 font-sans text-xs sm:text-sm text-brand-dark/55 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: premiumEase, delay: 1.1 }}
            >
              {TRUST_LINE}
            </motion.p>
          </div>
        </div>

        {/* Right — image with date stamp */}
        <div className="relative order-1 lg:order-2 h-[58dvh] sm:h-[64dvh] lg:h-auto lg:min-h-full overflow-hidden">
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
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(180deg, rgba(14,62,46,0.30) 0%, rgba(14,62,46,0) 30%, rgba(14,62,46,0) 70%, rgba(14,62,46,0.20) 100%)',
              }}
            />
          </motion.div>

          {/* Passport-style date stamp. Top offset clears the navbar. */}
          <motion.div
            className="absolute top-20 right-5 sm:top-24 sm:right-7 lg:top-28 lg:right-10 z-10"
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.6 }}
          >
            <div className="bg-brand-light border-2 border-brand-dark rounded-md px-5 py-3 sm:px-6 sm:py-4 shadow-xl">
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-accent-readable font-semibold text-center">
                {weekday}
              </p>
              <p className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark leading-none text-center my-1">
                {day}
              </p>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-dark font-semibold text-center">
                {monthYear}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 z-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: premiumEase, delay: 0.9 }}
          >
            <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-brand-dark font-sans text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-brand-dark/40 mr-2"
                aria-hidden="true"
              />
              This Edition Has Ended
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SpecItem({ label, value, first = false }: { label: string; value: string; first?: boolean }) {
  return (
    <div className={first ? 'pr-5 sm:pr-6' : 'px-5 sm:px-6'}>
      <dt className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-dark/55 font-semibold mb-1">
        {label}
      </dt>
      <dd className="font-serif text-base sm:text-lg font-bold text-brand-dark whitespace-nowrap">
        {value}
      </dd>
    </div>
  )
}
