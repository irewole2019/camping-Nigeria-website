'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { containerVariants, itemVariants, premiumEase } from '@/lib/animation'
import { OFFER_TERMS } from '@/lib/offers-data'

/**
 * Terms that apply across every package — inclusions, payment, and the
 * pricing caveat. Rendered at the foot of the hub and all three group pages
 * so a visitor never sees a price without the conditions attached to it.
 */
export default function OfferTerms() {
  return (
    <section className="bg-brand-dark text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden mb-10">
          <motion.h2
            className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase }}
          >
            How Every Programme Works
          </motion.h2>
        </div>

        <motion.dl
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {OFFER_TERMS.map((term) => (
            <motion.div key={term.label} variants={itemVariants}>
              <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-3">
                {term.label}
              </dt>
              <dd className="font-sans text-[15px] leading-relaxed text-white/70 text-pretty">
                {term.body}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div
          className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <p className="font-sans text-base text-white/70 max-w-xl text-pretty">
            Not sure which package fits? Tell us the group, the dates and the outcome you want,
            and we will come back with a quote within 72 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-accent text-brand-dark font-sans font-semibold text-sm rounded-lg tracking-wide hover:brightness-105 active:scale-[0.98] transition-transform duration-200 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            Talk to us
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
