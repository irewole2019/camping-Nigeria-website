'use client'

import PageHero from '@/components/shared/PageHero'
import { ORGANIZATIONS_HERO } from '@/lib/media'

export default function OrganizationsHero() {
  return (
    <PageHero
      image={ORGANIZATIONS_HERO.src}
      imageAlt={ORGANIZATIONS_HERO.alt}
      eyebrow="For Organizations"
      headline={
        <>
          Team Bonding{' '}
          <span className="text-brand-accent">Beyond the Boardroom</span>
        </>
      }
      subheadline="Camping Nigeria designs structured outdoor team experiences for companies, NGOs, churches, and social groups seeking meaningful connection and collaboration."
      ctaLabel="Plan Your Retreat"
      ctaHref="mailto:hello@campingnigeria.com"
      height="h-[70vh]"
      minHeight="min-h-[480px]"
    />
  )
}
