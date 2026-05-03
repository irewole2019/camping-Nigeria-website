'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import Honeypot from '@/components/ui/Honeypot'
import EquipmentTable, { EquipmentTableSkeleton } from '@/components/gear-rental/EquipmentTable'
import { loadQuoteItems, type QuoteItem } from '@/lib/quote-config'
import { premiumEase } from '@/lib/animation'

const QUOTE_API_URL = 'https://quote.campingnigeria.com/api/submit-quote'
const ITEMS_CSV_URL = process.env.NEXT_PUBLIC_SHEETS_ITEMS_URL

const DELIVERY_ZONES = ['Abuja', 'Lagos', 'Other'] as const
type DeliveryZone = (typeof DELIVERY_ZONES)[number]

const DEFAULT_PICKUP_TIME = '12:00'
const DEFAULT_DROPOFF_TIME = '12:00'

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

function formatTime12(time24: string): string {
  if (!/^\d{2}:\d{2}$/.test(time24)) return ''
  const [h, m] = time24.split(':').map(Number)
  const period = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 || 12
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

/**
 * Camping convention: rental days run noon-to-noon. We compute days as
 *   max(1, ceil(elapsed_hours / 24))
 * which gives 1 day for noon-to-noon, 1 day for a same-day daytime rental,
 * 2 days for a 25-hour rental, etc. Same rule the quote tool runs server-side.
 */
function formatRentalRange(
  startDate: string,
  pickupTime: string,
  endDate: string,
  dropoffTime: string,
): string | null {
  if (!startDate || !endDate || !pickupTime || !dropoffTime) return null
  const startMs = new Date(`${startDate}T${pickupTime}:00`).getTime()
  const endMs = new Date(`${endDate}T${dropoffTime}:00`).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return null
  if (endMs <= startMs) return null
  const elapsedH = (endMs - startMs) / (1000 * 60 * 60)
  const days = Math.max(1, Math.ceil(elapsedH / 24))
  return `${days} day${days === 1 ? '' : 's'} (${formatDateShort(startDate)} ${formatTime12(pickupTime)} → ${formatDateShort(endDate)} ${formatTime12(dropoffTime)})`
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  rentalDates?: string
  deliveryZone?: string
  items?: string
}

export default function QuoteForm() {
  const router = useRouter()

  const [items, setItems] = useState<QuoteItem[]>([])
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pickupTime, setPickupTime] = useState(DEFAULT_PICKUP_TIME)
  const [dropoffTime, setDropoffTime] = useState(DEFAULT_DROPOFF_TIME)
  const [today, setToday] = useState('')
  const [minEndDate, setMinEndDate] = useState('')

  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  // ── Load equipment list from Google Sheets on mount ──────────────────────
  useEffect(() => {
    // Legitimate post-hydration state init — SSR doesn't know the browser's
    // local date, so we start empty and fill after hydration.
    const t = todayISO()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(t)
    setMinEndDate(t)

    if (!ITEMS_CSV_URL) {
      setConfigLoading(false)
      setConfigError(true)
      return
    }
    const ctrl = new AbortController()
    loadQuoteItems(ITEMS_CSV_URL, ctrl.signal)
      .then((loaded) => {
        if (ctrl.signal.aborted) return
        setItems(loaded)
        setConfigLoading(false)
      })
      .catch((err) => {
        if (ctrl.signal.aborted || err?.name === 'AbortError') return
        console.error('Failed to load equipment list:', err)
        setConfigError(true)
        setConfigLoading(false)
      })
    return () => ctrl.abort()
  }, [])

  function setQuantity(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }))
    if (errors.items) setErrors((prev) => ({ ...prev, items: undefined }))
  }

  function selectedItems() {
    return items
      .filter((it) => (quantities[it.id] || 0) > 0)
      .map((it) => ({
        id: it.id,
        name: it.name,
        category: it.category,
        quantity: quantities[it.id],
      }))
  }

  function validate(data: {
    fullName: string
    email: string
    phone: string
    deliveryZone: string
    startDate: string
    pickupTime: string
    endDate: string
    dropoffTime: string
    selected: ReturnType<typeof selectedItems>
  }): FormErrors {
    const next: FormErrors = {}
    if (!data.fullName.trim()) next.fullName = 'Full name is required.'
    if (!data.email.trim()) {
      next.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!data.phone.trim()) {
      next.phone = 'Phone number is required.'
    } else if (data.phone.replace(/\D/g, '').length < 7) {
      next.phone = 'Please enter a valid phone number.'
    }
    if (!data.startDate || !data.endDate) {
      next.rentalDates = 'Please pick both pickup and dropoff dates.'
    } else if (data.endDate < data.startDate) {
      next.rentalDates = 'Dropoff must be on or after pickup.'
    } else if (
      data.startDate === data.endDate &&
      data.pickupTime >= data.dropoffTime
    ) {
      next.rentalDates = 'For same-day rentals, dropoff must be after pickup.'
    }
    if (!DELIVERY_ZONES.includes(data.deliveryZone as DeliveryZone)) {
      next.deliveryZone = 'Please select a delivery zone.'
    }
    // Only require items when the equipment list actually loaded.
    if (!configError && items.length > 0 && data.selected.length === 0) {
      next.items = 'Please select at least one item.'
    }
    return next
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fullName = String(fd.get('fullName') || '')
    const email = String(fd.get('email') || '')
    const phone = String(fd.get('phone') || '')
    const organization = String(fd.get('organization') || '')
    const message = String(fd.get('message') || '')
    const deliveryZone = String(fd.get('deliveryZone') || '')
    const startDateVal = String(fd.get('startDate') || '')
    const endDateVal = String(fd.get('endDate') || '')
    const pickupTimeVal = String(fd.get('pickupTime') || DEFAULT_PICKUP_TIME)
    const dropoffTimeVal = String(fd.get('dropoffTime') || DEFAULT_DROPOFF_TIME)

    const selected = selectedItems()
    const validationErrors = validate({
      fullName,
      email,
      phone,
      deliveryZone,
      startDate: startDateVal,
      pickupTime: pickupTimeVal,
      endDate: endDateVal,
      dropoffTime: dropoffTimeVal,
      selected,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setSubmitError(null)
    setSending(true)

    try {
      const res = await fetch(QUOTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: fullName,
            email,
            phone,
            org: organization,
          },
          delivery_zone: deliveryZone,
          rental_start: startDateVal,
          rental_end: endDateVal,
          pickup_time: pickupTimeVal,
          dropoff_time: dropoffTimeVal,
          items: selected,
          message,
        }),
      })

      const result = await res.json().catch(() => ({}))

      if (res.ok && result?.success && result?.reference) {
        const params = new URLSearchParams({
          ref: result.reference,
          email,
          name: fullName.split(' ')[0] || fullName,
        })
        router.push(`/gear-rental/submitted?${params.toString()}`)
        return
      }

      setSubmitError(
        'Something went wrong. Please try again or email us at hello@campingnigeria.com',
      )
    } catch {
      setSubmitError(
        'Something went wrong. Please try again or email us at hello@campingnigeria.com',
      )
    } finally {
      setSending(false)
    }
  }

  const duration = formatRentalRange(startDate, pickupTime, endDate, dropoffTime)

  return (
    <Section className="bg-white">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: premiumEase }}
        viewport={{ once: true, margin: '-80px' }}
      >
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

          {configError && (
            <div
              role="status"
              className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 leading-relaxed"
            >
              Equipment list temporarily unavailable. Describe your needs in the message field below.
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

          {/* Equipment selector */}
          {configLoading ? (
            <EquipmentTableSkeleton />
          ) : configError ? null : items.length > 0 ? (
            <EquipmentTable
              items={items}
              quantities={quantities}
              onChange={setQuantity}
              error={errors.items}
            />
          ) : null}

          {/* Pickup + Dropoff (date + time pairs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className={labelBase}>
                Pickup <span className="text-brand-accent">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  min={today}
                  value={startDate}
                  aria-label="Pickup date"
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  aria-describedby={errors.rentalDates ? 'rentalDates-error' : undefined}
                  onChange={(e) => {
                    const v = e.target.value
                    setStartDate(v)
                    setMinEndDate(v || today)
                    if (endDate && v && endDate < v) setEndDate('')
                  }}
                  className={inputBase}
                />
                <input
                  id="pickupTime"
                  name="pickupTime"
                  type="time"
                  required
                  value={pickupTime}
                  aria-label="Pickup time"
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  onChange={(e) => setPickupTime(e.target.value || DEFAULT_PICKUP_TIME)}
                  className={inputBase}
                />
              </div>
            </div>
            <div>
              <p className={labelBase}>
                Dropoff <span className="text-brand-accent">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  min={minEndDate}
                  value={endDate}
                  aria-label="Dropoff date"
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  aria-describedby={errors.rentalDates ? 'rentalDates-error' : undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputBase}
                />
                <input
                  id="dropoffTime"
                  name="dropoffTime"
                  type="time"
                  required
                  value={dropoffTime}
                  aria-label="Dropoff time"
                  aria-required="true"
                  aria-invalid={!!errors.rentalDates}
                  onChange={(e) => setDropoffTime(e.target.value || DEFAULT_DROPOFF_TIME)}
                  className={inputBase}
                />
              </div>
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
            {duration && !errors.rentalDates && (
              <p className="sm:col-span-2 -mt-2 text-sm text-brand-dark/70 font-sans">
                Duration: {duration}
              </p>
            )}
            <p className="sm:col-span-2 -mt-2 text-xs text-brand-dark/50 font-sans leading-relaxed">
              Rentals run noon-to-noon by default — adjust the times if you need a same-day or off-noon hire. Time picker shows 24h or 12h depending on your device.
            </p>
          </div>

          {/* Delivery Zone */}
          <div>
            <label htmlFor="deliveryZone" className={labelBase}>
              Delivery Zone <span className="text-brand-accent">*</span>
            </label>
            <select
              id="deliveryZone"
              name="deliveryZone"
              required
              aria-required="true"
              aria-invalid={!!errors.deliveryZone}
              aria-describedby={errors.deliveryZone ? 'deliveryZone-error' : undefined}
              defaultValue=""
              className={inputBase}
            >
              <option value="" disabled>
                Select a delivery zone…
              </option>
              {DELIVERY_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            {errors.deliveryZone && (
              <p id="deliveryZone-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.deliveryZone}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className={labelBase}>
              Message{' '}
              <span className="text-brand-dark/40 font-normal">(Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={4000}
              placeholder={
                configError
                  ? 'Tell us what equipment you need and how many people it is for…'
                  : 'Anything else we should know? Group size, special requests, delivery notes…'
              }
              className={inputBase + ' resize-none'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-brand-dark text-white font-sans font-semibold text-sm tracking-wide py-4 mt-2 transition-colors duration-200 hover:bg-brand-accent hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending your request...' : 'Request a Rental Quote'}
          </button>
        </form>
      </motion.div>
    </Section>
  )
}
