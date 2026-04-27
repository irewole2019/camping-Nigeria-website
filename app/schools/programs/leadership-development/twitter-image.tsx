import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Leadership Development — Leadership built outdoors'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/program-leadership.webp',
    eyebrow: 'Leadership Development',
    title: 'Leadership built outdoors',
    subtitle: 'A senior-school programme designed for the outdoors.',
  })
}
