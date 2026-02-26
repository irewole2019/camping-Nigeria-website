'use client'

import { motion } from 'framer-motion'

const premiumEase = [0.16, 1, 0.3, 1]

export default function GearHero() {
  return (
    <section
      className="relative h-[60vh] flex items-center"
      aria-label="Gear rental hero section"
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      >
        <img
          src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1800&q=85&fit=crop"
          alt="Premium camping gear and tent setup in a forest clearing"
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
            Gear Rental
          </motion.p>

          {/* Masked headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
            >
              Premium Camping Gear,{' '}
              <span className="text-brand-accent">Ready When You Are</span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.55 }}
          >
            Rent high-quality camping equipment for schools, individuals, and
            organizations without the stress of ownership.
          </motion.p>

        </div>
      </div>
    </section>
  )
}
