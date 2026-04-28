'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import { SCHEDULE, EVENT_DATE_LABEL } from '@/lib/events/base-camp-kids'

export default function Schedule() {
  return (
    <Section id="schedule" className="bg-brand-light">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.span
            className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: premiumEase }}
          >
            The Day, Hour by Hour
          </motion.span>

          <div className="overflow-hidden mt-3">
            <motion.h2
              className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
            >
              Six hours of structured fun
            </motion.h2>
          </div>

          <motion.p
            className="font-sans text-base text-brand-dark/70 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
          >
            {EVENT_DATE_LABEL}
          </motion.p>
        </div>

        <motion.ol
          className="border-t border-brand-dark/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
        >
          {SCHEDULE.map((row) => (
            <li
              key={row.time}
              className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] gap-4 sm:gap-6 py-4 border-b border-brand-dark/10"
            >
              <span className="font-sans text-sm sm:text-base font-semibold text-brand-accent-readable tabular-nums">
                {row.time}
              </span>
              <span className="font-sans text-sm sm:text-base text-brand-dark/85 leading-relaxed">
                {row.block}
              </span>
            </li>
          ))}
        </motion.ol>
      </div>
    </Section>
  )
}
