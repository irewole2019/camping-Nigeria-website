'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FinalCta() {
  return (
    <section className="relative bg-brand-dark overflow-hidden">
      {/* Subtle background texture image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=1600&q=60"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-sm font-sans font-semibold tracking-widest text-brand-accent uppercase">
            Get Started
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-light text-balance leading-tight">
            Partner With Us to Design Your School's Outdoor Experience
          </h2>
          <p className="font-sans text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
            Join hundreds of schools across Nigeria that trust Camping Nigeria to deliver safe, enriching, and curriculum-aligned outdoor programmes.
          </p>
          <Link
            href="/schools"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-accent text-brand-dark font-sans font-bold text-base rounded-lg hover:brightness-105 active:scale-95 transition-all duration-200 shadow-lg shadow-brand-accent/20"
          >
            Request a School Proposal
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
