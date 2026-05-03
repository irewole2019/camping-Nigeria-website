'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Loader2, Home, Sparkles } from 'lucide-react'
import Section from '@/components/ui/Section'
import Honeypot from '@/components/ui/Honeypot'
import { premiumEase } from '@/lib/animation'
import {
  AWARD_LEVEL_LABELS,
  REQUESTER_LABELS,
  TIER_INTEREST_LABELS,
  type AwardLevel,
  type AwardProposalContact,
  type AwardProposalScheduling,
  type ParentAwardLevel,
  type RequesterType,
  type TierInterest,
} from '@/lib/award-proposal'

// ─── Shared styles ──────────────────────────────────────────────────────────

// text-base on mobile (16px) prevents iOS Safari auto-zoom on focus.
const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

const DEFAULT_START_TIME = '09:00'
const DEFAULT_END_TIME = '16:00'

const TIER_KEYS: TierInterest[] = ['base-camp', 'trail-ready', 'summit-partner', 'unsure']

// ─── State Types ────────────────────────────────────────────────────────────

interface FormErrors {
  schoolName?: string
  role?: string
  studentCount?: string
  awardLevels?: string
  studentSchool?: string
  studentClass?: string
  awardLevel?: string
  tierInterest?: string
  contactName?: string
  email?: string
  phone?: string
  scheduling?: string
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AwardProposalForm() {
  const searchParams = useSearchParams()
  const honeypotRef = useRef<HTMLInputElement>(null)

  const [requesterType, setRequesterType] = useState<RequesterType>('school')

  // School-path state
  const [schoolName, setSchoolName] = useState('')
  const [role, setRole] = useState('')
  const [studentCount, setStudentCount] = useState<number | null>(null)
  const [awardLevels, setAwardLevels] = useState<AwardLevel[]>([])

  // Parent-path state
  const [studentSchool, setStudentSchool] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [awardLevel, setAwardLevel] = useState<ParentAwardLevel>('unsure')

  // Shared
  const [tierInterest, setTierInterest] = useState<TierInterest>('unsure')
  const [scheduling, setScheduling] = useState<AwardProposalScheduling>({
    eventStartDate: '',
    eventStartTime: DEFAULT_START_TIME,
    eventEndDate: '',
    eventEndTime: DEFAULT_END_TIME,
  })
  const [notes, setNotes] = useState('')
  const [contact, setContact] = useState<AwardProposalContact>({
    contactName: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [today, setToday] = useState('')

  // Pre-fill tier from ?tier= URL param when arriving from the assessment.
  // Legitimate post-hydration state init — the URL param is only available
  // client-side; the SSR render starts with the default 'unsure' value.
  useEffect(() => {
    const t = searchParams.get('tier')
    if (t && (TIER_KEYS as readonly string[]).includes(t)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTierInterest(t as TierInterest)
    }
  }, [searchParams])

  // Today, post-hydration (avoids SSR/client mismatch near midnight).
  useEffect(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(`${y}-${m}-${d}`)
  }, [])

  function toggleAwardLevel(level: AwardLevel) {
    setAwardLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    )
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}

    if (requesterType === 'school') {
      if (!schoolName.trim()) errs.schoolName = 'School name is required.'
      if (!role.trim()) errs.role = 'Your role is required.'
      if (studentCount === null || studentCount < 1) {
        errs.studentCount = 'Please enter the number of students.'
      }
      if (awardLevels.length === 0) {
        errs.awardLevels = 'Pick at least one Award level.'
      }
    } else {
      if (!studentSchool.trim()) errs.studentSchool = "Your child's school is required."
      if (!studentClass.trim()) errs.studentClass = "Your child's class or year is required."
    }

    if (!contact.contactName.trim()) errs.contactName = 'Your name is required.'
    if (!contact.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = 'Please enter a valid email.'
    }
    if (!contact.phone.trim()) {
      errs.phone = 'Phone number is required.'
    } else if (contact.phone.replace(/\D/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number.'
    }

    if (scheduling.eventStartDate || scheduling.eventEndDate) {
      if (!scheduling.eventStartDate || !scheduling.eventEndDate) {
        errs.scheduling = 'Please pick both a start and end date, or clear both fields.'
      } else if (scheduling.eventEndDate < scheduling.eventStartDate) {
        errs.scheduling = 'End date must be on or after the start date.'
      }
    }

    return errs
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitError(null)
    setSending(true)

    const details =
      requesterType === 'school'
        ? {
            requesterType: 'school' as const,
            schoolName: schoolName.trim(),
            role: role.trim(),
            studentCount: studentCount as number,
            awardLevels,
          }
        : {
            requesterType: 'parent' as const,
            studentSchool: studentSchool.trim(),
            studentClass: studentClass.trim(),
            awardLevel,
          }

    const finalScheduling: AwardProposalScheduling = {
      eventStartDate: scheduling.eventStartDate,
      eventStartTime: scheduling.eventStartDate
        ? scheduling.eventStartTime || DEFAULT_START_TIME
        : '',
      eventEndDate: scheduling.eventEndDate,
      eventEndTime: scheduling.eventEndDate
        ? scheduling.eventEndTime || DEFAULT_END_TIME
        : '',
    }

    try {
      const res = await fetch('/api/award-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          details,
          tierInterest,
          scheduling: finalScheduling,
          notes: notes.trim(),
          contact: {
            contactName: contact.contactName.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
          },
          website_confirm: honeypotRef.current?.value || '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.success) {
        setSent(true)
        return
      }
      setSubmitError(
        'We couldn’t send your proposal request. Please try again, or email hello@campingnigeria.com directly.',
      )
    } catch {
      setSubmitError(
        'We couldn’t reach the server. Please check your connection and try again, or email hello@campingnigeria.com.',
      )
    } finally {
      setSending(false)
    }
  }

  // ─── Sent state ───────────────────────────────────────────────────────────

  if (sent) {
    return (
      <Section className="bg-brand-light">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: premiumEase }}
          className="w-full max-w-2xl mx-auto text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-3">
            Proposal Request Sent
          </h1>
          <p className="font-sans text-base text-brand-dark/70 mb-2 max-w-md mx-auto">
            Thank you. We&apos;ve received your Duke of Edinburgh proposal request.
          </p>
          <p className="font-sans text-sm text-brand-dark/60 mb-2">
            A confirmation is on its way to <strong>{contact.email}</strong>.
          </p>
          <p className="font-sans text-sm text-brand-dark/60 mb-10">
            Our team will reach out within <strong>48 hours</strong> with next steps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/schools/international-award"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-sans font-semibold text-sm rounded-lg hover:bg-brand-dark/90 active:scale-[0.98] transition-all duration-200"
            >
              Back to Duke of Edinburgh
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-dark/15 text-brand-dark font-sans font-semibold text-sm rounded-lg hover:bg-brand-dark/[0.03] active:scale-[0.98] transition-all duration-200"
            >
              Browse all school programmes
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-brand-dark/60 font-sans font-semibold text-sm rounded-lg hover:text-brand-dark hover:bg-brand-dark/[0.03] transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </motion.div>
      </Section>
    )
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  const showSchoolFields = requesterType === 'school'
  const showParentFields = requesterType === 'parent'

