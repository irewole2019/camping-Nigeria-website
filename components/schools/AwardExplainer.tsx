'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

export default function AwardExplainer() {
  return (
    <Section id="award" className="bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          About the Award
        </motion.span>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            What Is the Duke of Edinburgh Award?
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
            The Duke of Edinburgh Award — officially known in Nigeria as the International Award for Young People — is a globally recognised program that challenges young people across four areas: physical activity, skill development, voluntary service, and an outdoor expedition.
          </p>
          <p className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed">
            The Award is administered in Nigeria by the International Award Association Nigeria. To learn more about how the program works and how schools get accredited, visit:
          </p>
        </motion.div>

        {/* External links */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
        >
          <a
            href="https://intaward.org.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-brand-dark font-sans font-semibold text-base border-b-2 border-brand-accent pb-1 hover:text-brand-accent-readable transition-colors duration-200"
          >
            International Award Nigeria
            <ExternalLink className="w-4 h-4 text-brand-accent-readable transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
          <a
            href="https://www.dofe.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-brand-dark font-sans font-semibold text-base border-b-2 border-brand-accent pb-1 hover:text-brand-accent-readable transition-colors duration-200"
          >
            The Duke of Edinburgh&apos;s Award
            <ExternalLink className="w-4 h-4 text-brand-accent-readable transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </Section>
  )
}
