import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Gear Rental — Premium camping kit, delivered'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/gear-rental/hero.webp',
    eyebrow: 'Gear Rental',
    title: 'Premium camping kit, delivered',
    subtitle: 'Tents, mats, blankets and more — quote within 24 hours.',
  })
}
