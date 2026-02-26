'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function OrganizationsCta() {
  return (
    <section className="bg-brand-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-sm font-sans font-semibold tracking-widest text-brand-accent uppercase">
            Let's get started
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-dark text-balance leading-tight">
            Ready to transform your team dynamics?
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-dark/65 max-w-xl leading-relaxed">
            Tell us about your group and we'll design a retreat that delivers lasting impact.
          </p>
          <Link
            href="mailto:hello@campingnigeria.com"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-dark text-white font-sans font-bold text-base rounded-lg hover:bg-brand-accent hover:text-brand-dark active:scale-95 transition-all duration-200 shadow-md"
          >
            Plan Your Organization's Retreat
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
