'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { premiumEase } from '@/lib/animation'
import type { EventBannerContent, EventStatIcon } from '@/lib/events'

const STAT_ICONS: Record<EventStatIcon, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  'map-pin': MapPin,
  users: Users,
}

/**
 * Homepage promo for whichever event is currently taking registrations.
 * Content-agnostic — everything it renders comes from the registry entry, so
 * the next campaign is a data change. The homepage decides whether to render
 * it at all; a past event never reaches here.
 */
export default function EventBanner({ banner }: { banner: EventBannerContent }) {
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
              src={banner.image}
              alt={banner.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute top-5 left-5 inline-flex items-center bg-brand-dark text-brand-accent font-sans text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent mr-2 animate-pulse" aria-hidden="true" />
              {banner.badge}
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
              {banner.eyebrow}
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
                {banner.headline}
              </motion.h2>
            </div>

            <motion.p
              className="font-serif italic text-base md:text-lg text-brand-dark/85 mb-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: premiumEase, delay: 0.15 }}
            >
              {banner.announcement}
            </motion.p>

            <motion.p
              className="font-sans text-base md:text-lg text-brand-dark/75 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.2 }}
            >
              {banner.body}
            </motion.p>

            <motion.dl
              className="grid grid-cols-3 gap-x-6 gap-y-4 mb-9 max-w-md"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.3 }}
            >
              {banner.stats.map((stat) => (
                <Stat key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
              ))}
            </motion.dl>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: premiumEase, delay: 0.4 }}
            >
              <Link
                href={banner.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-accent hover:text-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {banner.primaryCta.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href={banner.secondaryCta.href}
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-brand-dark/25 text-brand-dark font-semibold rounded-lg text-sm tracking-wide hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {banner.secondaryCta.label}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, label, value }: { icon: EventStatIcon; label: string; value: string }) {
  const Icon = STAT_ICONS[icon]
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-brand-accent-readable text-[11px] uppercase tracking-widest font-semibold mb-1">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="font-sans text-sm md:text-base font-semibold text-brand-dark">{value}</dd>
    </div>
  )
}
