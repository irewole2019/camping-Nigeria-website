'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { premiumEase } from '@/lib/animation'
import { OFFERS_HUB_HERO, OFFER_GROUPS } from '@/lib/offers-data'

const HEADING_ID = 'offers-hero-heading'

/**
 * Hub hero for /offers. Mirrors the homepage gateway: one headline, then a
 * row of pill buttons — one per offer group — each routing to that group's
 * own page rather than scrolling within this one.
 */
export default function OffersHero() {
  return (
    <section
      className="relative flex items-center min-h-dvh"
      aria-labelledby={HEADING_ID}
    >
      {/* Background — slow scale on load, matching PageHero */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden will-change-transform"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <Image
          src={OFFERS_HUB_HERO.src}
          alt={OFFERS_HUB_HERO.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/70" aria-hidden="true" />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark/80 to-transparent"
          aria-hidden="true"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
          >
            <span className="block w-8 h-px bg-brand-accent" aria-hidden="true" />
            Our Offers
          </motion.p>

          {/* Masked headline reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              id={HEADING_ID}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
            >
              Offers for schools, organizations and{' '}
              <span className="text-brand-accent">individuals</span>
            </motion.h1>
          </div>

          {/* Lede */}
          <motion.p
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            Managed outdoor programmes. We bring the equipment, the facilitators, the safety
            documentation and the paperwork. You get the programme and the record of it.
          </motion.p>

          {/* One pill per offer group */}
          <motion.nav
            aria-label="Offer groups"
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.8 }}
          >
            {OFFER_GROUPS.map((group) => (
              <Link
                key={group.slug}
                href={`/offers/${group.slug}`}
                className="sm:w-52 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-center font-sans text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand-dark hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {group.name}
              </Link>
            ))}
          </motion.nav>
        </div>
      </div>
    </section>
  )
}
