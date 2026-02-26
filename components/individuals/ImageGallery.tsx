'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import { INDIVIDUALS_GALLERY } from '@/lib/media'

const images = INDIVIDUALS_GALLERY

export default function ImageGallery() {
  return (
    <Section className="bg-white">
      {/* Heading */}
      <div className="mb-10 max-w-xl">
        <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable mb-3">
          Life outside
        </p>
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: premiumEase }}
          >
            Experience the Wild
          </motion.h2>
        </div>
        <div className="mt-4 w-12 h-1 bg-brand-accent rounded-full" aria-hidden="true" />
      </div>

      {/* Masonry-style interlocking grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[280px] gap-3">
        {images.map((img, i) => (
          <motion.div
            key={img.src}
            className={`group relative overflow-hidden rounded-lg ${img.className}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: premiumEase, delay: i * 0.08 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle hover overlay */}
            <div
              className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-500"
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
