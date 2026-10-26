'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import Honeypot from '@/components/ui/Honeypot'
import {
  EVENT_PHONE_DISPLAY,
  MIN_AGE,
  REGISTERED_PATH,
  TICKETS,
  formatNaira,
  type TicketId,
} from '@/lib/events/mad-settings'

const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

interface FormErrors {
  name?: string
  partnerName?: string
  email?: string
  phone?: string
  age?: string
  paid?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function countDigits(value: string): number {
  return (value.match(/\d/g) || []).length
}

export default function SignupForm() {
  const router = useRouter()
  const honeypotRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  // Couple tickets only: the second person gets their own tribe, so the
  // email, gate screen and printed list need their name.
  const [partnerName, setPartnerName] = useState('')
  const [ticketId, setTicketId] = useState<TicketId>('attendance')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [paidConfirmed, setPaidConfirmed] = useState(false)

  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Tell us your name.'
    if (ticketId === 'couple' && !partnerName.trim()) {
      next.partnerName = 'Tell us your partner’s name. A couple ticket is for two people.'
    }
    if (!email.trim()) next.email = 'We need an email to send your code to.'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'That email does not look right.'
    if (!phone.trim()) next.phone = 'We need a phone number.'
    else if (countDigits(phone) < 7) next.phone = 'That phone number looks too short.'
    if (!ageConfirmed) next.age = `MAD Settings is for adults ${MIN_AGE} and over.`
    if (!paidConfirmed) {
      next.paid = `Tickets are paid for before you sign up. Call ${EVENT_PHONE_DISPLAY} to pay.`
    }
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSending(true)
    try {
      const res = await fetch('/api/mad-settings-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          instagram: instagram.trim(),
          ticketId,
          partnerName: ticketId === 'couple' ? partnerName.trim() : '',
          ageConfirmed,
          paidConfirmed,
          website_confirm: honeypotRef.current?.value || '',
        }),
      })

      const json: unknown = await res.json().catch(() => null)
      const body = (json ?? {}) as {
        success?: boolean
        code?: string
        tribe?: string
        partnerTribe?: string
        error?: string
      }

      if (res.ok && body.success && body.code) {
        const params = new URLSearchParams({
          code: body.code,
          name: name.trim(),
          ticket: ticketId,
          // The tribe the sheet assigned, so the page can show it at once.
          ...(body.tribe ? { tribe: body.tribe } : {}),
          // A couple's second person and their (different) tribe.
          ...(ticketId === 'couple' && body.partnerTribe
            ? { partner: partnerName.trim(), tribe2: body.partnerTribe }
            : {}),
        })
        router.push(`${REGISTERED_PATH}?${params.toString()}`)
        return
      }

      if (res.status === 429) {
        setSubmitError(
          'You have sent a few in a row. Please try again in a few minutes, or email hello@campingnigeria.com.',
        )
      } else if (res.status === 403) {
        setSubmitError(body.error || 'Sign-ups are closed. Email hello@campingnigeria.com.')
      } else if (res.status === 409) {
        // Sold out. The sheet counts the rows, so this is the real answer —
        // it can arrive even though the form was still on screen.
        setSubmitError(body.error || 'Every tent is taken. Attendance-only tickets are still open.')
      } else {
        setSubmitError(
          body.error || 'We could not save your sign-up. Please email hello@campingnigeria.com or try again.',
        )
      }
    } catch {
      setSubmitError(
        'We could not reach the server. Check your connection and try again, or email hello@campingnigeria.com.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <Honeypot ref={honeypotRef} />

      {/* Ticket — the first decision, and the one that sets the price */}
      <fieldset>
        <legend className={labelBase}>
          Pick your ticket <span className="text-brand-accent">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TICKETS.map((ticket) => {
            const selected = ticketId === ticket.id
            return (
              <label
                key={ticket.id}
                className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-colors duration-200 ${
                  selected
                    ? 'border-brand-accent bg-brand-accent-tint'
                    : 'border-brand-dark/15 bg-white hover:border-brand-dark/30'
                }`}
              >
                <input
                  type="radio"
                  name="ticketId"
                  value={ticket.id}
                  checked={selected}
                  onChange={() => setTicketId(ticket.id)}
                  className="sr-only"
                />
                {selected && (
                  <span
                    className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3 text-brand-dark" strokeWidth={3} />
                  </span>
                )}
                <span className="font-serif text-lg font-bold text-brand-dark">{ticket.name}</span>
                <span className="mt-1 font-sans text-xl font-bold text-brand-dark tabular-nums">
                  {formatNaira(ticket.price)}
                </span>
                <span className="mt-2 font-sans text-xs leading-relaxed text-brand-dark/60">
                  {ticket.detail}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {ticketId === 'couple' && (
        <Field
          id="ms-partner"
          label="Your partner’s name"
          required
          value={partnerName}
          onChange={setPartnerName}
          error={errors.partnerName}
          autoComplete="off"
          placeholder="e.g. Tunde Bello"
          hint="On a couple ticket, each of you is put in a different tribe."
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="ms-name"
          label="Full name"
          required
          value={name}
          onChange={setName}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Ada Obi"
        />
        <Field
          id="ms-email"
          label="Email"
          required
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
          hint="Your code goes here."
        />
        <Field
          id="ms-phone"
          label="Phone number"
          required
          type="tel"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
          autoComplete="tel"
          placeholder="e.g. 0903 404 2503"
          hint="WhatsApp preferred."
        />
        <Field
          id="ms-instagram"
          label="Instagram username"
          value={instagram}
          onChange={setInstagram}
          placeholder="@yourhandle"
          optional
          hint="So we can tag you in the photos."
        />
      </div>

      {/* Both required, and both re-checked by the API. The paid one is what
          lets the sheet record the row as paid — payment happens offline
          before sign-up, so the form has nothing to charge. */}
      <div className="space-y-4 rounded-xl border border-brand-dark/10 bg-white p-5">
        <Confirm
          id="ms-paid"
          name="paidConfirmed"
          checked={paidConfirmed}
          onChange={setPaidConfirmed}
          error={errors.paid}
          label="I have already paid for my ticket."
          hint={`Tickets are paid for before you sign up. Not paid yet? Call ${EVENT_PHONE_DISPLAY} first.`}
        />
        <Confirm
          id="ms-age"
          name="ageConfirmed"
          checked={ageConfirmed}
          onChange={setAgeConfirmed}
          error={errors.age}
          label={`I am ${MIN_AGE} or over.`}
          hint="MAD Settings is an adults-only event."
        />
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900"
        >
          {submitError}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand-dark px-8 py-4 font-sans text-base font-semibold tracking-wide text-white transition-all duration-200 hover:bg-brand-accent hover:text-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          {sending ? 'Saving your spot…' : 'Save my spot'}
        </button>
        <p className="mt-3 font-sans text-xs leading-relaxed text-brand-dark/55">
          You will get your code by email straight away, with the venue, a map link and
          everything to bring on the day.
        </p>
      </div>
    </form>
  )
}

function Confirm({
  id,
  name,
  checked,
  onChange,
  error,
  label,
  hint,
}: {
  id: string
  name: string
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
  label: string
  hint: string
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        />
        <span className="font-sans text-sm leading-relaxed text-brand-dark/85">
          {label} <span className="text-brand-accent">*</span>
          <span id={`${id}-hint`} className="mt-0.5 block text-xs text-brand-dark/55">
            {hint}
          </span>
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-sans text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  optional = false,
  placeholder,
  autoComplete,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  autoComplete?: string
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && <span className="text-brand-accent"> *</span>}
        {optional && <span className="font-normal text-brand-dark/40"> (Optional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputBase}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-sans text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 font-sans text-xs text-brand-dark/50">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