  return (
    <Section className="bg-brand-light">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: premiumEase }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 text-brand-accent-readable font-semibold text-sm uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Submit a Proposal Request
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight">
            Duke of Edinburgh Expedition Proposal
          </h1>
          <p className="mt-3 text-sm md:text-base text-brand-dark/70 font-sans leading-relaxed max-w-xl mx-auto">
            Tell us about your school or your child&apos;s expedition. Our team will reach out within 48 hours with a tailored proposal.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-brand-dark/5 shadow-sm bg-white p-6 md:p-10 flex flex-col gap-6"
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

          {/* Who are you? */}
          <fieldset>
            <legend className={labelBase}>
              Submitting as <span className="text-brand-accent">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['school', 'parent'] as const).map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                    requesterType === type
                      ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                      : 'border-brand-dark/10 hover:border-brand-dark/20 hover:bg-brand-dark/[0.02]'
                  }`}
                >
                  <input
                    type="radio"
                    name="requesterType"
                    value={type}
                    checked={requesterType === type}
                    onChange={() => setRequesterType(type)}
                    className="sr-only"
                  />
                  <span
                    className={`block font-sans text-sm ${
                      requesterType === type
                        ? 'text-brand-dark font-semibold'
                        : 'text-brand-dark/70'
                    }`}
                  >
                    {REQUESTER_LABELS[type]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* SCHOOL PATH */}
          {showSchoolFields && (
            <>
              <div>
                <label htmlFor="schoolName" className={labelBase}>
                  School name <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Greenfield Academy"
                  className={inputBase}
                  aria-invalid={!!errors.schoolName}
                />
                {errors.schoolName && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.schoolName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="role" className={labelBase}>
                  Your role <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Head Teacher, Award Coordinator"
                  className={inputBase}
                  aria-invalid={!!errors.role}
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.role}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="studentCount" className={labelBase}>
                  Number of students <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="studentCount"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={studentCount ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '') {
                      setStudentCount(null)
                      return
                    }
                    const n = parseInt(v, 10)
                    if (!Number.isFinite(n) || n < 1) return
                    setStudentCount(n)
                  }}
                  placeholder="e.g. 60"
                  className={inputBase + ' max-w-xs'}
                  aria-invalid={!!errors.studentCount}
                />
                {errors.studentCount && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.studentCount}
                  </p>
                )}
              </div>

              <fieldset>
                <legend className={labelBase}>
                  Award levels you want to run <span className="text-brand-accent">*</span>
                  <span className="ml-2 text-brand-dark/40 font-normal">
                    (pick one or more)
                  </span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['bronze', 'silver', 'gold'] as const).map((level) => {
                    const checked = awardLevels.includes(level)
                    return (
                      <label
                        key={level}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                          checked
                            ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                            : 'border-brand-dark/10 hover:border-brand-dark/20 hover:bg-brand-dark/[0.02]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="awardLevels"
                          value={level}
                          checked={checked}
                          onChange={() => toggleAwardLevel(level)}
                          className="sr-only"
                        />
                        <span
                          className={`block font-sans text-sm ${
                            checked ? 'text-brand-dark font-semibold' : 'text-brand-dark/70'
                          }`}
                        >
                          {AWARD_LEVEL_LABELS[level]}
                        </span>
                      </label>
                    )
                  })}
                </div>
                {errors.awardLevels && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.awardLevels}
                  </p>
                )}
              </fieldset>
            </>
          )}

          {/* PARENT PATH */}
          {showParentFields && (
            <>
              <div>
                <label htmlFor="studentSchool" className={labelBase}>
                  Your child&apos;s school <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="studentSchool"
                  type="text"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  placeholder="e.g. Lagos Preparatory School"
                  className={inputBase}
                  aria-invalid={!!errors.studentSchool}
                />
                {errors.studentSchool && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.studentSchool}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="studentClass" className={labelBase}>
                  Your child&apos;s class or year <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="studentClass"
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="e.g. SS 2"
                  className={inputBase}
                  aria-invalid={!!errors.studentClass}
                />
                {errors.studentClass && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.studentClass}
                  </p>
                )}
              </div>

              <fieldset>
                <legend className={labelBase}>
                  Award level <span className="text-brand-accent">*</span>
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['bronze', 'silver', 'gold', 'unsure'] as const).map((level) => (
                    <label
                      key={level}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                        awardLevel === level
                          ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                          : 'border-brand-dark/10 hover:border-brand-dark/20 hover:bg-brand-dark/[0.02]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="parentAwardLevel"
                        value={level}
                        checked={awardLevel === level}
                        onChange={() => setAwardLevel(level)}
                        className="sr-only"
                      />
                      <span
                        className={`block font-sans text-sm ${
                          awardLevel === level
                            ? 'text-brand-dark font-semibold'
                            : 'text-brand-dark/70'
                        }`}
                      >
                        {AWARD_LEVEL_LABELS[level]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* Tier interest (shared) */}
          <fieldset>
            <legend className={labelBase}>
              Tier interest <span className="text-brand-accent">*</span>
              <span className="ml-2 text-brand-dark/40 font-normal">
                (pick one or pick &ldquo;Not sure&rdquo;)
              </span>
            </legend>
            <div className="grid grid-cols-1 gap-2">
              {TIER_KEYS.map((tier) => (
                <label
                  key={tier}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                    tierInterest === tier
                      ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                      : 'border-brand-dark/10 hover:border-brand-dark/20 hover:bg-brand-dark/[0.02]'
                  }`}
                >
                  <input
                    type="radio"
                    name="tierInterest"
                    value={tier}
                    checked={tierInterest === tier}
                    onChange={() => setTierInterest(tier)}
                    className="sr-only"
                  />
                  <span
                    className={`block font-sans text-sm ${
                      tierInterest === tier
                        ? 'text-brand-dark font-semibold'
                        : 'text-brand-dark/70'
                    }`}
                  >
                    {TIER_INTEREST_LABELS[tier]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Preferred timing (optional) */}
          <div className="pt-2 border-t border-brand-dark/10">
            <p className="font-sans text-sm font-semibold text-brand-dark mb-1">
              When are you thinking?{' '}
              <span className="text-brand-dark/40 font-normal">(Optional)</span>
            </p>
            <p className="font-sans text-xs text-brand-dark/50 mb-4 leading-relaxed">
              Rough dates are fine — we&apos;ll firm up exact timing on our call.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventStartDate" className={labelBase}>
                  Start
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="eventStartDate"
                    type="date"
                    min={today}
                    value={scheduling.eventStartDate}
                    onChange={(e) =>
                      setScheduling((s) => ({ ...s, eventStartDate: e.target.value }))
                    }
                    aria-label="Preferred start date"
                    className={inputBase}
                  />
                  <input
                    id="eventStartTime"
                    type="time"
                    value={scheduling.eventStartTime}
                    onChange={(e) =>
                      setScheduling((s) => ({
                        ...s,
                        eventStartTime: e.target.value || DEFAULT_START_TIME,
                      }))
                    }
                    aria-label="Preferred start time"
                    className={inputBase}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="eventEndDate" className={labelBase}>
                  End
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="eventEndDate"
                    type="date"
                    min={scheduling.eventStartDate || today}
                    value={scheduling.eventEndDate}
                    onChange={(e) =>
                      setScheduling((s) => ({ ...s, eventEndDate: e.target.value }))
                    }
                    aria-label="Preferred end date"
                    className={inputBase}
                  />
                  <input
                    id="eventEndTime"
                    type="time"
                    value={scheduling.eventEndTime}
                    onChange={(e) =>
                      setScheduling((s) => ({
                        ...s,
                        eventEndTime: e.target.value || DEFAULT_END_TIME,
                      }))
                    }
                    aria-label="Preferred end time"
                    className={inputBase}
                  />
                </div>
              </div>
              {errors.scheduling && (
                <p className="sm:col-span-2 -mt-2 text-sm text-red-600" role="alert">
                  {errors.scheduling}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className={labelBase}>
              Anything else we should know?{' '}
              <span className="text-brand-dark/40 font-normal">(Optional)</span>
            </label>
            <textarea
              id="notes"
              rows={4}
              maxLength={4000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Group ages, prior outdoor experience, special considerations…"
              className={inputBase + ' resize-none'}
            />
          </div>

          {/* Contact (shared) */}
          <div className="pt-2 border-t border-brand-dark/10">
            <p className="font-sans text-sm font-semibold text-brand-dark mb-4">Your contact details</p>

            <div className="space-y-5">
              <div>
                <label htmlFor="contactName" className={labelBase}>
                  Your name <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contact.contactName}
                  onChange={(e) => setContact((c) => ({ ...c, contactName: e.target.value }))}
                  placeholder="e.g. Amara Okafor"
                  className={inputBase}
                  aria-invalid={!!errors.contactName}
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelBase}>
                  Email <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={inputBase}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelBase}>
                  Phone number{' '}
                  <span className="text-brand-dark/40 font-normal">(WhatsApp preferred)</span>{' '}
                  <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="e.g. 0704 053 8528"
                  className={inputBase}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/schools/international-award"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark/50 hover:text-brand-dark transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Award page
            </Link>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-accent text-brand-dark font-sans font-semibold text-sm rounded-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Proposal Request
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </Section>
  )
}
