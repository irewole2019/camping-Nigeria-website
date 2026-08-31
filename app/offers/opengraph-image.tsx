import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Offers — Published packages and prices'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/media-feature.webp',
    eyebrow: 'Our Offers',
    title: 'Published packages and prices',
    subtitle: 'Programmes for schools, organizations and individuals.',
  })
}
