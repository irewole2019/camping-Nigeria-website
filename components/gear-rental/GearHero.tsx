'use client'

import PageHero from '@/components/shared/PageHero'

export default function GearHero() {
  return (
    <PageHero
      image="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1800&q=85&fit=crop"
      imageAlt="Premium camping gear and tent setup in a forest clearing"
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
