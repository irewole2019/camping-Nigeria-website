'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { premiumEase } from '@/lib/animation'
import { SCHOOLS_FINAL_CTA } from '@/lib/media'

export default function ProgramCta({ programTitle }: { programTitle: string }) {
  return (
    <section className="relative min-h-[50vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={SCHOOLS_FINAL_CTA.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: premiumEase }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Bring {programTitle} to Your School
          </h2>
          <p className="font-sans text-base text-white/70 mb-8 leading-relaxed">
            Every programme is tailored to your school&apos;s needs, calendar, and developmental goals.
            Let&apos;s design the right experience for your students.
          </p>
          <Link
            href="/schools/proposal"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-accent text-brand-dark font-sans font-semibold text-base rounded-lg hover:brightness-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-brand-accent/20"
          >
            Request a Proposal
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
