import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Kiddies Hike and Fun Day — Fifty children climbed a rock above Abuja'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/events/kiddies-hike/hero.webp',
    eyebrow: 'Kiddies Hike 2026',
    title: 'Fifty children climbed a rock above Abuja',
    subtitle: 'A potluck family hike, 21 August 2026.',
  })
}
