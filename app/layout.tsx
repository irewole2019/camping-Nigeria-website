import type { Metadata, Viewport } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import MotionProvider from '@/components/MotionProvider'
import ScrollToTop from '@/components/ScrollToTop'
import JsonLd from '@/components/seo/JsonLd'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/structured-data'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import './globals.css'

// Both faces come from next/font/google, which downloads and self-hosts them
// at build time — nothing is fetched from Google at runtime, so `font-src
// 'self'` in the CSP keeps covering them. Both are variable fonts, so one
// file each serves the whole 400–700 range the site uses.

// Headings. Mapped to Tailwind's `font-serif` slot in globals.css.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Body and UI. Mapped to Tailwind's `font-sans` slot.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en-NG" className={`${dmSans.variable} ${inter.variable} scroll-smooth`}>
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
