'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase, containerVariants, itemVariants } from '@/lib/animation'
import {
  EARLY_BIRD_PRICE,
  WALK_IN_PRICE,
  SIBLING_DISCOUNT_RATE,
  formatNaira,
} from '@/lib/events/base-camp-kids'

const SAVINGS = WALK_IN_PRICE - EARLY_BIRD_PRICE
const SIBLING_PRICE = Math.round(EARLY_BIRD_PRICE * (1 - SIBLING_DISCOUNT_RATE))

export default function Pricing() {
  return (
    <Section id="pricing" className="bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.span
            className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: premiumEase }}
          >
            Pricing
          </motion.span>

          <div className="overflow-hidden mt-3">
            <motion.h2
              className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
            >
              Save {formatNaira(SAVINGS)} by registering early
            </motion.h2>
          </div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Early-bird (recommended) */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border-2 border-brand-accent bg-brand-accent-tint p-8 flex flex-col"
          >
            <span className="absolute -top-3 left-8 inline-flex items-center bg-brand-dark text-brand-accent font-sans text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              Book Online
            </span>

            <p className="font-sans text-xs uppercase tracking-widest text-brand-accent-readable font-semibold mb-2">
              Early-bird Registration
            </p>
            <p className="font-serif text-5xl font-bold text-brand-dark mb-1">
              {formatNaira(EARLY_BIRD_PRICE)}
            </p>
            <p className="font-sans text-sm text-brand-dark/60 mb-6">per child</p>

            <ul className="space-y-3 mb-8">
              <Item>Reserve before seats sell out</Item>
              <Item>10% sibling discount on every additional child ({formatNaira(SIBLING_PRICE)} each)</Item>
              <Item>All food, souvenirs, and certificates included</Item>
              <Item>Full refund up to 7 days before</Item>
            </ul>

            <Link
              href="#register"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Reserve a Seat
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Walk-in (muted) */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-brand-dark/15 bg-brand-light p-8 flex flex-col"
          >
            <p className="font-sans text-xs uppercase tracking-widest text-brand-dark/55 font-semibold mb-2">
              At the Venue (if seats remain)
            </p>
            <p className="font-serif text-5xl font-bold text-brand-dark/55 mb-1">
              {formatNaira(WALK_IN_PRICE)}
            </p>
            <p className="font-sans text-sm text-brand-dark/45 mb-6">per child</p>

            <ul className="space-y-3 mb-8 text-brand-dark/65">
              <Item muted>Walk-in pricing on the day, subject to availability</Item>
              <Item muted>No sibling discount</Item>
              <Item muted>Same souvenirs and meal included</Item>
              <Item muted>We always sell out — early registration is the only guarantee</Item>
            </ul>

            <p className="mt-auto font-sans text-sm text-brand-dark/55 italic">
              We open the gate at 9:30 AM. We cannot promise space.
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-center font-sans text-sm text-brand-dark/60 mt-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.3 }}
        >
          Once you register below, we email you an invoice within 24 hours. Your seat is locked in
          the moment payment clears. We’ll then send the venue address, what to bring, and your
          child’s house assignment.
        </motion.p>
      </div>
    </Section>
  )
}

function Item({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <li className="flex items-start gap-3 font-sans text-sm leading-relaxed">
      <Check
        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${muted ? 'text-brand-dark/35' : 'text-brand-accent-readable'}`}
        aria-hidden="true"
      />
      <span className={muted ? '' : 'text-brand-dark/85'}>{children}</span>
    </li>
  )
}
