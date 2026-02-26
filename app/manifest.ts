import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Camping Nigeria',
    short_name: 'CampingNG',
    description:
      'Structured, safe, and development-focused camping experiences designed for Nigerian schools, individuals, and organizations.',
    theme_color: '#0e3e2e',
    background_color: '#f3efe6',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
