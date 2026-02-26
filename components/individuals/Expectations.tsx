'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase, containerVariants, itemVariants } from '@/lib/animation'
import { INDIVIDUALS_EXPECTATIONS } from '@/lib/media'

const cards = [
  {
    image: INDIVIDUALS_EXPECTATIONS[0].src,
    alt: INDIVIDUALS_EXPECTATIONS[0].alt,
    title: 'Guided camping experiences',
    description: 'Expert-led expeditions that take the guesswork out of the wild.',
  },
  {
    image: INDIVIDUALS_EXPECTATIONS[1].src,
    alt: INDIVIDUALS_EXPECTATIONS[1].alt,
    title: 'Safe and verified locations',
    description: 'Every site is scouted, risk-assessed, and approved before your visit.',
  },
  {
    image: INDIVIDUALS_EXPECTATIONS[2].src,
    alt: INDIVIDUALS_EXPECTATIONS[2].alt,
    title: 'Equipment provided',
    description: 'Quality gear included — just show up ready to experience nature.',
  },
  {
    image: INDIVIDUALS_EXPECTATIONS[3].src,
    alt: INDIVIDUALS_EXPECTATIONS[3].alt,
    title: 'Structured yet exciting itineraries',
    description: 'Balanced programmes with planned activities and free exploration time.',
  },
  {
    image: INDIVIDUALS_EXPECTATIONS[4].src,
    alt: INDIVIDUALS_EXPECTATIONS[4].alt,
    title: 'Community-driven experiences',
    description: 'Meet like-minded individuals and build lasting connections outdoors.',
  },
]

export default function Expectations() {
  return (
    <Section className="bg-brand-light">
      {/* Heading */}
      <div className="mb-12 max-w-xl">
        <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable mb-3">
          What to expect
        </p>
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: premiumEase }}
          >
            What You Can Expect
          </motion.h2>
        </div>
        <div className="mt-4 w-12 h-1 bg-brand-accent rounded-full" aria-hidden="true" />
      </div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Text */}
            <div className="p-6">
              <h3 className="font-serif text-base font-bold text-brand-dark mb-2">
                {card.title}
              </h3>
              <p className="font-sans text-sm text-brand-dark/60 leading-relaxed">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
