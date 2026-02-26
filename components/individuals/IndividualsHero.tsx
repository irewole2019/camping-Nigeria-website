'use client'

import PageHero from '@/components/shared/PageHero'
import { INDIVIDUALS_HERO } from '@/lib/media'

export default function IndividualsHero() {
  return (
    <PageHero
      image={INDIVIDUALS_HERO.src}
      imageAlt={INDIVIDUALS_HERO.alt}
      eyebrow="For Individuals"
      headline={
        <>
          Your First Real{' '}
          <span className="text-brand-accent">Outdoor Experience</span>
        </>
      }
      subheadline="Discover structured and accessible camping experiences designed for young adults and adventure seekers."
      ctaLabel="Book Your Spot"
      ctaHref="mailto:hello@campingnigeria.com"
      height="h-[70vh]"
      minHeight="min-h-[480px]"
    />
  )
}
