'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase, containerVariants, itemVariants } from '@/lib/animation'
import { ABOUT_VALUES } from '@/lib/media'

const values = [
  {
    image: ABOUT_VALUES[0].src,
    alt: ABOUT_VALUES[0].alt,
    title: 'Intentional',
    description:
      'Everything we do is purposeful. From the locations we choose to the activities we design, every detail is deliberate and considered.',
  },
  {
    image: ABOUT_VALUES[1].src,
    alt: ABOUT_VALUES[1].alt,
    title: 'Community',
    description:
      'We bring people together. Our experiences create space for genuine connections — between friends, colleagues, and strangers who leave as friends.',
  },
  {
    image: ABOUT_VALUES[2].src,
    alt: ABOUT_VALUES[2].alt,
    title: 'Trust',
    description:
      'Safety is not optional. We earn trust through preparation, professionalism, and a commitment to making every participant feel secure.',
  },
]

export default function OurValues() {
  return (
    <Section className="bg-brand-light">
      {/* Heading */}
      <div className="mb-12 max-w-xl">
        <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable mb-3">
          What Drives Us
        </p>
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: premiumEase }}
          >
            Our Values
          </motion.h2>
        </div>
        <div className="mt-4 w-12 h-1 bg-brand-accent rounded-full" aria-hidden="true" />
      </div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {values.map((value) => (
          <motion.div
            key={value.title}
            variants={itemVariants}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={value.image}
                alt={value.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Text */}
            <div className="p-6">
              <h3 className="font-serif text-lg font-bold text-brand-dark mb-2">
                {value.title}
              </h3>
              <p className="font-sans text-sm text-brand-dark/60 leading-relaxed">
                {value.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
