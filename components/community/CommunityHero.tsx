'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BackgroundVideo from '@/components/home/BackgroundVideo'
import { premiumEase } from '@/lib/animation'
import {
  COMMUNITY_NAME,
  COMMUNITY_STRAPLINE,
  HERO_INTRO,
  HERO_POSTER,
  HERO_VIDEO,
  HERO_VIDEO_WEBM,
  JOIN_URL,
} from '@/lib/community'

const HEADING_ID = 'community-hero-heading'

/**
 * Modelled on the homepage gateway hero (`app/page.tsx`): full-screen
 * background video, a flat black/45 overlay, content in the lower half and
 * the same frosted pill buttons. The page keeps the Navbar, which the
 * gateway omits.
 */
export default function CommunityHero() {
  return (
    <section
      className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      <BackgroundVideo
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        sources={[{ src: HERO_VIDEO_WEBM, type: 'video/webm' }]}
      />

      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-20 text-center sm:pb-24">
        <motion.p
          className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent sm:text-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.1 }}
        >
          {COMMUNITY_STRAPLINE}
        </motion.p>

        <div className="mb-6 overflow-hidden">
          <motion.h1
            id={HEADING_ID}
            className="font-serif text-4xl font-bold leading-tight text-white text-balance drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.25 }}
          >
            {COMMUNITY_NAME}
          </motion.h1>
        </div>

        <motion.p
          className="mb-10 max-w-2xl font-sans text-base leading-relaxed text-white/85 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: premiumEase, delay: 0.5 }}
        >
          {HERO_INTRO}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.7 }}
        >
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-60 whitespace-nowrap rounded-full border border-brand-accent bg-brand-accent px-8 py-3 text-center font-sans text-sm font-semibold uppercase tracking-widest text-brand-dark transition-all duration-300 hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Join the Community
          </a>
          <Link
            href="/events"
            className="min-w-60 whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-8 py-3 text-center font-sans text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See Upcoming Events
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
