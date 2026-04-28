import { renderHeroOgImage } from '@/lib/og-image'
import { HERO_IMAGE } from '@/lib/events/base-camp-kids'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = "Base Camp Kids — Children's Day camp adventure in Abuja, 30 May 2026"

export default function Image() {
  return renderHeroOgImage({
    hero: HERO_IMAGE,
    eyebrow: "Children's Day · Abuja · 30 May",
    title: 'Base Camp Kids',
    subtitle: 'A real camp adventure, scaled for small humans.',
  })
}
