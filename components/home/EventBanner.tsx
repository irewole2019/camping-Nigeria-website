'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import {
  EVENT_PATH,
  EVENT_DATE_LABEL,
  EVENT_ANNOUNCEMENT,
  VENUE_CITY,
  SEAT_CAP,
  EARLY_BIRD_PRICE,
  WALK_IN_PRICE,
  HOMEPAGE_BANNER_IMAGE,
  HOMEPAGE_BANNER_IMAGE_ALT,
  formatNaira,
} from '@/lib/events/base-camp-kids'

const SAVINGS = WALK_IN_PRICE - EARLY_BIRD_PRICE

export default function EventBanner() {
  return (
    <section className="bg-brand-light py-16 md:py-24" aria-labelledby="event-banner-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Image */}
          <motion.div
            className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: premiumEase }}
          >
            <Image
              src={HOMEPAGE_BANNER_IMAGE}
              alt={HOMEPAGE_BANNER_IMAGE_ALT}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute top-5 left-5 inline-flex items-center bg-brand-dark text-brand-accent font-sans text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent mr-2 animate-pulse" aria-hidden="true" />
              Now Booking · {SEAT_CAP} Seats
            </span>
          </motion.div>

          {/* Copy */}
          <div>
            <motion.p
              className="inline-flex items-center gap-2 text-brand-accent-readable font-semibold text-sm uppercase tracking-widest mb-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase }}
            >
              <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
              Children’s Day · Abuja · 2026
            </motion.p>

            <div className="overflow-hidden mb-3">
              <motion.h2
                id="event-banner-heading"
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark text-balance leading-tight"
                initial={{ y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
              >
                Base Camp Kids — a real camp adventure for kids 6 to 12.
              </motion.h2>
            </div>

            <motion.p
              className="font-serif italic text-base md:text-lg text-brand-dark/85 mb-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase, delay: 0.15 }}
            >
              {EVENT_ANNOUNCEMENT}
            </motion.p>

            <motion.p
              className="font-sans text-base md:text-lg text-brand-dark/75 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
            >
              Tents. House teams. Outdoor games. Souvenirs they keep. One Saturday only,
              30 seats, in {VENUE_CITY}. Save{' '}
              <strong className="text-brand-dark font-semibold">{formatNaira(SAVINGS)}</strong>{' '}
              by registering online before they sell out.
            </motion.p>

            <motion.dl
              className="grid grid-cols-3 gap-x-6 gap-y-4 mb-9 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.3 }}
            >
              <Stat icon={<Calendar className="w-3.5 h-3.5" aria-hidden="true" />} label="When" value={EVENT_DATE_LABEL.replace('Saturday, ', '')} />
              <Stat icon={<MapPin className="w-3.5 h-3.5" aria-hidden="true" />} label="Where" value={VENUE_CITY} />
              <Stat icon={<Users className="w-3.5 h-3.5" aria-hidden="true" />} label="Seats" value={`${SEAT_CAP} only`} />
            </motion.dl>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
            >
              <Link
                href={`${EVENT_PATH}#register`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                Reserve a Seat
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href={EVENT_PATH}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-brand-dark/25 text-brand-dark font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                See the Full Day
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-brand-accent-readable text-[11px] uppercase tracking-widest font-semibold mb-1">
        {icon}
        {label}
      </dt>
      <dd className="font-sans text-sm md:text-base font-semibold text-brand-dark">{value}</dd>
    </div>
  )
}
