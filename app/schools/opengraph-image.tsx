import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Schools — Outdoor learning that builds real character'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/hero.webp',
    eyebrow: 'Schools',
    title: 'Outdoor learning that builds real character',
    subtitle: 'Trip-led programmes designed for Nigerian schools.',
  })
}
