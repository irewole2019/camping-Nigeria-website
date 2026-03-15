'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import type { ProgramData } from '@/lib/program-data'

export default function ProgramOverview({ data }: { data: ProgramData }) {
  return (
    <Section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Overview text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <span className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            Program Overview
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mt-3 mb-6 text-balance leading-tight">
            What This Program Delivers
          </h2>
          <p className="font-sans text-base leading-relaxed text-brand-dark/70 text-pretty">
            {data.overview}
          </p>

          {/* Delivery formats */}
          <div className="mt-8 space-y-4">
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-brand-dark/50">
              Delivery Formats
            </h3>
            {data.formats.map((f) => (
              <div key={f.label} className="border-l-2 border-brand-accent pl-4">
                <p className="font-sans font-semibold text-brand-dark text-sm">{f.label}</p>
                <p className="font-sans text-sm text-brand-dark/60">{f.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick stats + audience */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.15 }}
          className="space-y-10"
        >
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-brand-dark/[0.03] rounded-xl p-5 text-center"
              >
                <p className="font-serif text-2xl md:text-3xl font-bold text-brand-dark">
                  {stat.value}
                </p>
                <p className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-dark/50 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Audience */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-widest uppercase text-brand-dark/50 mb-4">
              Designed For
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.audience.map((a) => (
                <span
                  key={a}
                  className="inline-block px-3 py-1.5 bg-brand-accent/10 text-brand-accent-readable text-sm font-medium rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
