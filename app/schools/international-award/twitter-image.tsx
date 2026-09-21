import { notFound } from 'next/navigation'
import { renderHeroOgImage } from '@/lib/og-image'
import { DOE_ENABLED } from '@/lib/feature-flags'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = "Camping Nigeria — Bring the Duke of Edinburgh's International Award to your school"

export default function Image() {
  // The whole DoE surface is temporarily hidden. See lib/feature-flags.ts.
  if (!DOE_ENABLED) notFound()

  return renderHeroOgImage({
    hero: '/images/schools/doe-award.webp',
    eyebrow: 'Duke of Edinburgh',
    title: 'Bring the International Award to your school',
    subtitle: 'Bronze, Silver, and Gold expeditions — fully run in Nigeria.',
  })
}
