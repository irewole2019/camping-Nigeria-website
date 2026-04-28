'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import Honeypot from '@/components/ui/Honeypot'
import {
  EARLY_BIRD_PRICE,
  MIN_AGE,
  MAX_AGE,
  MAX_CHILDREN_PER_REGISTRATION,
  REGISTERED_PATH,
  computeRegistrationTotal,
  formatNaira,
} from '@/lib/events/base-camp-kids'

const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

interface ChildState {
  id: number
  fullName: string
  age: string
  allergies: string
  photoConsent: boolean
}

interface ParentErrors {
  fullName?: string
  email?: string
  phone?: string
  city?: string
  emergencyName?: string
  emergencyPhone?: string
}

interface ChildErrors {
  fullName?: string
  age?: string
}

// Module-level counter — server and client both start at 0, so the initial
// child gets the same id on both sides and React hydration matches. Adding
// children after mount is client-only, so the counter only ever advances on
// the client thereafter.
let childIdCounter = 0

function newChild(): ChildState {
  childIdCounter += 1
  return {
    id: childIdCounter,
    fullName: '',
    age: '',
    allergies: '',
    photoConsent: true,
  }
}

export default function RegistrationForm() {
  const router = useRouter()
  const honeypotRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [children, setChildren] = useState<ChildState[]>([newChild()])

  const [parentErrors, setParentErrors] = useState<ParentErrors>({})
  const [childErrors, setChildErrors] = useState<Record<number, ChildErrors>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const total = useMemo(() => computeRegistrationTotal(children.length), [children.length])

  function addChild() {
    if (children.length >= MAX_CHILDREN_PER_REGISTRATION) return
    setChildren((c) => [...c, newChild()])
  }

  function removeChild(id: number) {
    if (children.length <= 1) return
    setChildren((c) => c.filter((kid) => kid.id !== id))
    setChildErrors((e) => {
      const next = { ...e }
      delete next[id]
      return next
    })
  }

  function updateChild(id: number, patch: Partial<ChildState>) {
    setChildren((c) => c.map((kid) => (kid.id === id ? { ...kid, ...patch } : kid)))
  }

  function digitsOf(s: string): number {
    return (s.match(/\d/g) || []).length
  }

  function validate(): boolean {
    const pErrors: ParentErrors = {}
    if (!fullName.trim()) pErrors.fullName = 'Your name is required.'
    if (!email.trim()) pErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) pErrors.email = 'Please enter a valid email.'
    if (!phone.trim()) pErrors.phone = 'Phone is required.'
    else if (digitsOf(phone) < 7) pErrors.phone = 'Please enter a valid phone number.'
    if (!city.trim()) pErrors.city = 'City is required.'
    if (!emergencyName.trim()) pErrors.emergencyName = 'Emergency contact name is required.'
    if (!emergencyPhone.trim()) pErrors.emergencyPhone = 'Emergency contact phone is required.'
    else if (digitsOf(emergencyPhone) < 7) pErrors.emergencyPhone = 'Please enter a valid phone number.'

    const cErrors: Record<number, ChildErrors> = {}
    children.forEach((kid) => {
      const ce: ChildErrors = {}
      if (!kid.fullName.trim()) ce.fullName = "Child's name is required."
      const ageNum = Number(kid.age)
      if (!kid.age.trim() || !Number.isInteger(ageNum)) {
        ce.age = 'Please enter an age.'
      } else if (ageNum < MIN_AGE || ageNum > MAX_AGE) {
        ce.age = `Ages ${MIN_AGE}–${MAX_AGE} only.`
      }
      if (Object.keys(ce).length) cErrors[kid.id] = ce
    })

    setParentErrors(pErrors)
    setChildErrors(cErrors)
    return Object.keys(pErrors).length === 0 && Object.keys(cErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setSubmitError(null)
    setSending(true)

    const payload = {
      parent: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
      },
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim(),
      },
      children: children.map((kid) => ({
        fullName: kid.fullName.trim(),
        age: Number(kid.age),
        allergies: kid.allergies.trim(),
        photoConsent: !!kid.photoConsent,
      })),
      notes: notes.trim(),
      website_confirm: honeypotRef.current?.value || '',
    }

    try {
      const res = await fetch('/api/event-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json().catch(() => ({}))

      if (res.ok && result.success) {
        const params = new URLSearchParams({
          name: fullName.split(' ')[0] || 'there',
          email,
          kids: String(children.length),
          total: String(total),
          ...(typeof result.reference === 'string' ? { ref: result.reference } : {}),
        })
        router.push(`${REGISTERED_PATH}?${params.toString()}`)
        return
      }

      if (result.fallback === 'mailto') {
        const subject = encodeURIComponent(`Base Camp Kids registration — ${fullName}`)
        const body = encodeURIComponent(
          `Parent: ${fullName} (${email}, ${phone}, ${city})\n` +
            `Emergency: ${emergencyName} ${emergencyPhone}\n` +
            children
              .map(
                (k, i) =>
                  `Child ${i + 1}: ${k.fullName}, age ${k.age}, allergies: ${k.allergies || 'none'}, photo consent: ${k.photoConsent ? 'yes' : 'no'}`,
              )
              .join('\n') +
            `\nNotes: ${notes || '—'}\nExpected total: ${formatNaira(total)}`,
        )
        window.open(`mailto:hello@campingnigeria.com?subject=${subject}&body=${body}`, '_self')
        return
      }

      if (res.status === 429) {
        setSubmitError("You've sent a few in a row. Please try again in a few minutes, or email hello@campingnigeria.com.")
        return
      }

      setSubmitError("We couldn't submit your registration. Please email hello@campingnigeria.com or try again.")
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again, or email hello@campingnigeria.com.")
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-dark/5 shadow-sm bg-white p-6 sm:p-8 md:p-10 flex flex-col gap-8"
      noValidate
    >
      {submitError && (
        <div
          role="alert"
          className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 leading-relaxed"
        >
          {submitError}
        </div>
      )}

      <Honeypot ref={honeypotRef} />

      {/* Parent block */}
      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-xl font-bold text-brand-dark mb-2">Parent or guardian</legend>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            id="parent-name"
            label="Full name"
            required
            value={fullName}
            onChange={setFullName}
            error={parentErrors.fullName}
            placeholder="e.g. Amara Okafor"
          />
          <Field
            id="parent-email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            error={parentErrors.email}
            placeholder="you@example.com"
          />
          <Field
            id="parent-phone"
            label="Phone (WhatsApp preferred)"
            type="tel"
            required
            value={phone}
            onChange={setPhone}
            error={parentErrors.phone}
            placeholder="+234 ..."
          />
          <Field
            id="parent-city"
            label="City"
            required
            value={city}
            onChange={setCity}
            error={parentErrors.city}
            placeholder="e.g. Abuja"
          />
        </div>
      </fieldset>

      {/* Emergency contact */}
      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-xl font-bold text-brand-dark mb-2">Emergency contact</legend>
        <p className="font-sans text-sm text-brand-dark/65 -mt-3 mb-1">
          Someone we can call if we can’t reach you on the day. Can be the same as you.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            id="emergency-name"
            label="Name"
            required
            value={emergencyName}
            onChange={setEmergencyName}
            error={parentErrors.emergencyName}
          />
          <Field
            id="emergency-phone"
            label="Phone"
            type="tel"
            required
            value={emergencyPhone}
            onChange={setEmergencyPhone}
            error={parentErrors.emergencyPhone}
          />
        </div>
      </fieldset>

      {/* Children repeater */}
      <fieldset className="flex flex-col gap-5">
        <legend className="font-serif text-xl font-bold text-brand-dark mb-2">
          Children attending
        </legend>
        <p className="font-sans text-sm text-brand-dark/65 -mt-3 mb-1">
          Ages {MIN_AGE} to {MAX_AGE}. Add up to {MAX_CHILDREN_PER_REGISTRATION} per registration.
          10% sibling discount applied automatically to every child after the first.
        </p>

        {children.map((kid, i) => {
          const errs = childErrors[kid.id] || {}
          return (
            <div
              key={kid.id}
              className="rounded-xl border border-brand-dark/10 bg-brand-light/60 p-5 sm:p-6 flex flex-col gap-4 relative"
            >
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable">
                  Child {i + 1}
                  {i > 0 && (
                    <span className="ml-2 text-brand-dark/55 normal-case tracking-normal text-[11px]">
                      · {formatNaira(Math.round(EARLY_BIRD_PRICE * 0.9))} (sibling)
                    </span>
                  )}
                </p>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(kid.id)}
                    className="inline-flex items-center gap-1 text-brand-dark/55 hover:text-red-600 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent rounded"
                    aria-label={`Remove child ${i + 1}`}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-[1fr_120px] gap-4">
                <Field
                  id={`child-${kid.id}-name`}
                  label="Full name"
                  required
                  value={kid.fullName}
                  onChange={(v) => updateChild(kid.id, { fullName: v })}
                  error={errs.fullName}
                />
                <Field
                  id={`child-${kid.id}-age`}
                  label="Age"
                  type="number"
                  required
                  value={kid.age}
                  onChange={(v) => updateChild(kid.id, { age: v })}
                  error={errs.age}
                  inputMode="numeric"
                  min={MIN_AGE}
                  max={MAX_AGE}
                />
              </div>

              <div>
                <label htmlFor={`child-${kid.id}-allergies`} className={labelBase}>
                  Allergies, dietary needs, or things we should know{' '}
                  <span className="text-brand-dark/40 font-normal">(Optional)</span>
                </label>
                <textarea
                  id={`child-${kid.id}-allergies`}
                  value={kid.allergies}
                  onChange={(e) => updateChild(kid.id, { allergies: e.target.value })}
                  rows={2}
                  placeholder="e.g. Nut allergy, vegetarian, asthma inhaler in bag"
                  className={inputBase + ' resize-none'}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={kid.photoConsent}
                  onChange={(e) => updateChild(kid.id, { photoConsent: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-brand-dark/30 text-brand-accent focus:ring-brand-accent"
                />
                <span className="font-sans text-sm text-brand-dark/85 leading-relaxed">
                  I give permission for my child to appear in Camping Nigeria photos and videos.
                  <span className="block text-xs text-brand-dark/55 mt-1">
                    Untick to opt out — your child will wear a blue wristband and our photographer
                    will keep them out of frame.
                  </span>
                </span>
              </label>
            </div>
          )
        })}

        {children.length < MAX_CHILDREN_PER_REGISTRATION && (
          <button
            type="button"
            onClick={addChild}
            className="self-start inline-flex items-center gap-2 px-5 py-3 bg-white border border-brand-dark/20 text-brand-dark font-sans font-semibold text-sm rounded-lg hover:border-brand-accent hover:text-brand-accent-readable transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add another child
          </button>
        )}
      </fieldset>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelBase}>
          Anything else we should know?{' '}
          <span className="text-brand-dark/40 font-normal">(Optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. Two of my kids would like to be in the same house as their cousin"
          className={inputBase + ' resize-none'}
        />
      </div>

      {/* Total + submit */}
      <div className="rounded-xl bg-brand-dark text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-brand-accent font-semibold mb-1">
            Total due (paid by invoice after registration)
          </p>
          <p className="font-serif text-3xl font-bold">{formatNaira(total)}</p>
          <p className="font-sans text-xs text-white/60 mt-1">
            {children.length} child{children.length === 1 ? '' : 'ren'} ·{' '}
            {children.length > 1 ? '10% sibling discount applied' : 'add a sibling for 10% off'}
          </p>
        </div>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center px-7 py-4 bg-brand-accent text-brand-dark font-sans font-semibold text-base rounded-lg hover:brightness-105 active:scale-[0.98] transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          {sending ? 'Sending...' : 'Reserve our seats'}
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: 'text' | 'email' | 'tel' | 'number'
  placeholder?: string
  error?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  min?: number
  max?: number
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
  error,
  inputMode,
  min,
  max,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && <span className="text-brand-accent ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        max={max}
        className={inputBase}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
