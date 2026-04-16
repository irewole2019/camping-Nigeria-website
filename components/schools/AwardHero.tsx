'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import { SCHOOLS_DOE_CALLOUT } from '@/lib/media'

const HEADING_ID = 'international-award-hero-heading'

export default function AwardHero() {
  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center"
      aria-labelledby={HEADING_ID}
    >
      {/* Background image with slow scale on load */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden will-change-transform"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <Image
          src={SCHOOLS_DOE_CALLOUT.src}
          alt={SCHOOLS_DOE_CALLOUT.alt}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
          >
            <span className="block w-8 h-px bg-brand-accent" aria-hidden="true" />
            Outdoor Expedition Support
          </motion.p>

          {/* Masked headline reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              id={HEADING_ID}
              className="font-serif text-[2.5rem] sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] text-balance"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
            >
              We Help Nigerian Schools Run the{' '}
              <span className="text-brand-accent">Duke of Edinburgh</span> Expedition.
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-white/75 mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            Camping Nigeria provides the equipment, the facilitators, and the outdoor structure schools need to deliver the expedition component of the Award. We handle the logistics. Your students get the experience.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.8 }}
          >
            <Link
              href="#assessment"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-7 py-4 bg-brand-accent text-brand-dark font-semibold rounded-lg text-sm sm:text-base tracking-wide text-center hover:bg-brand-accent/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Find My School&apos;s Expedition Setup
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
