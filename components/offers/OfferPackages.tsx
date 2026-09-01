'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Section from '@/components/ui/Section'
import { containerVariants, premiumEase } from '@/lib/animation'
import { FactsStrip, OfferBody, OfferChip, OfferCta } from '@/components/offers/OfferDetail'
import type { OfferPackage } from '@/lib/offers-data'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
}

function PackageCard({ pkg }: { pkg: OfferPackage }) {
  const headingId = `offer-${pkg.slug}`

  return (
    <motion.article
      id={pkg.slug}
      aria-labelledby={headingId}
      variants={cardVariants}
      className="scroll-mt-24 bg-white border border-brand-dark/10 border-l-[6px] border-l-brand-dark rounded-r-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 md:px-8 pt-7">
        <div className="mb-4">
          <OfferChip label={pkg.chip} />
        </div>
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
        <OfferBody pkg={pkg} />
        <div className="mt-7">
          <OfferCta cta={pkg.cta} />
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
