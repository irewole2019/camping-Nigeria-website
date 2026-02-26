'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const premiumEase = [0.16, 1, 0.3, 1]

export default function OrganizationsHero() {
  return (
    <section
      className="relative h-[70vh] flex items-center"
      aria-label="Organizations hero section"
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=85&fit=crop"
          alt="Professional team collaborating outdoors in a lush natural setting"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-brand-dark/70" aria-hidden="true" />
      </motion.div>

      {/* Content */}
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
            For Organizations
          </motion.p>

          {/* Masked headline reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
            >
              Team Bonding{' '}
              <span className="text-brand-accent">Beyond the Boardroom</span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-xl mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            Camping Nigeria designs structured outdoor team experiences for companies,
            NGOs, churches, and social groups seeking meaningful connection and collaboration.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.8 }}
          >
            <Link
              href="mailto:hello@campingnigeria.com"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-accent text-brand-dark font-semibold rounded text-base tracking-wide hover:bg-brand-accent/90 active:scale-[0.98] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Plan Your Retreat
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
