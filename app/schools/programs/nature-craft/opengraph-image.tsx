import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Nature Craft — Eco-awareness through hands-on craft'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/program-eco-awareness.webp',
    eyebrow: 'Nature Craft',
    title: 'Eco-awareness through hands-on craft',
    subtitle: 'A field-and-craft programme for primary and junior students.',
  })
}
