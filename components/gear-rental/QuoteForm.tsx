'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'

const premiumEase = [0.16, 1, 0.3, 1]

const inputBase =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    // TODO: Connect to backend API
    console.log('Rental quote request:', data)
    setSubmitted(true)
  }

  return (
    <Section className="bg-white">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: premiumEase }}
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 text-brand-accent font-semibold text-xs uppercase tracking-widest mb-3">
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
            Get a Quote
            <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance">
            Request a Rental Quote
          </h2>
          <p className="mt-3 text-sm text-brand-dark/60 font-sans leading-relaxed">
            Fill in the form below and we will get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <motion.div
            className="rounded-2xl bg-brand-dark text-white px-8 py-12 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: premiumEase }}
          >
            <p className="font-serif text-2xl font-bold mb-2">Request received!</p>
            <p className="text-white/70 font-sans text-sm">
              Thank you — we will review your request and get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-100 shadow-sm bg-white p-8 md:p-10 flex flex-col gap-6"
            noValidate
          >
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className={labelBase}>
                Full Name <span className="text-brand-accent">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="e.g. Amara Okafor"
                className={inputBase}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelBase}>
                Email Address <span className="text-brand-accent">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className={inputBase}
              />
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className={labelBase}>
                Organization / School Name{' '}
                <span className="text-brand-dark/40 font-normal">(Optional)</span>
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                placeholder="e.g. Lagos Preparatory School"
                className={inputBase}
              />
            </div>

            {/* Equipment Needed */}
            <div>
              <label htmlFor="equipment" className={labelBase}>
                Equipment Needed <span className="text-brand-accent">*</span>
              </label>
              <textarea
                id="equipment"
                name="equipment"
                required
                rows={4}
                placeholder="e.g. 10 tents, 20 sleeping mats, cooking equipment for 40 people…"
                className={inputBase + ' resize-none'}
              />
            </div>

            {/* Rental Dates */}
            <div>
              <label htmlFor="rentalDates" className={labelBase}>
                Expected Rental Dates <span className="text-brand-accent">*</span>
              </label>
              <input
                id="rentalDates"
                name="rentalDates"
                type="text"
                required
                placeholder="e.g. March 14–17, 2026"
                className={inputBase}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide py-4 mt-2 transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Request a Rental Quote
            </button>
          </form>
        )}
      </motion.div>
    </Section>
  )
}
