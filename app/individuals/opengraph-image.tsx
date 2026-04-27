import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria for Individuals — Trips that take you further'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/individuals/hero.webp',
    eyebrow: 'For Individuals',
    title: 'Trips that take you further',
    subtitle: 'Curated outdoor experiences across Nigeria.',
  })
}
