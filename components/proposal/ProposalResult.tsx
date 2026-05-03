'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, Send, Loader2, Home } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import type {
  ProposalResult as ProposalResultType,
  ContactInfo,
  CampDurationOverride,
} from '@/lib/proposal-engine'

interface Props {
  result: ProposalResultType
  contact: ContactInfo
  sent: boolean
  sending: boolean
  submitError: string | null
  /** When set, overrides the displayed programme title and tier duration —
   *  used for on-campus camp requests where the customer's date range
   *  produces a non-standard day count (1 day or 3+ days). */
  override: CampDurationOverride | null
  onSend: () => void
  onBack: () => void
}

export default function ProposalResult({
  result,
  contact,
  sent,
  sending,
  submitError,
  override,
  onSend,
  onBack,
}: Props) {
  const { program, tier } = result
  const programTitle = override?.title ?? program.title
  const tierDuration = override?.tierDuration ?? tier.duration
  const tierTag = override?.tierTag ?? tier.tag

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: premiumEase }}
        className="w-full max-w-2xl mx-auto text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-brand-accent" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-brand-dark mb-3">
          Proposal Request Sent
        </h2>
        <p className="font-sans text-base text-brand-dark/60 mb-2 max-w-md mx-auto">
          We&apos;ve received your request for the <strong>{programTitle}</strong> ({tier.name}) programme.
        </p>
        <p className="font-sans text-sm text-brand-dark/50 mb-2">
          A confirmation is on its way to <strong>{contact.email}</strong>, and our team will follow up within 48 hours.
        </p>
        <p className="font-sans text-sm text-brand-dark/50 mb-10">
          In the meantime, feel free to explore the rest of the site.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/schools/programs/${program.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-sans font-semibold text-sm rounded-lg hover:bg-brand-dark/90 active:scale-[0.98] transition-all duration-200"
          >
            Explore {program.title}
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
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: premiumEase }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
          Your Recommendation
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mt-2 mb-3 text-balance">
          {programTitle}
        </h2>
        <p className="font-sans text-base text-brand-dark/60 max-w-lg mx-auto">
          {program.subtitle}
        </p>
      </div>

      {/* Submit error banner */}
      {submitError && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: premiumEase }}
          className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-6 text-sm text-amber-900 leading-relaxed"
        >
          {submitError}
        </motion.div>
      )}

      {/* Recommendation card */}
      <div className="border border-brand-accent bg-brand-accent/5 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-accent-readable">
              Recommended Package
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-dark mt-1">
              {tier.name}
            </h3>
            <p className="font-sans text-sm text-brand-dark/60 mt-0.5">{tierDuration}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-brand-accent/20 text-brand-accent-readable text-xs font-semibold rounded-full">
            {tierTag}
          </span>
        </div>

        <div className="h-px bg-brand-dark/10 mb-6" />

        <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-dark/50 mb-4">
          What&apos;s Included
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tier.includes.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
              <span className="font-sans text-sm text-brand-dark/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact summary */}
      <div className="border border-brand-dark/10 rounded-xl p-5 mb-8">
        <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-dark/50 mb-3">
          Proposal Will Be Sent To
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-sm">
          <p><span className="text-brand-dark/40">School:</span> <span className="text-brand-dark font-medium">{contact.schoolName}</span></p>
          <p><span className="text-brand-dark/40">Contact:</span> <span className="text-brand-dark font-medium">{contact.contactName}</span></p>
          <p><span className="text-brand-dark/40">Email:</span> <span className="text-brand-dark font-medium">{contact.email}</span></p>
          <p><span className="text-brand-dark/40">Phone:</span> <span className="text-brand-dark font-medium">{contact.phone}</span></p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark/50 hover:text-brand-dark transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Details
        </button>
        <button
          type="button"
          onClick={onSend}
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
              <Send className="w-4 h-4" />
              Request This Proposal
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
