'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { premiumEase } from '@/lib/animation'
import { ABOUT_MANIFESTO } from '@/lib/media'

const lines = [
  'Adventure should feel exciting, not risky.',
  'Nature should feel welcoming, not intimidating.',
  'With the right support, everyone can explore confidently.',
]

export default function Manifesto() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={ABOUT_MANIFESTO.src}
          alt={ABOUT_MANIFESTO.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/80" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.p
          className="text-sm font-sans font-semibold tracking-widest text-brand-accent uppercase mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: premiumEase }}
        >
          Our Manifesto
        </motion.p>

        <div className="flex flex-col gap-4">
          {lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug text-balance"
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.9,
                  ease: premiumEase,
                  delay: 0.15 + i * 0.12,
                }}
              >
                {line}
              </motion.p>
            </div>
          ))}
        </div>

        <motion.div
          className="w-16 h-1 bg-brand-accent rounded-full mt-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.7 }}
          aria-hidden="true"
        />

        <motion.p
          className="font-sans text-base md:text-lg text-white/70 max-w-2xl leading-relaxed mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.85 }}
        >
          Camping Nigeria exists to make outdoor experiences safe, accessible,
          and full of life — for individuals, teams, and students.
        </motion.p>
      </div>
    </section>
  )
}
