import { renderHeroOgImage } from '@/lib/og-image'
import { HERO_IMAGE } from '@/lib/events/base-camp-kids'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria events — one-day camps and holiday activations in Abuja'

export default function Image() {
  return renderHeroOgImage({
    hero: HERO_IMAGE,
    eyebrow: 'Events · Abuja',
    title: 'Camps you can book into',
    subtitle: 'One-day camps, holiday activations, and Children’s Day adventures.',
  })
}
