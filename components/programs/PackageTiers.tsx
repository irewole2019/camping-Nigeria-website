'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import type { PackageTier } from '@/lib/program-data'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
}

export default function PackageTiers({ tiers }: { tiers: PackageTier[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section className="bg-white">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Packages
        </motion.span>
        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            Choose Your Experience Level
          </motion.h2>
        </div>
      </div>

      <motion.div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {tiers.map((tier) => {
          const isPopular = tier.tag === 'Most Popular'
          return (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative rounded-xl border p-6 md:p-8 flex flex-col ${
                isPopular
                  ? 'border-brand-accent bg-brand-accent/5 shadow-lg shadow-brand-accent/10'
                  : 'border-brand-dark/10'
              }`}
            >
              {/* Tag */}
              <span
                className={`text-xs font-semibold tracking-widest uppercase ${
                  isPopular ? 'text-brand-accent-readable' : 'text-brand-dark/40'
                }`}
              >
                {tier.tag}
              </span>

              {/* Name */}
              <h3 className="font-serif text-2xl font-bold text-brand-dark mt-2">
                {tier.name}
              </h3>

              {/* Duration */}
              <p className="font-sans text-sm text-brand-dark/60 mt-1 mb-6">
                {tier.duration}
              </p>

              {/* Divider */}
              <div className="h-px bg-brand-dark/10 mb-6" />

              {/* Includes */}
              <ul className="space-y-3 flex-1">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-accent mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-sm text-brand-dark/70">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/schools/proposal"
                className={`mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg font-sans font-semibold text-sm transition-all duration-200 ${
                  isPopular
                    ? 'bg-brand-accent text-brand-dark hover:brightness-105 active:scale-[0.98]'
                    : 'bg-brand-dark text-white hover:bg-brand-dark/90 active:scale-[0.98]'
                }`}
              >
                Enquire About {tier.name}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
