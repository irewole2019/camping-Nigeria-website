import type { Metadata, Viewport } from 'next'

/**
 * Padi Check, the gate check-in tool. Hidden from search on every route
 * (R-012): noindex here, disallowed in app/robots.ts, never in the sitemap.
 */
export const metadata: Metadata = {
  title: 'Padi Check',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: '#0e3e2e',
}

export default function PadiCheckLayout({ children }: { children: React.ReactNode }) {
  return children
}
