import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import MotionProvider from '@/components/MotionProvider'
import ScrollToTop from '@/components/ScrollToTop'
import JsonLd from '@/components/seo/JsonLd'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/structured-data'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import './globals.css'

// Primary typeface. next/font/google downloads and self-hosts at build time,
// so nothing is fetched from Google at runtime and `font-src 'self'` in the
// CSP keeps covering it. DM Sans is variable — one file serves 400 to 700.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Secondary typeface — headlines. Still the licensed local file.
const agrandir = localFont({
  src: '../public/fonts/Agrandir-Regular.otf',
  variable: '--font-agrandir',
  display: 'swap',
})

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Camping Nigeria — Outdoor Learning Reimagined for Schools',
    description:
      'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
    path: '/',
  }),
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
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
    <html lang="en-NG" className={`${dmSans.variable} ${agrandir.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-brand-light text-brand-dark">
        <JsonLd id="organization-jsonld" data={buildOrganizationJsonLd()} />
        <JsonLd id="website-jsonld" data={buildWebsiteJsonLd()} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-accent focus:text-brand-dark focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  )
}
