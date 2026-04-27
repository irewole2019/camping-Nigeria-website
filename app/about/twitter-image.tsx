import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'About Camping Nigeria — Founded in Nigeria, built for the outdoors'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/about/hero.webp',
    eyebrow: 'About',
    title: 'Founded in Nigeria, built for the outdoors',
    subtitle: 'Real growth happens outside.',
  })
}
