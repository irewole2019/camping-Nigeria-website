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
