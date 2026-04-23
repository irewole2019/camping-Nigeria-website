'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import {
  scoreAnswers,
  formatEmailBody,
  formatEmailSubject,
  type ProposalAnswers,
  type ContactInfo,
  type ProposalResult as ProposalResultData,
} from '@/lib/proposal-engine'
import Honeypot from '@/components/ui/Honeypot'
import ProposalResultView from './ProposalResult'

// ─── Shared Styles ──────────────────────────────────────────────────────────

// text-base on mobile (16px) prevents iOS Safari auto-zoom on focus.
const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

// ─── Question Definitions ───────────────────────────────────────────────────

interface Option {
  value: string
  label: string
}

interface QuestionDef {
  key: keyof ProposalAnswers
  question: string
  subtitle: string
  options: Option[]
  multi?: boolean
  maxSelect?: number
}

const QUESTIONS: QuestionDef[] = [
  {
    key: 'schoolType',
    question: 'What type of school are you?',
    subtitle: 'This helps us tailor the experience to your environment.',
    options: [
      { value: 'primary', label: 'Primary School' },
      { value: 'secondary', label: 'Secondary School' },
      { value: 'mixed', label: 'Mixed (Primary & Secondary)' },
      { value: 'university', label: 'University or College' },
    ],
  },
  {
    key: 'classLevel',
    question: 'What class level are the participants?',
    subtitle: 'We adapt content, intensity, and supervision for each age group.',
    options: [
      { value: 'primary-1-3', label: 'Primary 1 – 3' },
      { value: 'primary-4-6', label: 'Primary 4 – 6' },
      { value: 'jss-1-3', label: 'JSS 1 – 3' },
      { value: 'ss-1-3', label: 'SS 1 – 3' },
      { value: 'mixed', label: 'Mixed Levels' },
    ],
  },
  {
    key: 'groupSize',
    question: 'How many students will participate?',
    subtitle: 'Group size determines logistics, staffing, and activity stations.',
    options: [
      { value: 'under-40', label: 'Under 40' },
      { value: '40-80', label: '40 – 80' },
      { value: '80-150', label: '80 – 150' },
      { value: '150+', label: '150+' },
    ],
  },
  {
    key: 'primaryGoal',
    question: 'What is the primary goal of this experience?',
    subtitle: 'This is the biggest factor in matching you to the right program.',
    options: [
      { value: 'team-bonding', label: 'Team bonding & school community' },
      { value: 'eco-creativity', label: 'Environmental awareness & creativity' },
      { value: 'leadership', label: 'Student leadership & character development' },
      { value: 'celebration', label: 'End-of-term celebration or reward' },
    ],
  },
  {
    key: 'participantType',
    question: 'Are the participants general students or student leaders?',
    subtitle: 'Leadership-focused programs work best with student leaders and prefects.',
    options: [
      { value: 'general', label: 'General student body' },
      { value: 'leaders', label: 'Prefects, captains, or council members' },
      { value: 'mix', label: 'A mix of both' },
    ],
  },
  {
    key: 'duration',
    question: 'How much time can you dedicate?',
    subtitle: 'Longer experiences allow for deeper immersion and more activities.',
    options: [
      { value: 'half-day', label: 'Half day (3 – 4 hours)' },
      { value: 'full-day', label: 'Full day (6 – 8 hours)' },
      { value: '2-days', label: '2 days' },
    ],
  },
  {
    key: 'venue',
    question: 'Where would you prefer the experience?',
    subtitle: 'On-campus keeps things convenient. Off-campus adds adventure.',
    options: [
      { value: 'on-campus', label: 'On our school campus' },
      { value: 'off-campus', label: 'Off-campus outdoor venue' },
      { value: 'either', label: 'Either works' },
    ],
  },
  {
    key: 'activities',
    question: 'Which activities interest you most?',
    subtitle: 'Pick up to 3. This helps us fine-tune the recommendation.',
    multi: true,
    maxSelect: 3,
    options: [
      { value: 'camping-tents', label: 'Camping & tent setup' },
      { value: 'adire-crafts', label: 'Adire tie-dye & cultural crafts' },
      { value: 'sports-games', label: 'Sports & team games' },
      { value: 'leadership-challenges', label: 'Leadership challenges & simulations' },
      { value: 'eco-nature', label: 'Eco-awareness & nature walks' },
      { value: 'bonfire-stories', label: 'Bonfire & storytelling' },
      { value: 'journaling', label: 'Journaling & reflection' },
    ],
  },
]

