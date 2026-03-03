'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase, containerVariants, itemVariants } from '@/lib/animation'
import { ABOUT_WHAT_WE_DO } from '@/lib/media'
import { Tent, MapPin, Compass, Users } from 'lucide-react'

const pillars = [
  {
    icon: Tent,
    title: 'Quality Equipment',
    description:
      'We supply premium camping gear — tents, sleeping bags, cooking kits, and more — so you never have to worry about what to bring.',
  },
  {
    icon: MapPin,
    title: 'Trusted Locations',
    description:
      'Every site we use is scouted, risk-assessed, and verified. We only camp in locations we trust.',
  },
  {
    icon: Compass,
    title: 'Structured Experiences',
    description:
      'From arrival to departure, every experience is thoughtfully planned with activities, safety measures, and free time built in.',
  },
  {
    icon: Users,
    title: 'On-Ground Guidance',
    description:
      'Our team is always present — guiding, supporting, and making sure every detail is handled so you can focus on the experience.',
  },
]

export default function WhatWeDo() {
  return (
    <Section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Copy */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: premiumEase }}
        >
          <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            What We Do
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight">
            An End-to-End Outdoor System
          </h2>
          <p className="text-base leading-relaxed text-brand-dark/80">
            We occupy the space of high adventure and high accessibility —
            offering real outdoor immersion without the stress, fear, or
            complexity typically associated with camping in Nigeria.
          </p>

          {/* Pillars */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {pillars.map((pillar) => (
              <motion.div key={pillar.title} variants={itemVariants} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                  <pillar.icon className="w-5 h-5 text-brand-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-brand-dark">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-brand-dark/60 leading-relaxed mt-1">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: premiumEase, delay: 0.15 }}
        >
          <div
            className="absolute -bottom-4 -left-4 w-full h-full rounded-xl border-2 border-brand-accent"
            aria-hidden="true"
          />
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
            <Image
              src={ABOUT_WHAT_WE_DO.src}
              alt={ABOUT_WHAT_WE_DO.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
