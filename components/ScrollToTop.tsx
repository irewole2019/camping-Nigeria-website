'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Forces an instant jump to the top of the page on every client-side
 * navigation. Without this, the global `scroll-smooth` on <html> makes
 * route changes animate from the old scroll position, which briefly
 * reveals the new page mid-scroll.
 *
 * If the incoming URL has a hash (e.g. /schools/international-award#assessment),
 * the browser handles the anchor scroll — we don't override it.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
