import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria Organization Offers — A real camp, not a conference room'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/organizations/hero.webp',
    eyebrow: 'Organization Offers',
    title: 'A real camp, not a conference room',
    subtitle: 'Company days and leadership offsites from NGN 3,550,000.',
  })
}
