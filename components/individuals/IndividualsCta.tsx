'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function IndividualsCta() {
  return (
    <section className="relative bg-brand-dark overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?w=1600&q=50"
          alt=""
          className="w-full h-full object-cover opacity-15"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-brand-dark/75" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-sm font-sans font-semibold tracking-widest text-brand-accent uppercase">
            Take the first step
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white text-balance leading-tight">
            Ready to step outside?
          </h2>
          <p className="font-sans text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
            Join a community of young Nigerians discovering the outdoors — safely, meaningfully, and memorably.
          </p>
          <Link
            href="/individuals"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-accent text-brand-dark font-sans font-bold text-base rounded-lg hover:brightness-105 active:scale-95 transition-all duration-200 shadow-lg shadow-brand-accent/20"
          >
            Book Your Spot
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
