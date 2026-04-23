/**
 * HTML-escape a string for safe interpolation into email templates
 * or any other HTML output. Prevents injection of tags, attribute
 * breakouts, and event handlers.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Validate a URL string. Returns the URL only if it uses http or
 * https (blocks javascript:, data:, vbscript:, etc.). Bare hostnames
 * like "example.com" are upgraded to https://example.com. Invalid
 * URLs return an empty string.
 */
export function safeUrl(url: unknown): string {
  if (!url) return ''
  const trimmed = String(url).trim()
  if (!trimmed) return ''

  try {
    const u = new URL(trimmed)
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      return u.toString()
    }
  } catch {
    try {
      const u = new URL(`https://${trimmed}`)
      if (u.protocol === 'https:') return u.toString()
    } catch {
      // fall through
    }
  }
  return ''
}

/**
 * Honeypot check. Real users never fill the `website_confirm` field because
 * it's positioned off-screen and excluded from the tab order. Drive-by bots
 * autofill anything website-shaped, so a non-empty value is a strong signal
 * the request came from a scraper. Callers should return fake success
 * (`{ success: true }` with 200) so bots can't distinguish a trip from a real
 * send and don't retry.
 */
export function isHoneypotTripped(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  const v = (body as Record<string, unknown>).website_confirm
  return typeof v === 'string' && v.trim() !== ''
}

/**
 * Reasonable max lengths for user-supplied free-text fields. These are
 * generous for real input but tight enough to refuse junk payloads stuffing
 * megabytes through the form API.
 */
export const MAX_LENGTHS = {
  name: 120,
  email: 254, // RFC 5321 practical max
  phone: 40,
  subject: 160,
  organization: 200,
  schoolName: 200,
  role: 120,
  website: 200,
  shortText: 300,
  longText: 4000,
} as const

/** True if every field in `fields` fits within its declared cap. */
export function withinLengthCaps(fields: Array<[string, number]>): boolean {
  for (const [value, max] of fields) {
    if (typeof value !== 'string') return false
    if (value.length > max) return false
  }
  return true
}
