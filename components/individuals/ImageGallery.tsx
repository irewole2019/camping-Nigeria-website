'use client'

import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&q=80',
    alt: 'Friends gathered around a glowing campfire at night',
    className: 'row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&q=80',
    alt: 'Young adults hiking through a forest trail',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    alt: 'Tent pitched at sunrise in a clearing',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=800&q=80',
    alt: 'Group of campers laughing and connecting outdoors',
    className: 'row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    alt: 'Hiker standing on a ridge overlooking a valley',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    alt: 'Camping gear neatly arranged on a wooden surface',
    className: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1525811902-f2342640856e?w=800&q=80',
    alt: 'Stars over a campsite in the wilderness',
    className: '',
  },
]

export default function ImageGallery() {
  return (
    <Section className="bg-white">
      {/* Heading */}
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-sans font-semibold tracking-widest uppercase text-brand-accent mb-3">
          Life outside
        </p>
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle hover overlay */}
            <div
              className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-400"
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
