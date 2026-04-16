'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const tiers = [
  {
    name: 'Base Camp',
    tag: 'Equipment Only',
    price: 'From ₦3,000,000',
    description:
      'Equipment only. We deliver and collect tents, sleeping bags, mats, and lighting. Your school runs its own program.',
    bestFor: 'Schools that have facilitation covered.',
  },
  {
    name: 'Trail Ready',
    tag: 'Most Popular',
    price: 'From ₦5,000,000',
    description:
      'Equipment plus facilitation. Our team is on-site throughout. We design and run the outdoor program.',
    bestFor: 'Schools that want a structured program.',
  },
  {
    name: 'Summit Partner',
    tag: 'Fully Managed',
    price: 'From ₦8,000,000',
    description:
      'Fully managed. Equipment, facilitation, catering coordination, first aid, certificates, and documentation.',
    bestFor: 'Schools that want everything handled.',
  },
]

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

export default function ExpeditionTiers() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="what-we-provide" className="bg-brand-dark-tint">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          How We Work With Schools
        </motion.span>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            Three Ways to Work With Us
          </motion.h2>
        </div>

        <motion.p
          className="font-sans text-base leading-relaxed text-brand-dark/70 mt-5 text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
        >
          We offer three levels of support depending on how much your school wants to manage itself.
        </motion.p>
      </div>

      {/* Tier cards */}
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
              className={`relative rounded-xl border p-6 md:p-8 flex flex-col bg-white ${
                isPopular
                  ? 'border-brand-accent shadow-lg shadow-brand-accent/10 md:-translate-y-2'
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

              {/* Price */}
              <p className="font-sans text-base font-semibold text-brand-dark/80 mt-1 mb-4">
                {tier.price}
              </p>

              {/* Divider */}
              <div className="h-px bg-brand-dark/10 mb-5" />

              {/* Description */}
              <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
                {tier.description}
              </p>

              {/* Best For */}
              <div className="mt-6 pt-5 border-t border-brand-dark/10 flex-1 flex flex-col justify-end">
                <p className="text-xs font-semibold tracking-widest uppercase text-brand-dark/40 mb-2">
                  Best For
                </p>
                <p className="font-sans text-sm text-brand-dark/80 leading-relaxed">
                  {tier.bestFor}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Link below cards */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: premiumEase }}
      >
        <Link
          href="/schools"
          className="group inline-flex items-center gap-2 text-brand-dark font-sans font-semibold text-base border-b-2 border-brand-accent pb-1 hover:text-brand-accent-readable transition-colors duration-200"
        >
          See the full offer breakdown
          <ArrowRight className="w-4 h-4 text-brand-accent-readable transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>
    </Section>
  )
}
