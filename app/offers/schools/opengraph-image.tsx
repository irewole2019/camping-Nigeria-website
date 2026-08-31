import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria School Offers — From a field day to a full outdoor year'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/hero.webp',
    eyebrow: 'School Offers',
    title: 'From a field day to a full outdoor year',
    subtitle: 'On-campus programmes from NGN 3,000,000.',
  })
}
