'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'
import { containerVariants, premiumEase } from '@/lib/animation'
import { OFFER_GROUPS, type OfferGroup } from '@/lib/offers-data'

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: premiumEase },
  },
}

function GroupCard({ group }: { group: OfferGroup }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  const href = `/offers/${group.slug}`
  const packageCount = group.packages.length

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      style={{ position: 'relative' }}
      className="h-[440px] rounded-xl overflow-hidden group"
    >
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {group.name} packages</span>
      </Link>

      {/* Parallax image layer */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <motion.div style={{ y }} className="absolute inset-0 h-[110%]">
          <Image
            src={group.hero.src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-[filter,transform] duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/50 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <h3 className="font-serif text-2xl font-bold text-brand-light leading-snug">
          {group.name}
        </h3>
        <p className="font-sans text-sm leading-relaxed text-brand-light/75 mt-2 text-pretty">
          {group.teaser}
        </p>

        {/* Package names — tells the visitor what is behind the link */}
        <ul className="mt-4 space-y-1.5">
          {group.packages.map((pkg) => (
            <li
              key={pkg.slug}
              className="flex items-center gap-2 font-sans text-xs text-brand-light/65"
            >
              <span
                className="w-1 h-1 bg-brand-accent flex-shrink-0"
                aria-hidden="true"
              />
              {pkg.name}
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-1.5 text-brand-accent text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all duration-300">
          View {packageCount} package{packageCount === 1 ? '' : 's'}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  )
}

export default function OfferGroupCards() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section className="bg-white">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Three Ways to Work With Us
        </motion.span>

        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            Choose Your Group
          </motion.h2>
        </div>

        <motion.p
          className="font-sans text-base leading-relaxed text-brand-dark/70 mt-5 text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
        >
          Every package below is published with its format, group size, lead time and price.
          Open the group that fits you to see what is included.
        </motion.p>
      </div>

      <motion.div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {OFFER_GROUPS.map((group) => (
          <GroupCard key={group.slug} group={group} />
        ))}
      </motion.div>
    </Section>
  )
}
