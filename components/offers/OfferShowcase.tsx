'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import Section from '@/components/ui/Section'
import { containerVariants, premiumEase } from '@/lib/animation'
import { FactsStrip, OfferBody, OfferChip, OfferCta } from '@/components/offers/OfferDetail'
import type { OfferGroup, OfferPackage } from '@/lib/offers-data'

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: premiumEase } },
}

// ─── Expanded detail modal ──────────────────────────────────────────────────

function OfferModal({
  pkg,
  onClose,
}: {
  pkg: OfferPackage | null
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!pkg) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    // Move focus into the dialog so the keyboard doesn't stay behind it.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
    }
  }, [pkg, onClose])

  const headingId = pkg ? `offer-modal-${pkg.slug}` : undefined

  return (
    <AnimatePresence>
      {pkg && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={`Close ${pkg.name} details`}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-brand-light text-brand-dark hover:bg-brand-accent-tint flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="max-h-[88vh] sm:max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="px-6 md:px-8 pt-7 pr-16">
                <div className="mb-4">
                  <OfferChip label={pkg.chip} />
                </div>
                <h3
                  id={headingId}
                  className="font-serif text-2xl md:text-3xl font-bold text-brand-dark leading-tight text-balance"
                >
                  {pkg.name}
                </h3>
                <p className="font-sans text-base text-brand-dark/65 mt-2 text-pretty">
                  {pkg.summary}
                </p>
              </div>

              <div className="mt-6">
                <FactsStrip facts={pkg.facts} />
              </div>

              <div className="px-6 md:px-8 py-7">
                <OfferBody pkg={pkg} />
                <div className="mt-7">
                  <OfferCta cta={pkg.cta} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Compact feature card ───────────────────────────────────────────────────

function OfferCard({
  pkg,
  onOpen,
}: {
  pkg: OfferPackage
  onOpen: (pkg: OfferPackage, trigger: HTMLButtonElement) => void
}) {
  const format = pkg.facts[0]
  const price = pkg.facts[pkg.facts.length - 1]

  return (
    <motion.div variants={cardVariants}>
      <button
        type="button"
        onClick={(e) => onOpen(pkg, e.currentTarget)}
        aria-haspopup="dialog"
        className="group h-full w-full text-left bg-white border border-brand-dark/10 border-l-[5px] border-l-brand-dark rounded-r-xl p-6 flex flex-col hover:border-l-brand-accent hover:shadow-lg hover:shadow-brand-dark/5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        <OfferChip label={pkg.chip} />

        <h3 className="font-serif text-xl font-bold text-brand-dark leading-snug mt-4 text-balance">
          {pkg.name}
        </h3>

        <p className="font-sans text-sm text-brand-dark/60 leading-relaxed mt-2 flex-1 text-pretty">
          {pkg.summary}
        </p>

        {/* The two facts people scan for before opening anything */}
        <dl className="mt-5 pt-4 border-t border-brand-dark/10 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-1">
              {format.label}
            </dt>
            <dd className="font-sans text-sm font-semibold text-brand-dark/85">
              {format.value}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-1">
              {price.label}
            </dt>
            <dd className="font-sans text-sm font-bold text-brand-dark tabular-nums">
              {price.value}
            </dd>
          </div>
        </dl>

        <span className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-accent-readable">
          <Plus
            className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
            aria-hidden="true"
          />
          See what is included
        </span>
      </button>
    </motion.div>
  )
}

// ─── Section ────────────────────────────────────────────────────────────────

interface OfferShowcaseProps {
  group: OfferGroup
  /** Section eyebrow — defaults to the group's own */
  eyebrow?: string
  /** Section H2 */
  heading: string
  /** Lead paragraph under the heading */
  intro?: string
  /** Section background utility, to alternate against neighbouring sections */
  className?: string
  /** Extra links rendered under the grid, e.g. programme detail pages */
  footerLinks?: { label: string; href: string }[]
}

/**
 * Compact package cards for a market's own marketing page. Each card opens
 * the full offer in a modal rather than navigating away, so someone reading
 * /schools can price a programme without losing their place.
 *
 * The dedicated /offers/<group> page still renders every package inline —
 * this is the teaser, that is the reference.
 */
export default function OfferShowcase({
  group,
  eyebrow,
  heading,
  intro,
  className = 'bg-white',
  footerLinks,
}: OfferShowcaseProps) {
  const [active, setActive] = useState<OfferPackage | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-80px' })

  const handleOpen = useCallback((pkg: OfferPackage, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setActive(pkg)
  }, [])

  const handleClose = useCallback(() => {
    setActive(null)
    // Return focus to the card that opened the dialog.
    triggerRef.current?.focus()
  }, [])

  const columns =
    group.packages.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'

  return (
    <Section id={`${group.slug}-offers`} className={className}>
      <div className="max-w-2xl mb-12">
        <motion.p
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          {eyebrow ?? group.eyebrow}
        </motion.p>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.1 }}
          >
            {heading}
          </motion.h2>
        </div>

        {intro && (
          <motion.p
            className="font-sans text-base leading-relaxed text-brand-dark/70 mt-5 text-pretty"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
          >
            {intro}
          </motion.p>
        )}
      </div>

      <motion.div
        ref={gridRef}
        className={`grid grid-cols-1 ${columns} gap-6 items-stretch`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {group.packages.map((pkg) => (
          <OfferCard key={pkg.slug} pkg={pkg} onOpen={handleOpen} />
        ))}
      </motion.div>

      {footerLinks && footerLinks.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-brand-dark/60 hover:text-brand-dark underline underline-offset-4 decoration-brand-dark/20 hover:decoration-brand-accent transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <OfferModal pkg={active} onClose={handleClose} />
    </Section>
  )
}
