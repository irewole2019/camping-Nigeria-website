'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import Honeypot from '@/components/ui/Honeypot'
import { premiumEase } from '@/lib/animation'

// text-base on mobile (16px) prevents iOS Safari auto-zoom on focus.
const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

function todayISO(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatRentalDates(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const startStr = new Date(`${start}T00:00:00`).toLocaleDateString('en-GB', opts)
  if (start === end) return startStr
  const endStr = new Date(`${end}T00:00:00`).toLocaleDateString('en-GB', opts)
  return `${startStr} – ${endStr}`
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  equipment?: string
  rentalDates?: string
}

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  // Initialize date minimums client-side only. Server-rendered HTML omits the
  // `min` attribute; once we're on the client, fill it with today in the
  // browser's own timezone. Prevents SSR/client mismatch near midnight.
  const [today, setToday] = useState<string>('')
  const [minEndDate, setMinEndDate] = useState<string>('')

  useEffect(() => {
    // Legitimate post-hydration state init — SSR doesn't know the browser's
    // local date, so we start empty and fill after hydration.
    const t = todayISO()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(t)
    setMinEndDate(t)
  }, [])

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
    if (!data.phone || String(data.phone).trim() === '') {
      newErrors.phone = 'Phone number is required.'
    } else if (String(data.phone).replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number.'
    }
    if (!data.equipment || String(data.equipment).trim() === '') {
      newErrors.equipment = 'Please describe the equipment you need.'
    }
    const startDate = String(data.startDate || '')
    const endDate = String(data.endDate || '')
    if (!startDate || !endDate) {
      newErrors.rentalDates = 'Please pick both a start and end date.'
    } else if (endDate < startDate) {
      newErrors.rentalDates = 'End date must be on or after the start date.'
    }
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const validationErrors = validate(data)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setSubmitError(null)
    setSending(true)

    const rentalDates = formatRentalDates(String(data.startDate), String(data.endDate))

    try {
      const res = await fetch('/api/gear-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(data.fullName),
          email: String(data.email),
          phone: String(data.phone),
          organization: String(data.organization || ''),
          equipment: String(data.equipment),
          rentalDates,
          website_confirm: String(data.website_confirm || ''),
        }),
      })

      const result = await res.json().catch(() => ({}))

      if (res.ok && result.success) {
        setSubmitted(true)
        return
      }

      if (result.fallback === 'mailto') {
        const subject = encodeURIComponent(`Gear Rental Quote Request — ${data.fullName}`)
        const body = encodeURIComponent(
          `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nOrganization: ${data.organization || 'N/A'}\nEquipment: ${data.equipment}\nDates: ${rentalDates}`
        )
        window.open(`mailto:hello@campingnigeria.com?subject=${subject}&body=${body}`, '_self')
        return
      }

      setSubmitError(
        "We couldn't send your quote request. Please email hello@campingnigeria.com or try again."
      )
    } catch {
      setSubmitError(
        "We couldn't reach the server. Please check your connection and try again, or email hello@campingnigeria.com."
      )
    } finally {
      setSending(false)
    }
  }

  function handleReset() {
    setSubmitted(false)
    setErrors({})
    setSubmitError(null)
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
            {submitError && (
              <div
                role="alert"
                className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 leading-relaxed"
              >
                {submitError}
              </div>
            )}

            <Honeypot />

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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className={labelBase}>
                Phone Number{' '}
                <span className="text-brand-dark/40 font-normal">(WhatsApp preferred)</span>{' '}
                <span className="text-brand-accent">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                placeholder="e.g. 0704 053 8528"
                className={inputBase}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className={labelBase}>
                  Rental Start Date <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  min={today}
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  aria-describedby={errors.rentalDates ? 'rentalDates-error' : undefined}
                  onChange={(e) => setMinEndDate(e.target.value || today)}
                  className={inputBase}
                />
              </div>
              <div>
                <label htmlFor="endDate" className={labelBase}>
                  Rental End Date <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  min={minEndDate}
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  aria-describedby={errors.rentalDates ? 'rentalDates-error' : undefined}
                  className={inputBase}
                />
              </div>
              {errors.rentalDates && (
                <p
                  id="rentalDates-error"
                  className="sm:col-span-2 -mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.rentalDates}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide py-4 mt-2 transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Request a Rental Quote'}
            </button>
          </form>
        )}
      </motion.div>
    </Section>
  )
}
