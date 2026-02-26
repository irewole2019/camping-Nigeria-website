'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'

const customEase = [0.22, 1, 0.36, 1] as const

const cards = [
  {
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    alt: 'Young adults on a camping trip',
    headline: 'Your First Real Outdoor Experience',
    body: 'Discover structured and accessible camping experiences designed for young adults and adventure seekers.',
    link: 'Book Your Spot',
    href: '/individuals',
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
    alt: 'Team bonding outdoors',
    headline: 'Team Bonding Beyond the Boardroom',
    body: 'Camping Nigeria designs structured outdoor team experiences for companies, NGOs, churches, and social groups seeking meaningful connection and collaboration.',
    link: "Plan Your Organization's Retreat",
    href: '/organizations',
  },
  {
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    alt: 'Premium camping gear laid out',
    headline: 'Premium Camping Gear, Ready When You Are',
    body: 'Rent high-quality camping equipment for schools, individuals, and organizations without the stress of ownership.',
    link: 'Request a Rental Quote',
    href: '/gear-rental',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: customEase } },
}

export default function SecondaryAudiences() {
  return (
    <Section className="bg-brand-light">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-sm font-sans font-semibold tracking-widest text-brand-accent-readable uppercase mb-3">
          Beyond Schools
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance">
          More Ways to Experience the Outdoors
        </h2>
      </div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.headline}
            variants={cardVariants}
            className="bg-white border border-brand-dark/10 rounded-xl overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col flex-1 p-6 gap-3">
              <h3 className="font-serif text-lg font-bold text-brand-dark leading-snug">
                {card.headline}
              </h3>
              <p className="font-sans text-sm text-brand-dark/60 leading-relaxed flex-1">
                {card.body}
              </p>
              <Link
                href={card.href}
                className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-brand-dark hover:text-brand-accent transition-colors duration-200 mt-2 group/link"
              >
                {card.link}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover/link:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
