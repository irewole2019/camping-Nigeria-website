'use client'

import PageHero from '@/components/shared/PageHero'

export default function IndividualsHero() {
  return (
    <PageHero
      image="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=1800&q=85&fit=crop"
      imageAlt="Young adults gathered around a campfire in warm evening light"
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
