import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Submit a Duke of Edinburgh Proposal Request — Camping Nigeria'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/doe-award.webp',
    eyebrow: 'Duke of Edinburgh',
    title: 'Submit a proposal request',
    subtitle:
      'Tell us about your school or your child’s expedition. We respond within 48 hours.',
  })
}
