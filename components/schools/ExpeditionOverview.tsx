'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

export default function ExpeditionOverview() {
  return (
    <Section id="expedition" className="bg-brand-light">
      <div className="max-w-3xl mx-auto">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          The Expedition
        </motion.span>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            What the Expedition Actually Involves
          </motion.h2>
        </div>

        <motion.div
          className="flex flex-col gap-5 mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
        >
          <p className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed">
            The expedition is the outdoor component of the Award. Students plan and carry out a journey in a natural environment — usually over one to four days depending on the Award level. They camp overnight, navigate their route, and complete the journey as a team.
          </p>
          <p className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed">
            For Bronze level, this is typically a two-day, one-night expedition. Silver and Gold levels involve longer journeys with higher demands.
          </p>
          <p className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed">
            Schools are responsible for ensuring students are prepared and that the expedition meets Award requirements. That preparation involves planning routes, sourcing equipment, arranging facilitation, and making sure the outdoor experience is safe and structured.
          </p>
          <p className="font-sans text-lg md:text-xl font-semibold text-brand-dark leading-relaxed border-l-4 border-brand-accent pl-5 mt-2">
            Most schools find this the hardest part to execute well. That is where we come in.
          </p>
        </motion.div>
      </div>
    </Section>
  )
}
