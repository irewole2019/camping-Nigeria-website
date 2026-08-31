'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import { containerVariants, premiumEase } from '@/lib/animation'
import type { OfferPackage } from '@/lib/offers-data'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
}

/**
 * The four-column data strip. The last fact is the price and gets the
 * emphasis treatment — it is the number people scan for.
 */
function FactsStrip({ facts }: { facts: OfferPackage['facts'] }) {
  const lastIndex = facts.length - 1

  return (
    // Container carries only the top rule; each cell carries its own bottom
    // rule, so the closing line falls out naturally at every breakpoint
    // without double borders. Vertical dividers appear only at lg, where the
    // strip is a single row and the math is unambiguous.
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-brand-dark/10 lg:border-b">
      {facts.map((fact, index) => {
        const isPrice = index === lastIndex
        const dividers = [
          'border-b border-brand-dark/10 lg:border-b-0',
          index < lastIndex ? 'lg:border-r lg:border-brand-dark/10' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={fact.label} className={`px-6 md:px-8 py-4 ${dividers}`}>
            <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-1.5">
              {fact.label}
            </dt>
            <dd
              className={
                isPrice
                  ? 'font-sans text-base font-bold text-brand-dark tabular-nums'
                  : 'font-sans text-[15px] font-semibold text-brand-dark/85'
              }
            >
              {fact.value}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function PackageCard({ pkg }: { pkg: OfferPackage }) {
  const isExternal = pkg.cta.href.startsWith('http')
  const headingId = `offer-${pkg.slug}`

  const ctaClassName =
    'inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-sans font-semibold text-sm rounded-lg tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark'

  return (
    <motion.article
      id={pkg.slug}
      aria-labelledby={headingId}
      variants={cardVariants}
      className="scroll-mt-24 bg-white border border-brand-dark/10 border-l-[6px] border-l-brand-dark rounded-r-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 md:px-8 pt-7">
        <span className="inline-block bg-brand-accent text-brand-dark font-sans text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 mb-4">
          {pkg.chip}
        </span>
        <h3
          id={headingId}
          className="font-serif text-2xl md:text-3xl font-bold text-brand-dark leading-tight text-balance"
        >
          {pkg.name}
        </h3>
        <p className="font-sans text-base text-brand-dark/65 mt-2 max-w-2xl text-pretty">
          {pkg.summary}
        </p>
      </div>

      <div className="mt-6">
        <FactsStrip facts={pkg.facts} />
      </div>

      {/* Body */}
      <div className="px-6 md:px-8 py-7">
        {pkg.buildsOn && (
          <p className="font-sans text-sm font-semibold text-brand-dark bg-brand-dark-tint border-l-[3px] border-brand-accent px-4 py-2.5 mb-6">
            {pkg.buildsOn}
          </p>
        )}

        <h4 className="inline-block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark pb-2 mb-4 border-b-2 border-brand-accent">
          What is included
        </h4>

        <ul className="sm:columns-2 sm:gap-x-10 space-y-2.5">
          {pkg.includes.map((item) => (
            <li
              key={item}
              className="relative pl-5 font-sans text-[15px] text-brand-dark/75 leading-relaxed break-inside-avoid"
            >
              <span
                className="absolute left-0 top-[0.55em] w-[7px] h-[7px] bg-brand-accent"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>

        {/* Notes: what the client provides, add-ons, price breakdown */}
        {pkg.notes.length > 0 && (
          <div className="mt-7 pt-5 border-t border-brand-dark/10 space-y-2">
            {pkg.notes.map((note) => (
              <p
                key={note.label}
                className="font-sans text-sm text-brand-dark/60 leading-relaxed"
              >
                <span className="font-semibold text-brand-dark/85">{note.label}:</span>{' '}
                {note.body}
              </p>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-7">
          {isExternal ? (
            <a
              href={pkg.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
            >
              {pkg.cta.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          ) : (
            <Link href={pkg.cta.href} className={ctaClassName}>
              {pkg.cta.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function OfferPackages({
  packages,
  intro,
}: {
  packages: OfferPackage[]
  intro: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="packages" className="bg-brand-light">
      <div className="max-w-3xl mb-12">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Packages
        </motion.span>

        <motion.p
          className="font-sans text-lg leading-relaxed text-brand-dark/75 mt-4 text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.15 }}
        >
          {intro}
        </motion.p>
      </div>

      <motion.div
        ref={ref}
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {packages.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} />
        ))}
      </motion.div>
    </Section>
  )
}
