'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import { SCHOOLS_DOE_CALLOUT } from '@/lib/media'

export default function DoECallout() {
  return (
    <section
      id="duke-of-edinburgh"
      className="relative bg-brand-dark overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">

          {/* Image (right on desktop, top on mobile) with gold accent border offset */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: premiumEase }}
          >
            {/* Accent border offset layer — mirrored to bottom-left so it extends inward, not off the section edge */}
            <div
              className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-full h-full rounded-xl border-2 border-brand-accent"
              aria-hidden="true"
            />
            <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
              <Image
                src={SCHOOLS_DOE_CALLOUT.src}
                alt={SCHOOLS_DOE_CALLOUT.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Content (left on desktop, bottom on mobile) */}
          <div className="order-2 lg:order-1 flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.p
              className="inline-flex items-center gap-3 text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase }}
            >
              <span className="block w-8 h-px bg-brand-accent" aria-hidden="true" />
              Featured Program
            </motion.p>

            {/* Masked H2 reveal */}
            <div className="overflow-hidden">
              <motion.h2
                className="font-serif text-3xl md:text-4xl font-bold text-white text-balance leading-tight"
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
              >
                Supporting Schools Running the Duke of Edinburgh Award
              </motion.h2>
            </div>

            {/* Body copy */}
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
            >
              <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed">
                Known in Nigeria as the International Award for Young People, the Duke of Edinburgh Award is one of the most recognised youth development programs in the world. The expedition component is one of the most meaningful parts of the journey. It is also the part most schools find hardest to organise.
              </p>
              <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed">
                Camping Nigeria provides the equipment, the facilitators, and the outdoor programming that schools need to run their expedition properly. We are not an Award operator. We are the partner that makes the outdoor delivery work.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
            >
              <Link
                href="/schools/international-award#assessment"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 sm:px-7 py-4 bg-brand-accent text-brand-dark font-semibold rounded-lg text-sm sm:text-base tracking-wide text-center hover:bg-brand-accent/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Find Out If We Are the Right Fit
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/schools/international-award#award"
                className="inline-flex w-full sm:w-auto items-center justify-center px-5 sm:px-7 py-4 bg-transparent border-2 border-brand-accent text-brand-accent font-semibold rounded-lg text-sm sm:text-base tracking-wide text-center hover:bg-brand-accent/10 active:scale-[0.98] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Learn About the Award
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
