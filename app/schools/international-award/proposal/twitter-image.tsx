import { notFound } from 'next/navigation'
import { renderHeroOgImage } from '@/lib/og-image'
import { DOE_ENABLED } from '@/lib/feature-flags'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Submit a Duke of Edinburgh Proposal Request — Camping Nigeria'

export default function Image() {
  // The whole DoE surface is temporarily hidden. See lib/feature-flags.ts.
  if (!DOE_ENABLED) notFound()

  return renderHeroOgImage({
    hero: '/images/schools/doe-award.webp',
    eyebrow: 'Duke of Edinburgh',
    title: 'Submit a proposal request',
    subtitle:
      'Tell us about your school or your child’s expedition. We respond within 48 hours.',
  })
}
