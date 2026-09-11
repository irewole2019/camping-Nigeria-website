import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import MotionProvider from '@/components/MotionProvider'
import ScrollToTop from '@/components/ScrollToTop'
import JsonLd from '@/components/seo/JsonLd'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/structured-data'
import { buildPageMetadata, SITE_URL } from '@/lib/seo'
import './globals.css'

// Headings — the brand display face. Mapped to Tailwind's `font-serif` slot
// in globals.css. A local `.otf`, so it never leaves the origin.
const agrandir = localFont({
  src: '../public/fonts/Agrandir-Regular.otf',
  variable: '--font-agrandir',
  display: 'swap',
})

// Body and UI. Mapped to Tailwind's `font-sans` slot.
//
// Loaded from a local file rather than `next/font/google`, deliberately.
// The Google loader downloads the font at *build* time, which makes every
// production build depend on `fonts.googleapis.com` being reachable — and a
// build machine that cannot reach it fails outright with "Failed to fetch".
// A file in the repo has no such dependency and builds offline.
//
// The file is the latin weight-axis variable cut from `@fontsource-variable/
// dm-sans` v5.3.0, which packages Google's own DM Sans release. OFL-1.1
// licensed, so redistributing it here is fine; the licence sits beside it.
// 37 KB covers the whole 100–1000 weight range.
const dmSans = localFont({
  src: '../public/fonts/DMSans-Variable.woff2',
  variable: '--font-dm-sans',
  display: 'swap',
  weight: '100 1000',
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
    <html lang="en-NG" className={`${agrandir.variable} ${dmSans.variable} scroll-smooth`}>
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
