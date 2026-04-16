'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const provides = [
  'Camping equipment: tents, sleeping bags, sleeping mats, and lighting for up to 100 students',
  'Trained outdoor facilitators on-site throughout the program',
  'Structured outdoor programming: eco-awareness, team challenges, and guided outdoor skills sessions',
  'Safety protocols, risk assessments, and emergency contact documentation',
  'Parent communication packs pre-written and ready for your school to send',
  'A post-event debrief report for school leadership',
]

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const listItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: premiumEase } },
}

export default function OurRole() {
  const listRef = useRef<HTMLUListElement>(null)
  const listInView = useInView(listRef, { once: true, margin: '-80px' })

  return (
    <Section id="our-role" className="bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Our Role
        </motion.span>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            We Handle the Outdoor Delivery. You Handle the Award.
          </motion.h2>
        </div>

        <motion.p
          className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
        >
          Camping Nigeria is not an Award operator. We do not administer the International Award program or verify compliance with Award requirements. What we do is handle the outdoor component that makes expeditions real.
        </motion.p>

        {/* What we provide */}
        <motion.p
          className="font-sans text-sm font-semibold tracking-widest uppercase text-brand-dark/60 mt-10 mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          We Provide
        </motion.p>

        <motion.ul
          ref={listRef}
          className="space-y-4"
          variants={listContainer}
          initial="hidden"
          animate={listInView ? 'visible' : 'hidden'}
        >
          {provides.map((item) => (
            <motion.li
              key={item}
              variants={listItem}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/15 mt-0.5">
                <Check className="w-3.5 h-3.5 text-brand-accent-readable" strokeWidth={3} />
              </span>
              <span className="font-sans text-base text-brand-dark/80 leading-relaxed">
                {item}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Closing line */}
        <motion.p
          className="font-sans text-base md:text-lg text-brand-dark/80 leading-relaxed mt-10 pt-8 border-t border-brand-dark/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          Your school&apos;s Award Coordinator or Licensed Operator continues to manage the compliance side. <strong className="text-brand-dark font-semibold">We make the outdoor delivery happen.</strong>
        </motion.p>
      </div>
    </Section>
  )
}
