import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria for Organisations — Retreats that move the needle'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/organizations/hero.webp',
    eyebrow: 'For Organisations',
    title: 'Retreats that move the needle',
    subtitle: 'Leadership, team-building, and luxury camps for teams.',
  })
}
