'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import type { ReactNode } from 'react'

interface PageHeroProps {
  image: string
  imageAlt: string
  eyebrow: string
  headline: ReactNode
  subheadline: string
  ctaLabel?: string
  ctaHref?: string
  height?: 'min-h-screen' | 'h-[70vh]' | 'h-[60vh]'
  minHeight?: string
}

const HEADING_ID = 'page-hero-heading'

export default function PageHero({
  image,
  imageAlt,
  eyebrow,
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  height = 'min-h-screen',
  minHeight,
}: PageHeroProps) {
  const sectionClassName = [
    'relative flex items-center',
    height,
    minHeight,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClassName} aria-labelledby={HEADING_ID}>
      {/* Background Image -- slow scale on load */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden will-change-transform"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/65" aria-hidden="true" />
      </motion.div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
          >
            <span className="block w-8 h-px bg-brand-accent" aria-hidden="true" />
            {eyebrow}
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
              {headline}
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className={`text-white/75 text-lg md:text-xl leading-relaxed max-w-xl${ctaLabel ? ' mb-10' : ''}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            {subheadline}
          </motion.p>

          {/* Optional CTA */}
          {ctaLabel && ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.8 }}
            >
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-accent text-brand-dark font-semibold rounded-lg text-base tracking-wide hover:bg-brand-accent/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {ctaLabel}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
