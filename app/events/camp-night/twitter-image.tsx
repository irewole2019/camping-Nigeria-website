import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'September Camp Night — A night outdoors in Abuja, 26 September 2026'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/events/camp-night/hero.webp',
    eyebrow: 'Camp Night · Abuja',
    title: 'A night outdoors, Sat 26 September',
    subtitle: 'Tents pitched, bonfire lit, 3 DJs. From ₦20,000.',
  })
}
