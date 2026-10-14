import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'The African Dream Community — Camp. Connect. Celebrate.'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/community/081a0122.webp',
    eyebrow: 'Community',
    title: 'The African Dream Community',
    subtitle: 'Camp. Connect. Celebrate. Joining costs nothing.',
  })
}
