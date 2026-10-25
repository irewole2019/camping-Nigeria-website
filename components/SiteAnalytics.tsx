'use client'

import { Analytics } from '@vercel/analytics/next'
import { usePathname } from 'next/navigation'
import { isPadiCheckPath, scrubAnalyticsUrl } from '@/lib/analytics'

/**
 * Vercel Analytics with the rules in lib/analytics.ts: not loaded at all on
 * Padi Check, and never sent a guest's name or code.
 */
export default function SiteAnalytics() {
  const pathname = usePathname()
  if (isPadiCheckPath(pathname)) return null
  return (
    <Analytics
      beforeSend={(event) => {
        const url = scrubAnalyticsUrl(event.url)
        return url ? { ...event, url } : null
      }}
    />
  )
}
