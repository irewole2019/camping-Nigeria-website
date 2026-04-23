import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const LAST_MODIFIED = new Date(process.env.NEXT_PUBLIC_SEO_LAST_MODIFIED ?? '2026-04-23T00:00:00.000Z')

const OG = `${SITE_URL}/opengraph-image`

interface RouteEntry {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
  /** Primary image shown in Google Image results for this page */
  image?: string
}

const ROUTES: RouteEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1, image: OG },
  { path: '/schools', changeFrequency: 'weekly', priority: 0.9, image: `${SITE_URL}/images/schools/hero.webp` },
  {
    path: '/schools/international-award',
    changeFrequency: 'weekly',
    priority: 0.85,
    image: `${SITE_URL}/images/schools/doe-award.webp`,
  },
  {
    path: '/schools/programs/on-campus-camps',
    changeFrequency: 'monthly',
    priority: 0.7,
    image: `${SITE_URL}/images/schools/program-campus-camps.webp`,
  },
  {
    path: '/schools/programs/nature-craft',
    changeFrequency: 'monthly',
    priority: 0.7,
    image: `${SITE_URL}/images/schools/program-eco-awareness.webp`,
  },
  {
    path: '/schools/programs/leadership-development',
    changeFrequency: 'monthly',
    priority: 0.7,
    image: `${SITE_URL}/images/schools/program-leadership.webp`,
  },
  { path: '/schools/proposal', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/individuals',
    changeFrequency: 'weekly',
    priority: 0.8,
    image: `${SITE_URL}/images/individuals/hero.webp`,
  },
  {
    path: '/organizations',
    changeFrequency: 'weekly',
    priority: 0.8,
    image: `${SITE_URL}/images/organizations/hero.webp`,
  },
  {
    path: '/gear-rental',
    changeFrequency: 'weekly',
    priority: 0.7,
    image: `${SITE_URL}/images/gear-rental/hero.webp`,
  },
  {
    path: '/about',
    changeFrequency: 'monthly',
    priority: 0.65,
    image: `${SITE_URL}/images/about/hero.webp`,
  },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority, image }) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
    ...(image ? { images: [image] } : {}),
  }))
}
