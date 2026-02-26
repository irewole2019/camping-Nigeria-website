import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import MotionProvider from '@/components/MotionProvider'
import './globals.css'

const helveticaNow = localFont({
  src: '../public/fonts/Helvetica.ttf',
  variable: '--font-helvetica-now',
  display: 'swap',
})

const agrandir = localFont({
  src: '../public/fonts/Agrandir-Regular.otf',
  variable: '--font-agrandir',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://campingnigeria.com'),
  title: 'Camping Nigeria — Outdoor Learning Reimagined for Schools',
  description:
    'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Camping Nigeria — Outdoor Learning Reimagined for Schools',
    description:
      'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
    url: 'https://campingnigeria.com',
    siteName: 'Camping Nigeria',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camping Nigeria — Outdoor Learning Reimagined for Schools',
    description:
      'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0e3e2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG" className={`${helveticaNow.variable} ${agrandir.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans antialiased bg-brand-light text-brand-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-accent focus:text-brand-dark focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
