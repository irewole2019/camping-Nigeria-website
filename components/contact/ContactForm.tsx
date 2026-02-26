'use client'

import { useState } from 'react'

const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'School Programmes',
  'Individual Camping',
  'Organization Retreats',
  'Gear Rental',
  'Partnership Opportunity',
  'Other',
]

interface FormErrors {
  fullName?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactForm() {
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
    if (!data.subject || String(data.subject).trim() === '') {
      newErrors.subject = 'Please select a subject.'
    }
    if (!data.message || String(data.message).trim() === '') {
      newErrors.message = 'Message is required.'
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

  if (submitted) {
    return (
      <div
        className="rounded-2xl bg-brand-dark text-white px-8 py-12 text-center"
        role="alert"
        aria-live="polite"
      >
        <p className="font-serif text-2xl font-bold mb-2">Message sent!</p>
        <p className="text-white/70 font-sans text-sm mb-6">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-brand-dark font-sans font-semibold text-sm rounded-lg hover:brightness-105 active:scale-95 transition-transform duration-200"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
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

      {/* Subject */}
      <div>
        <label htmlFor="subject" className={labelBase}>
          Subject <span className="text-brand-accent">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          defaultValue=""
          className={inputBase}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {SUBJECT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelBase}>
          Message <span className="text-brand-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          rows={5}
          placeholder="How can we help you?"
          className={inputBase + ' resize-none'}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide py-4 mt-2 transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Send Message
      </button>
    </form>
  )
}
