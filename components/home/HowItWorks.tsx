'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Section from '@/components/ui/Section'

const customEase = [0.22, 1, 0.36, 1] as const

const steps = [
  'Consultation with School Leadership',
  'Program Customization and Safety Planning',
  'Permissions and Parental Communication',
  'Camp Execution Within School Grounds or Approved Locations',
  'Post-Camp Report and Impact Summary',
]

const stepVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: customEase },
  },
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.6'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <Section id="how-it-works" className="bg-brand-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: customEase }}
        className="text-center mb-16"
      >
        <span className="inline-block text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable mb-4">
          Our Process
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight">
          How It Works
        </h2>
      </motion.div>

      <div ref={containerRef} className="relative max-w-2xl mx-auto" style={{ position: 'relative' }}>
        {/* Animated vertical track */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-brand-dark/10" aria-hidden="true" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-[27px] top-0 w-px bg-brand-accent origin-top"
          aria-hidden="true"
        />

        <ol className="relative flex flex-col gap-10">
          {steps.map((step, index) => (
            <motion.li
              key={step}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6"
            >
              {/* Step number badge */}
              <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-brand-accent shadow-sm">
                <span className="font-serif font-bold text-lg text-brand-dark leading-none">
                  {index + 1}
                </span>
              </div>

              {/* Step text */}
              <div className="pt-3">
                <p className="font-sans text-base md:text-lg font-medium text-brand-dark leading-relaxed">
                  {step}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
