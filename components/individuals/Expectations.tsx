'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase, containerVariants, itemVariants } from '@/lib/animation'

const cards = [
  {
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    alt: 'Guide leading a group through a forest trail',
    title: 'Guided camping experiences',
    description: 'Expert-led expeditions that take the guesswork out of the wild.',
  },
  {
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    alt: 'Verified campsite with tents at dusk',
    title: 'Safe and verified locations',
    description: 'Every site is scouted, risk-assessed, and approved before your visit.',
  },
  {
    image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80',
    alt: 'Quality camping equipment laid out',
    title: 'Equipment provided',
    description: 'Quality gear included — just show up ready to experience nature.',
  },
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    alt: 'Group following a structured hiking itinerary',
    title: 'Structured yet exciting itineraries',
    description: 'Balanced programmes with planned activities and free exploration time.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
    alt: 'Community of friends gathered outdoors',
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
