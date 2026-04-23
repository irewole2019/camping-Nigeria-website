import type { Metadata } from 'next'

export const SITE_NAME = 'Camping Nigeria'
export const SITE_URL = 'https://campingnigeria.com'
export const SITE_LOCALE = 'en_NG'
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/opengraph-image`
export const DEFAULT_TWITTER_IMAGE_URL = `${SITE_URL}/twitter-image`

const DEFAULT_KEYWORDS = [
  'Camping Nigeria',
  'outdoor education Nigeria',
  'school camping Nigeria',
  'Duke of Edinburgh Nigeria',
  'student leadership camps',
  'camping gear rental Nigeria',
  'team building retreats Nigeria',
  'school excursion planning',
]

interface BuildPageMetadataInput {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  keywords?: string[]
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

function toAbsoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = 'website',
  keywords = [],
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = normalizePath(path)
  const url = toAbsoluteUrl(canonicalPath)

  return {
    title,
    description,
    keywords: [...new Set([...DEFAULT_KEYWORDS, ...keywords])],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_TWITTER_IMAGE_URL],
    },
  }
}
