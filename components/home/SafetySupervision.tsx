'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Users, FileText } from 'lucide-react'
import Section from '@/components/ui/Section'

const premiumEase = [0.16, 1, 0.3, 1]

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Trained Facilitators',
    body: 'Safety is our highest priority. Our facilitators are trained in child supervision and first aid.',
  },
  {
    icon: Users,
    title: 'Clear Ratios & Protocols',
    body: 'We maintain clear staff-to-child ratios, structured schedules, emergency protocols, and close coordination with school management.',
  },
  {
    icon: FileText,
    title: 'Transparent Consent',
    body: 'Comprehensive consent processes and clear communication ensure transparency and trust.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: premiumEase },
  },
}

export default function SafetySupervision() {
  return (
    <Section id="safety" className="bg-brand-dark relative overflow-hidden">
      {/* Subtle SVG flow path in the background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M -100 300 Q 200 80 500 320 Q 800 560 1100 260 Q 1400 -40 1700 300 Q 2000 560 2200 300"
          fill="none"
          stroke="#e6b325"
          strokeWidth="1.5"
          strokeOpacity="0.1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M -100 460 Q 300 220 600 440 Q 900 660 1200 400 Q 1500 140 1800 460"
          fill="none"
          stroke="#e6b325"
          strokeWidth="1"
          strokeOpacity="0.07"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 4, ease: 'easeInOut', delay: 0.4 }}
        />
      </svg>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: premiumEase }}
        className="text-center mb-14 relative"
      >
        <span className="inline-block text-xs font-sans font-semibold tracking-widest uppercase text-brand-accent mb-4">
          Built on Trust
        </span>
        {/* Masked H2 reveal */}
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-light text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            Safety &amp; Supervision
          </motion.h2>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
      >
        {pillars.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            className="flex flex-col items-center text-center gap-5 p-8 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-accent/15">
              <Icon className="w-7 h-7 text-brand-accent" strokeWidth={1.75} />
            </div>
            <h3 className="font-serif text-lg font-semibold text-brand-light">{title}</h3>
            <p className="font-sans text-sm leading-relaxed text-brand-light/70">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