const TOTAL_STEPS = QUESTIONS.length + 1 // +1 for contact info

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProposalForm() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<ProposalAnswers>>({})
  const [contact, setContact] = useState<Partial<ContactInfo>>({})
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({})
  const [result, setResult] = useState<ProposalResultData | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const isQuestionStep = step < QUESTIONS.length
  const isContactStep = step === QUESTIONS.length
  const currentQuestion = isQuestionStep ? QUESTIONS[step] : null

  // Check if current step has a valid answer
  const canAdvance = (() => {
    if (isContactStep) return false // handled by its own submit
    if (!currentQuestion) return false
    const val = answers[currentQuestion.key]
    if (currentQuestion.multi) return Array.isArray(val) && val.length > 0
    return val !== undefined
  })()

  function selectOption(key: keyof ProposalAnswers, value: string, multi?: boolean, maxSelect?: number) {
    setAnswers((prev) => {
      if (multi) {
        const current = (prev[key] as string[] | undefined) || []
        if (current.includes(value)) {
          return { ...prev, [key]: current.filter((v) => v !== value) }
        }
        if (maxSelect && current.length >= maxSelect) return prev
        return { ...prev, [key]: [...current, value] }
      }
      return { ...prev, [key]: value }
    })
  }

  function handleNext() {
    if (!canAdvance) return
    // Auto-advance for single-select (skip the "Next" click)
    setStep((s) => s + 1)
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  function handleSingleSelect(key: keyof ProposalAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    // Auto-advance after a short delay for single-select
    setTimeout(() => setStep((s) => s + 1), 200)
  }

  function validateContact(): boolean {
    const errs: Partial<Record<keyof ContactInfo, string>> = {}
    if (!contact.contactName?.trim()) errs.contactName = 'Name is required.'
    if (!contact.schoolName?.trim()) errs.schoolName = 'School name is required.'
    if (!contact.email?.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = 'Please enter a valid email.'
    }
    if (!contact.phone?.trim()) errs.phone = 'Phone number is required.'
    setContactErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleContactSubmit() {
    if (!validateContact()) return
    const fullAnswers = answers as ProposalAnswers
    const scored = scoreAnswers(fullAnswers)
    setResult(scored)
    setStep((s) => s + 1)
  }

  async function handleSendProposal() {
    if (!result) return
    setSending(true)

    const fullContact = contact as ContactInfo
    const fullAnswers = answers as ProposalAnswers

    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: fullAnswers,
          contact: fullContact,
          website_confirm: honeypotRef.current?.value || '',
        }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        // Fallback to mailto
        const subject = formatEmailSubject(fullContact)
        const body = formatEmailBody(fullAnswers, fullContact, result)
        window.location.href = `mailto:hello@campingnigeria.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        setSent(true)
      }
    } catch {
      // Fallback to mailto
      const subject = formatEmailSubject(contact as ContactInfo)
      const body = formatEmailBody(fullAnswers, contact as ContactInfo, result)
      window.location.href = `mailto:hello@campingnigeria.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  // ─── Result Screen ──────────────────────────────────────────────────────

  if (result) {
    return (
      <ProposalResultView
        result={result}
        contact={contact as ContactInfo}
        sent={sent}
        sending={sending}
        onSend={handleSendProposal}
        onBack={() => { setResult(null); setStep(QUESTIONS.length) }}
      />
    )
  }

  // ─── Form Steps ─────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Honeypot ref={honeypotRef} />

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-semibold text-brand-dark/40 uppercase tracking-widest">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <span className="font-sans text-xs text-brand-dark/40">
            {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-brand-dark/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: premiumEase }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isQuestionStep && currentQuestion && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: premiumEase }}
          >
            {/* Question */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mb-2 text-balance">
              {currentQuestion.question}
            </h2>
            <p className="font-sans text-sm text-brand-dark/60 mb-8">
              {currentQuestion.subtitle}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const val = answers[currentQuestion.key]
                const isSelected = currentQuestion.multi
                  ? Array.isArray(val) && (val as string[]).includes(opt.value)
                  : val === opt.value

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (currentQuestion.multi) {
                        selectOption(currentQuestion.key, opt.value, true, currentQuestion.maxSelect)
                      } else {
                        handleSingleSelect(currentQuestion.key, opt.value)
                      }
                    }}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                        : 'border-brand-dark/10 hover:border-brand-dark/20 hover:bg-brand-dark/[0.02]'
                    }`}
                  >
                    <span className={`font-sans text-sm ${isSelected ? 'text-brand-dark font-semibold' : 'text-brand-dark/70'}`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-brand-accent flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Multi-select hint */}
            {currentQuestion.multi && (
              <p className="font-sans text-xs text-brand-dark/40 mt-3">
                {(answers[currentQuestion.key] as string[] | undefined)?.length || 0} of {currentQuestion.maxSelect} selected
              </p>
            )}
          </motion.div>
        )}

        {isContactStep && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: premiumEase }}
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mb-2 text-balance">
              Tell us about your school
            </h2>
            <p className="font-sans text-sm text-brand-dark/60 mb-8">
              We&apos;ll use this to prepare a personalised proposal for you.
            </p>

            <div className="space-y-5">
              <div>
                <label htmlFor="contactName" className={labelBase}>
                  Your Name <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={contact.contactName || ''}
                  onChange={(e) => setContact((c) => ({ ...c, contactName: e.target.value }))}
                  placeholder="e.g. Amara Okafor"
                  className={inputBase}
                />
                {contactErrors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{contactErrors.contactName}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className={labelBase}>Role</label>
                <input
                  id="role"
                  type="text"
                  value={contact.role || ''}
                  onChange={(e) => setContact((c) => ({ ...c, role: e.target.value }))}
                  placeholder="e.g. Head Teacher, Activities Coordinator"
                  className={inputBase}
                />
              </div>

              <div>
                <label htmlFor="schoolName" className={labelBase}>
                  School Name <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={contact.schoolName || ''}
                  onChange={(e) => setContact((c) => ({ ...c, schoolName: e.target.value }))}
                  placeholder="e.g. Greenfield Academy"
                  className={inputBase}
                />
                {contactErrors.schoolName && (
                  <p className="mt-1 text-sm text-red-600">{contactErrors.schoolName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelBase}>
                  Email <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  placeholder="you@school.edu.ng"
                  className={inputBase}
                />
                {contactErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{contactErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelBase}>
                  Phone Number <span className="text-brand-accent">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={contact.phone || ''}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="+234 xxx xxx xxxx"
                  className={inputBase}
                />
                {contactErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{contactErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="website" className={labelBase}>School Website</label>
                <input
                  id="website"
                  type="url"
                  value={contact.website || ''}
                  onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))}
                  placeholder="https://www.yourschool.edu.ng"
                  className={inputBase}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark/50 hover:text-brand-dark transition-colors duration-200 disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {isQuestionStep && currentQuestion?.multi && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-dark text-white font-sans font-semibold text-sm rounded-lg hover:bg-brand-dark/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {isContactStep && (
          <button
            type="button"
            onClick={handleContactSubmit}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-brand-dark font-sans font-semibold text-sm rounded-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200"
          >
            See My Recommendation
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
