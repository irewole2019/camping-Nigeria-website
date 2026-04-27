import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria On-Campus Camps — Camp without leaving school grounds'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/schools/program-campus-camps.webp',
    eyebrow: 'On-Campus Camps',
    title: 'Camp without leaving school grounds',
    subtitle: 'Two-day immersive camps run inside your campus.',
  })
}
