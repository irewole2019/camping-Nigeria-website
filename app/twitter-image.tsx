import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria — Adventure Made Simple'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/hero.webp',
    eyebrow: 'Camping Nigeria',
    title: 'Adventure Made Simple',
    subtitle:
      'Structured, safe outdoor experiences for schools, organisations, and individuals across Nigeria.',
  })
}
