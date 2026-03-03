'use client'

import PageHero from '@/components/shared/PageHero'
import { ABOUT_HERO } from '@/lib/media'

export default function AboutHero() {
  return (
    <PageHero
      image={ABOUT_HERO.src}
      imageAlt={ABOUT_HERO.alt}
      eyebrow="About Us"
      headline={
        <>
          Making the Outdoors{' '}
          <span className="text-brand-accent">Safe, Accessible</span> &amp;
          Full&nbsp;of&nbsp;Life
        </>
      }
      subheadline="Camping Nigeria exists to remove the fear, friction, and barriers that keep people from enjoying nature — so everyone can explore confidently."
      ctaLabel="Get in Touch"
      ctaHref="mailto:hello@campingnigeria.com"
      height="h-[70vh]"
      minHeight="min-h-[520px]"
    />
  )
}
