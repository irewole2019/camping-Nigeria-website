'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

interface FormErrors {
  fullName?: string
  email?: string
  equipment?: string
  rentalDates?: string
}

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(data: Record<string, FormDataEntryValue>): FormErrors {
    const newErrors: FormErrors = {}
    if (!data.fullName || String(data.fullName).trim() === '') {
      newErrors.fullName = 'Full name is required.'
    }
    if (!data.email || String(data.email).trim() === '') {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!data.equipment || String(data.equipment).trim() === '') {
      newErrors.equipment = 'Please describe the equipment you need.'
    }
    if (!data.rentalDates || String(data.rentalDates).trim() === '') {
      newErrors.rentalDates = 'Expected rental dates are required.'
    }
    return newErrors
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const validationErrors = validate(data)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    // TODO: Connect to backend API
    setSubmitted(true)
  }

  function handleReset() {
    setSubmitted(false)
    setErrors({})
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
          <p className="inline-flex items-center gap-2 text-brand-accent-readable font-semibold text-sm uppercase tracking-widest mb-3">
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
            role="alert"
            aria-live="polite"
          >
            <p className="font-serif text-2xl font-bold mb-2">Request received!</p>
            <p className="text-white/70 font-sans text-sm mb-6">
              Thank you — we will review your request and get back to you within 24 hours.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-brand-dark font-sans font-semibold text-sm rounded-lg hover:brightness-105 active:scale-95 transition-transform duration-200"
            >
              Submit another request
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-brand-dark/5 shadow-sm bg-white p-8 md:p-10 flex flex-col gap-6"
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
                aria-required="true"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                placeholder="e.g. Amara Okafor"
                className={inputBase}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.fullName}
                </p>
              )}
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
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="you@example.com"
                className={inputBase}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
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
                aria-required="true"
                aria-invalid={!!errors.equipment}
                aria-describedby={errors.equipment ? 'equipment-error' : undefined}
                rows={4}
                placeholder="e.g. 10 tents, 20 sleeping mats, cooking equipment for 40 people..."
                className={inputBase + ' resize-none'}
              />
              {errors.equipment && (
                <p id="equipment-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.equipment}
                </p>
              )}
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
                aria-required="true"
                aria-invalid={!!errors.rentalDates}
                aria-describedby={errors.rentalDates ? 'rentalDates-error' : undefined}
                placeholder="e.g. March 14-17, 2026"
                className={inputBase}
              />
              {errors.rentalDates && (
                <p id="rentalDates-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.rentalDates}
                </p>
              )}
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
