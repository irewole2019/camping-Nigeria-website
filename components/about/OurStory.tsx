'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import { ABOUT_OUR_STORY } from '@/lib/media'

export default function OurStory() {
  return (
    <Section className="bg-brand-light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image with accent border offset */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: premiumEase }}
        >
          <div
            className="absolute -bottom-4 -right-4 w-full h-full rounded-xl border-2 border-brand-accent"
            aria-hidden="true"
          />
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
            <Image
              src={ABOUT_OUR_STORY.src}
              alt={ABOUT_OUR_STORY.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: premiumEase, delay: 0.15 }}
        >
          <p className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable">
            Our Story
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight">
            Born From a Simple Question
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-base leading-relaxed text-brand-dark/80">
              People want to explore the outdoors — but in Nigeria, knowing where
              to start safely while still having a genuinely exciting experience
              has always been the challenge. The market is fragmented, equipment
              is hard to access, and structured outdoor programmes barely exist.
            </p>
            <p className="text-base leading-relaxed text-brand-dark/80">
              Camping Nigeria was created to change that. We built a
              passion-driven, end-to-end system that combines quality equipment
              rental, safe access to trusted locations, on-ground guidance, and
              structured experiences — so individuals, schools, and
              organisations can step into nature with confidence.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 border-t border-brand-dark/10 pt-6 mt-2">
            <div>
              <p className="font-serif text-3xl font-bold text-brand-dark">3</p>
              <p className="text-sm text-brand-dark/60 mt-1">Audience segments</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-brand-dark">End‑to‑end</p>
              <p className="text-sm text-brand-dark/60 mt-1">Support system</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-brand-dark">100%</p>
              <p className="text-sm text-brand-dark/60 mt-1">Passion-driven</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
