'use client'

import PageHero from '@/components/shared/PageHero'
import { GEAR_RENTAL_HERO } from '@/lib/media'

export default function GearHero() {
  return (
    <PageHero
      image={GEAR_RENTAL_HERO.src}
      imageAlt={GEAR_RENTAL_HERO.alt}
      eyebrow="Gear Rental"
      headline={
        <>
          Premium Camping Gear,{' '}
          <span className="text-brand-accent">Ready When You Are</span>
        </>
      }
      subheadline="Rent high-quality camping equipment for schools, individuals, and organizations without the stress of ownership."
      height="h-[60vh]"
      minHeight="min-h-[420px]"
    />
  )
}
