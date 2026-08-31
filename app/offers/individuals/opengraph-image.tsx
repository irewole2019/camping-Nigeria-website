import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Individual Offers — Camping without owning any of it'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/individuals/hero.webp',
    eyebrow: 'Individual Offers',
    title: 'Camping without owning any of it',
    subtitle: 'Open Camp from NGN 95,000 per person.',
  })
}
