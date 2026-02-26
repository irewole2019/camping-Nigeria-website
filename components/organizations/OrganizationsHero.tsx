'use client'

import PageHero from '@/components/shared/PageHero'

export default function OrganizationsHero() {
  return (
    <PageHero
      image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=85&fit=crop"
      imageAlt="Professional team collaborating outdoors in a lush natural setting"
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
