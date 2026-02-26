'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'

const premiumEase = [0.16, 1, 0.3, 1]

const cards = [
  {
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    alt: 'Guide leading a group through a forest trail',
    title: 'Guided camping experiences',
    description: 'Expert-led expeditions that take the guesswork out of the wild.',
    col: 'md:col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    alt: 'Verified campsite with tents at dusk',
    title: 'Safe and verified locations',
    description: 'Every site is scouted, risk-assessed, and approved before your visit.',
    col: 'md:col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80',
    alt: 'Quality camping equipment laid out',
    title: 'Equipment provided',
    description: 'Quality gear included — just show up ready to experience nature.',
    col: 'md:col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    alt: 'Group following a structured hiking itinerary',
    title: 'Structured yet exciting itineraries',
    description: 'Balanced programmes with planned activities and free exploration time.',
    col: 'md:col-span-1',
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
    alt: 'Community of friends gathered outdoors',
    title: 'Community-driven experiences',
    description: 'Meet like-minded individuals and build lasting connections outdoors.',
    col: 'md:col-span-1',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: premiumEase } },
}

export default function Expectations() {
  return (
    <Section className="bg-brand-light">
      {/* Heading */}
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-brand-accent mb-3">
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

      {/* Cards grid — 4 col on md, first two span 2, last three fill a row */}
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
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
