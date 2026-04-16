'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const faqs = [
  {
    q: 'Are you an accredited Duke of Edinburgh or International Award operator?',
    a: 'No. We are an outdoor programming and equipment partner. We support schools in delivering the camping and outdoor activity components of the expedition. Your Award Coordinator or Licensed Operator confirms compliance with the Award framework.',
  },
  {
    q: 'Can you work with our school even if we are not yet running the Award?',
    a: 'Yes. We work with schools running the Award and schools that run outdoor enrichment programs, end-of-term camps, and leadership experiences.',
  },
  {
    q: 'What if we already have some of our own equipment?',
    a: 'We can provide facilitation and programming without the full equipment package. Tell us what you already have and we will build a quote around your actual needs.',
  },
  {
    q: 'How many students can you accommodate?',
    a: 'Our standard capacity is up to 100 students. Larger groups can be discussed.',
  },
  {
    q: 'How far in advance do we need to book?',
    a: 'We recommend six to eight weeks for full program packages and two to four weeks for equipment rental only.',
  },
]

export default function ExpeditionFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section id="faq" className="bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.span
            className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: premiumEase }}
          >
            Common Questions
          </motion.span>

          <div className="overflow-hidden mt-3">
            <motion.h2
              className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
        </div>

        {/* Accordion */}
        <motion.div
          className="border-t border-brand-dark/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={faq.q} className="border-b border-brand-dark/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-start justify-between gap-3 sm:gap-4 py-4 sm:py-5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent rounded-sm"
                >
                  <span className="font-serif text-base sm:text-lg md:text-xl font-semibold text-brand-dark group-hover:text-brand-accent-readable transition-colors duration-200 text-pretty">
                    {faq.q}
                  </span>
                  <motion.span
                    className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-light mt-0.5"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: premiumEase }}
                  >
                    <ChevronDown className="w-4 h-4 text-brand-dark" aria-hidden="true" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: premiumEase }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-0 sm:pr-12 font-sans text-sm sm:text-base text-brand-dark/75 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          <Link
            href="#assessment"
            className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-4 bg-brand-dark text-white font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            Book a Planning Call
          </Link>
          <Link
            href="/schools/proposal"
            className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-4 bg-transparent border-2 border-brand-dark text-brand-dark font-semibold rounded-lg text-base tracking-wide hover:bg-brand-dark hover:text-white active:scale-[0.98] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            Request a School Proposal
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}
