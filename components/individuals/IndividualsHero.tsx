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
      ctaHref="https://forms.office.com/r/bgsZ4shNxD"
      height="h-[70dvh]"
      minHeight="min-h-[480px]"
    />
  )
}
