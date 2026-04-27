import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = "Camping Nigeria — Bring the Duke of Edinburgh's International Award to your school"

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/doe-award.webp',
    eyebrow: 'Duke of Edinburgh',
    title: 'Bring the International Award to your school',
    subtitle: 'Bronze, Silver, and Gold expeditions — fully run in Nigeria.',
  })
}
