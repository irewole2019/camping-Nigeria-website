/**
 * What Vercel Analytics may record, decided before anything is sent.
 *
 * - Padi Check (`/padi-check` and below) records nothing: it is an internal
 *   tool, and PRD Section 9 says no analytics there.
 * - Sign-up confirmation pages (`.../registered`) carry the guest's name and
 *   code in the query string, so the query is dropped and only the path is
 *   kept. Found in the Session 3.1 sweep, 2026-10-25.
 * - Everything else is recorded as it is, UTM parameters included.
 *
 * Returns the URL to record, or null to record nothing.
 */
export function scrubAnalyticsUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return raw
  }
  if (isPadiCheckPath(url.pathname)) return null
  if (/\/registered\/?$/.test(url.pathname)) url.search = ''
  return url.toString()
}

export function isPadiCheckPath(pathname: string | null | undefined): boolean {
  return pathname === '/padi-check' || !!pathname?.startsWith('/padi-check/')
}
