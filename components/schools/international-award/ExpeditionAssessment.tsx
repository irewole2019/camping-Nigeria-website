'use client'

import { useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from 'lucide-react'
import Section from '@/components/ui/Section'
import Honeypot from '@/components/ui/Honeypot'
import { premiumEase } from '@/lib/animation'
import { CALENDAR_BOOKING_URL } from '@/lib/constants'
import { getRecommendedTier, type AnswerKey } from '@/lib/expedition-recommendation'

// ─── Types ──────────────────────────────────────────────────────────────────

type Phase = 'capture' | 'questions' | 'submitting' | 'results'

interface LeadData {
  name: string
  email: string
  school: string
}

interface LeadErrors {
  name?: string
  email?: string
  school?: string
}

interface Question {
  id: string
  prompt: string
  options: { key: AnswerKey; label: string }[]
}

// ─── Questions ──────────────────────────────────────────────────────────────

const questions: Question[] = [
  {
    id: 'q1',
    prompt: 'Who are you planning this for?',
    options: [
      { key: 'A', label: 'I am a principal or teacher at a school' },
      { key: 'B', label: 'I am a parent whose child is doing the Award' },
      { key: 'C', label: 'I am an Award Coordinator looking for a partner' },
      { key: 'D', label: 'I am exploring options and not sure yet' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Is your school currently running the Duke of Edinburgh Award?',
    options: [
      { key: 'A', label: 'Yes, we are already running it' },
      { key: 'B', label: 'We are considering starting it' },
      { key: 'C', label: 'No, but we run other outdoor or enrichment programs' },
      { key: 'D', label: 'I am not sure' },
    ],
  },
  {
    id: 'q3',
    prompt: 'How many students are you thinking of including?',
    options: [
      { key: 'A', label: 'Under 30 students' },
      { key: 'B', label: '30 to 60 students' },
      { key: 'C', label: '60 to 100 students' },
      { key: 'D', label: 'More than 100 students' },
    ],
  },
  {
    id: 'q4',
    prompt: 'How much of the program does your school want to manage?',
    options: [
      { key: 'A', label: 'Equipment only — we will run the program ourselves' },
      { key: 'B', label: 'Equipment and facilitators — we need the program run for us' },
      { key: 'C', label: 'Everything managed — equipment, facilitation, safety, catering, and documentation' },
      { key: 'D', label: 'We are not sure yet — we need guidance' },
    ],
  },
]

// ─── Results preamble ───────────────────────────────────────────────────────

const EXPLORING_PREFIX =
  'Based on what you have shared, here is where most schools in your position start.'

// ─── Shared styles ──────────────────────────────────────────────────────────

// text-base on mobile (16px) prevents iOS Safari auto-zoom on focus.
const inputBase =
  'w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm text-brand-dark placeholder:text-brand-dark/40 outline-none transition-colors duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20'

const labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'

// ─── Component ──────────────────────────────────────────────────────────────

export default function ExpeditionAssessment() {
  const [phase, setPhase] = useState<Phase>('capture')
  const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', school: '' })
  const [leadErrors, setLeadErrors] = useState<LeadErrors>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({})
  const [submitError, setSubmitError] = useState(false)
  // Prevents double-advance from rapid clicks during the 400ms feedback delay
  const [isAdvancing, setIsAdvancing] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)

  // ─── Phase 1: Capture ─────────────────────────────────────────────────────

  function validateLead(): LeadErrors {
    const errors: LeadErrors = {}
    if (!leadData.name.trim()) errors.name = 'Please enter your name.'
    if (!leadData.email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!leadData.school.trim()) errors.school = 'Please enter your school or organisation name.'
    return errors
  }

  function handleCaptureSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors = validateLead()
    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors)
      return
    }
    setLeadErrors({})
    setPhase('questions')
    setCurrentQuestion(0)
  }

  // ─── Phase 2: Questions ───────────────────────────────────────────────────

  async function submitAssessment(finalAnswers: Record<string, AnswerKey>) {
    try {
      const res = await fetch('/api/assessment-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          school: leadData.school,
          answers: finalAnswers,
          website_confirm: honeypotRef.current?.value || '',
        }),
      })
      if (!res.ok) setSubmitError(true)
    } catch {
      setSubmitError(true)
    } finally {
      setPhase('results')
    }
  }

  function handleAnswer(key: AnswerKey) {
    // Guard: block follow-up clicks while the advance timeout is pending
    if (isAdvancing) return
    setIsAdvancing(true)

    const qid = questions[currentQuestion].id
    const nextAnswers = { ...answers, [qid]: key }
    setAnswers(nextAnswers)

    // Brief delay for visual feedback, then advance
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setSubmitError(false)
        setPhase('submitting')
        submitAssessment(nextAnswers)
      }
      setIsAdvancing(false)
    }, 400)
  }

  function handleBack() {
    if (isAdvancing) return

    if (phase === 'questions') {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1)
      } else {
        setPhase('capture')
      }
    } else if (phase === 'results') {
      setPhase('questions')
      setCurrentQuestion(questions.length - 1)
    }
  }

  function handleJumpToQuestion(index: number) {
    // Only allow jumping to questions that have been answered or the current one
    if (!isAdvancing && (index <= currentQuestion || answers[questions[index].id])) {
      setCurrentQuestion(index)
    }
  }

  function handleReset() {
    setPhase('capture')
    setCurrentQuestion(0)
    setAnswers({})
    setLeadData({ name: '', email: '', school: '' })
    setLeadErrors({})
    setSubmitError(false)
    setIsAdvancing(false)
  }

  // ─── Phase 3: Results ─────────────────────────────────────────────────────

  const q1Answer = answers[questions[0].id] as AnswerKey | undefined
  const q2Answer = answers[questions[1].id] as AnswerKey | undefined
  const q3Answer = answers[questions[2].id] as AnswerKey | undefined
  const q4Answer = answers[questions[3].id] as AnswerKey | undefined
  const recommendedTier = getRecommendedTier(q2Answer, q3Answer, q4Answer)
  const isExploring = q1Answer === 'D'

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Section id="assessment" className="bg-brand-accent-tint">
      <div className="max-w-2xl mx-auto">
        <Honeypot ref={honeypotRef} />

        {/* Section heading (persistent across phases) */}
        <div className="text-center mb-10">
          <motion.span
            className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: premiumEase }}
          >
            Find the Right Setup
          </motion.span>
          <div className="overflow-hidden mt-3">
            <motion.h2
              className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
            >
              Not Sure Which Option Fits Your School?
            </motion.h2>
          </div>
        </div>

        {/* Card */}
        <motion.div
          className="rounded-2xl bg-white shadow-lg shadow-brand-dark/5 border border-brand-dark/5 p-6 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: premiumEase, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {phase === 'capture' && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: premiumEase }}
              >
                <p className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-accent-readable">
                  Let&apos;s Find the Right Setup for Your School
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark text-balance mt-2 leading-tight">
                  Four quick questions. Your recommendation in under two minutes.
                </h3>

                <form onSubmit={handleCaptureSubmit} className="mt-8 flex flex-col gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="assessment-name" className={labelBase}>
                      Your name <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      id="assessment-name"
                      type="text"
                      required
                      value={leadData.name}
                      onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      placeholder="e.g. Amara Okafor"
                      className={inputBase}
                      aria-invalid={!!leadErrors.name}
                      aria-describedby={leadErrors.name ? 'assessment-name-error' : undefined}
                    />
                    {leadErrors.name && (
                      <p id="assessment-name-error" className="mt-1 text-sm text-red-600" role="alert">
                        {leadErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="assessment-email" className={labelBase}>
                      Your email address <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      id="assessment-email"
                      type="email"
                      required
                      value={leadData.email}
                      onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputBase}
                      aria-invalid={!!leadErrors.email}
                      aria-describedby={leadErrors.email ? 'assessment-email-error' : undefined}
                    />
                    {leadErrors.email && (
                      <p id="assessment-email-error" className="mt-1 text-sm text-red-600" role="alert">
                        {leadErrors.email}
                      </p>
                    )}
                  </div>

                  {/* School */}
                  <div>
                    <label htmlFor="assessment-school" className={labelBase}>
                      School or organisation name <span className="text-brand-accent">*</span>
                    </label>
                    <input
                      id="assessment-school"
                      type="text"
                      required
                      value={leadData.school}
                      onChange={(e) => setLeadData({ ...leadData, school: e.target.value })}
                      placeholder="e.g. Lagos Preparatory School"
                      className={inputBase}
                      aria-invalid={!!leadErrors.school}
                      aria-describedby={leadErrors.school ? 'assessment-school-error' : undefined}
                    />
                    {leadErrors.school && (
                      <p id="assessment-school-error" className="mt-1 text-sm text-red-600" role="alert">
                        {leadErrors.school}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-dark text-white font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                  >
                    Get My Recommendation
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </form>
              </motion.div>
            )}

            {phase === 'questions' && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: premiumEase }}
              >
                {/* Progress header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isAdvancing}
                    className="inline-flex items-center gap-1.5 text-brand-dark/60 hover:text-brand-dark font-sans text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back
                  </button>
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-accent-readable">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="grid grid-cols-4 gap-2 mb-8" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin={1} aria-valuemax={questions.length}>
                  {questions.map((q, i) => {
                    const isComplete = !!answers[q.id]
                    const isActive = i === currentQuestion
                    const isClickable = !isAdvancing && (i <= currentQuestion || isComplete)
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => isClickable && handleJumpToQuestion(i)}
                        disabled={!isClickable}
                        aria-label={`Go to question ${i + 1}`}
                        className="flex min-h-9 items-center"
                      >
                        <span
                          aria-hidden="true"
                          className={`block h-2 w-full rounded-full transition-colors duration-300 ${
                            isComplete || isActive ? 'bg-brand-accent' : 'bg-brand-dark/10'
                          } ${isClickable ? 'cursor-pointer hover:bg-brand-accent/80' : 'cursor-not-allowed'}`}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Question */}
                <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-dark text-balance leading-tight">
                  {questions[currentQuestion].prompt}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                  {questions[currentQuestion].options.map((option) => {
                    const isSelected = answers[questions[currentQuestion].id] === option.key
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleAnswer(option.key)}
                        disabled={isAdvancing}
                        aria-pressed={isSelected}
                        className={`group relative rounded-xl border-2 p-5 min-h-[88px] text-left transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed ${
                          isSelected
                            ? 'border-brand-accent bg-brand-accent-tint shadow-md'
                            : 'border-brand-dark/10 hover:border-brand-accent hover:bg-brand-accent-tint/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Option letter / checkmark */}
                          <span
                            className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full font-serif text-sm font-bold transition-colors duration-200 ${
                              isSelected
                                ? 'bg-brand-accent text-brand-dark'
                                : 'bg-brand-dark/5 text-brand-dark/60 group-hover:bg-brand-accent/20 group-hover:text-brand-dark'
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected ? <Check className="w-4 h-4" strokeWidth={3} /> : option.key}
                          </span>
                          <span className="font-sans text-sm md:text-base text-brand-dark/80 leading-snug pt-0.5">
                            {option.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {phase === 'submitting' && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: premiumEase }}
                className="text-center py-16"
                role="status"
                aria-live="polite"
              >
                <motion.span
                  className="inline-flex"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8 text-brand-accent-readable" aria-hidden="true" />
                </motion.span>
                <p className="mt-5 font-serif text-lg md:text-xl font-bold text-brand-dark">
                  Preparing your recommendation...
                </p>
                <p className="mt-2 font-sans text-sm text-brand-dark/60">
                  This will just take a moment.
                </p>
              </motion.div>
            )}

            {phase === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: premiumEase }}
              >
                {/* Non-blocking email-delivery failure notice */}
                {submitError && (
                  <motion.div
                    className="mb-6 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: premiumEase }}
                    role="alert"
                  >
                    <p className="font-sans text-sm text-amber-900 leading-relaxed">
                      We had trouble sending your confirmation email. Your results are below. Please email{' '}
                      <a
                        href="mailto:hello@campingnigeria.com"
                        className="font-semibold underline decoration-amber-700 underline-offset-2"
                      >
                        hello@campingnigeria.com
                      </a>{' '}
                      if you have any issues.
                    </p>
                  </motion.div>
                )}

                {/* Completion badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/15 text-brand-accent-readable mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: premiumEase, delay: 0.1 }}
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="font-sans text-xs font-semibold tracking-widest uppercase">
                    Assessment complete
                  </span>
                </motion.div>

                {/* Personalised prefix for "exploring" users */}
                {isExploring && (
                  <motion.p
                    className="font-sans text-base md:text-lg italic text-brand-dark/70 leading-relaxed mb-6 text-pretty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: premiumEase, delay: 0.15 }}
                  >
                    {EXPLORING_PREFIX}
                  </motion.p>
                )}

                {/* Eyebrow + tier name — prominent */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: premiumEase, delay: 0.2 }}
                >
                  <p className="font-sans text-sm font-semibold tracking-widest uppercase text-brand-accent-readable">
                    Your Recommended Setup
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mt-2 leading-tight text-balance">
                    {recommendedTier.name}
                  </h3>
                </motion.div>

                {/* Summary */}
                <motion.p
                  className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed mt-6 text-pretty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: premiumEase, delay: 0.3 }}
                >
                  {recommendedTier.summary}
                </motion.p>

                {/* Price bar */}
                <motion.div
                  className="mt-8 px-5 py-4 rounded-xl bg-brand-accent-tint border border-brand-accent/30"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: premiumEase, delay: 0.4 }}
                >
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-accent-readable">
                    Investment
                  </p>
                  <p className="font-serif text-lg md:text-xl font-bold text-brand-dark mt-1">
                    {recommendedTier.price}
                  </p>
                  <p className="font-sans text-xs text-brand-dark/60 mt-2 leading-relaxed">
                    {recommendedTier.priceNote}
                  </p>
                </motion.div>

                {/* What's Included */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: premiumEase, delay: 0.5 }}
                >
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-dark/60 mb-4">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-3">
                    {recommendedTier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/15 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-brand-accent-readable" strokeWidth={3} />
                        </span>
                        <span className="font-sans text-base text-brand-dark/80 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mt-10"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: premiumEase, delay: 0.6 }}
                >
                  {/* Primary — opens Outlook Bookings in a new tab (iframe embed not supported) */}
                  <a
                    href={CALENDAR_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                  >
                    Book a Call to Confirm This
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <Link
                    href="/schools/proposal"
                    className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-transparent border-2 border-brand-dark text-brand-dark font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark hover:text-white active:scale-[0.98] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                  >
                    Get a Proposal by Email
                  </Link>
                </motion.div>

                {/* Start again */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: premiumEase, delay: 0.75 }}
                >
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-brand-dark/60 hover:text-brand-dark font-sans text-sm font-semibold underline decoration-brand-dark/30 underline-offset-4 hover:decoration-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent rounded-sm"
                  >
                    Start again
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  )
}
