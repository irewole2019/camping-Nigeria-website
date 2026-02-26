'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import { SCHOOLS_HERO } from '@/lib/media'

const HEADING_ID = 'home-hero-heading'

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center"
      aria-labelledby={HEADING_ID}
    >
      {/* Background Image -- slow scale on load */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden will-change-transform"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <Image
          src={SCHOOLS_HERO.src}
          alt={SCHOOLS_HERO.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden="true" />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark/80 to-transparent"
          aria-hidden="true"
        />
      </motion.div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
          >
            <span className="block w-8 h-px bg-brand-accent" aria-hidden="true" />
            Structured Outdoor Education
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
              Outdoor Learning,{' '}
              <span className="text-brand-accent">Reimagined</span> for Nigerian
              Schools
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            Structured, safe, and development-focused camping experiences
            designed to build confidence, teamwork, and environmental awareness.
          </motion.p>

          {/* CTA Buttons -- staggered */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.8 }}
            >
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-accent text-brand-dark font-semibold rounded-lg text-base tracking-wide hover:bg-brand-accent/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Request a School Proposal
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.95 }}
            >
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg text-base tracking-wide hover:bg-white/10 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Download Program Overview
              </Link>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            className="mt-14 flex flex-wrap gap-x-8 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: premiumEase, delay: 1.15 }}
          >
            {['50+ Partner Schools', 'Certified Instructors', 'Safety-First Protocols'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-white/60 text-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
