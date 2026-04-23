import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    host: 'https://campingnigeria.com',
    sitemap: 'https://campingnigeria.com/sitemap.xml',
  }
}
