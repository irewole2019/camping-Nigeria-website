'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import type { ScheduleItem } from '@/lib/program-data'

export default function SampleSchedule({
  label,
  items,
}: {
  label: string
  items: ScheduleItem[]
}) {
  return (
    <Section className="bg-brand-dark/[0.03]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Sample Schedule
        </motion.span>
        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            {label}
          </motion.h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {items.map((item, i) => {
          const isDivider = item.time === '—'

          if (isDivider) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-brand-accent/30" />
                  <span className="font-serif font-bold text-brand-accent-readable text-sm uppercase tracking-wider">
                    {item.activity}
                  </span>
                  <div className="h-px flex-1 bg-brand-accent/30" />
                </div>
              </motion.div>
            )
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: premiumEase, delay: i * 0.04 }}
              className="flex gap-6 py-3 group"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center w-20 flex-shrink-0">
                <span className="font-sans text-xs font-semibold text-brand-accent-readable whitespace-nowrap">
                  {item.time}
                </span>
              </div>

              {/* Dot + line */}
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent flex-shrink-0" />
                {i < items.length - 1 && items[i + 1].time !== '—' && (
                  <div className="w-px flex-1 bg-brand-dark/10 mt-1" />
                )}
              </div>

              {/* Activity */}
              <p className="font-sans text-sm text-brand-dark/70 pt-0.5 pb-2">
                {item.activity}
              </p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
