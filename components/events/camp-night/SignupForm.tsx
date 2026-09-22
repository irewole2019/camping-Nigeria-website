'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import Honeypot from '@/components/ui/Honeypot'
import {
  REGISTERED_PATH,
  TENT_PACKAGES,
  formatNaira,
  type TentPackageId,
} from '@/lib/events/camp-night'

const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
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
  const [packageId, setPackageId] = useState<TentPackageId>('shared')

  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Tell us your name.'
    if (!email.trim()) next.email = 'We need an email to send your code to.'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'That email does not look right.'
    if (!phone.trim()) next.phone = 'We need a phone number.'
    else if (countDigits(phone) < 7) next.phone = 'That phone number looks too short.'
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
      const res = await fetch('/api/camp-night-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          instagram: instagram.trim(),
          packageId,
          website_confirm: honeypotRef.current?.value || '',
        }),
      })

      const json: unknown = await res.json().catch(() => null)
      const body = (json ?? {}) as { success?: boolean; code?: string; error?: string }

      if (res.ok && body.success && body.code) {
        const params = new URLSearchParams({
          code: body.code,
          name: name.trim(),
          package: packageId,
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

      {/* Tent package — the first decision, and the one that sets the price */}
      <fieldset>
        <legend className={labelBase}>
          Pick your tent <span className="text-brand-accent">*</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TENT_PACKAGES.map((pkg) => {
            const selected = packageId === pkg.id
            return (
              <label
                key={pkg.id}
                className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-colors duration-200 ${
                  selected
                    ? 'border-brand-accent bg-brand-accent-tint'
                    : 'border-brand-dark/15 bg-white hover:border-brand-dark/30'
                }`}
              >
                <input
                  type="radio"
                  name="packageId"
                  value={pkg.id}
                  checked={selected}
                  onChange={() => setPackageId(pkg.id)}
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
                <span className="font-serif text-lg font-bold text-brand-dark">{pkg.name}</span>
                <span className="mt-1 font-sans text-xl font-bold text-brand-dark tabular-nums">
                  {formatNaira(pkg.price)}
                </span>
                <span className="mt-2 font-sans text-xs leading-relaxed text-brand-dark/60">
                  {pkg.detail}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="cn-name"
          label="Full name"
          required
          value={name}
          onChange={setName}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Ada Obi"
        />
        <Field
          id="cn-email"
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
          id="cn-phone"
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
          id="cn-instagram"
          label="Instagram username"
          value={instagram}
          onChange={setInstagram}
          placeholder="@yourhandle"
          optional
          hint="So we can tag you in the photos."
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
          You will get your camp code by email straight away, with everything to bring on the night.
        </p>
      </div>
    </form>
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
