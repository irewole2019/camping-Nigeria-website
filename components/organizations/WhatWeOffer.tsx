'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Brain, Shield } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const offerings = [
  {
    icon: Users,
    title: 'Outdoor team-building programs',
    sub: 'Structured activities and challenges designed to foster unity.',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1000&q=80&fit=crop',
    alt: 'Group of colleagues completing an outdoor challenge together',
    reverse: false,
  },
  {
    icon: Brain,
    title: 'Leadership and collaboration modules',
    sub: 'Specialized frameworks that build communication and problem-solving skills in the wild.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&q=80&fit=crop',
    alt: 'Team leaders collaborating in a nature setting',
    reverse: true,
  },
  {
    icon: Shield,
    title: 'Full logistics and safety management',
    sub: 'We handle the custom retreat planning from start to finish so your team can focus entirely on the experience.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&q=80&fit=crop',
    alt: 'Well-organised luxury camp setup in a forest clearing',
    reverse: false,
  },
]

export default function WhatWeOffer() {
  return (
    <Section className="bg-white">
      {/* Section header */}
      <div className="text-center mb-16">
        <motion.p
          className="text-sm font-sans font-semibold tracking-widest text-brand-accent-readable uppercase mb-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          What we offer
        </motion.p>
        <div className="overflow-hidden">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: premiumEase, delay: 0.1 }}
          >
            Experiences built for your team
          </motion.h2>
        </div>
      </div>

      {/* Zig-zag rows */}
      <div className="flex flex-col gap-20">
        {offerings.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              className={`flex flex-col ${item.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: premiumEase, delay: i * 0.1 }}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 shrink-0">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-accent/10">
                  <Icon className="w-6 h-6 text-brand-dark" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-base text-brand-dark/65 leading-relaxed">
                  {item.sub}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
