import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /padi-check is the gate tool: also noindex in its layout (R-012).
        disallow: ['/api/', '/padi-check'],
      },
    ],
    host: 'https://www.campingnigeria.com',
    sitemap: 'https://www.campingnigeria.com/sitemap.xml',
  }
}
