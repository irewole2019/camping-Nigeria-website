/**
 * Turning what the volunteer typed, pasted or (from Session 2.2) scanned into
 * the six characters after `MAD-`. The server re-checks the shape; this only
 * keeps the box tidy.
 */

export const CODE_PREFIX = 'MAD-'
export const CODE_CHARS = 6

/**
 * Upper-cases, drops a pasted `MAD-` prefix and anything after a `|` (the
 * Gate pass QR carries `MAD-XXXXXX|Name|Ticket`), removes everything that is
 * not a letter or digit, and keeps at most six characters. A typed `MAD`
 * without the hyphen is kept, because it can be part of a real code.
 */
export function cleanTypedCode(raw: string): string {
  let s = raw.split('|')[0].trim().toUpperCase()
  if (s.startsWith(CODE_PREFIX)) s = s.slice(CODE_PREFIX.length)
  return s.replace(/[^A-Z0-9]/g, '').slice(0, CODE_CHARS)
}

/**
 * The MAD code inside whatever the camera read: a bare code, a Gate pass
 * (`MAD-XXXXXX|Name|Ticket`), or junk. Null when there is no code of the
 * right shape, so the gate can answer not-found without asking anyone.
 * Same alphabet as the codes themselves: no 0, O, 1 or I.
 */
export function extractCode(text: string): string | null {
  const m = /MAD-[A-HJ-NP-Z2-9]{6}(?![A-Z0-9])/.exec(text.toUpperCase())
  return m ? m[0] : null
}

/** "2026-10-31T19:05:00" → "7:05 PM". Anything else comes back unchanged. */
export function formatArrivalTime(stored: string | undefined): string {
  if (!stored) return ''
  const m = /T(\d\d):(\d\d)/.exec(stored)
  if (!m) return stored
  const h = Number(m[1])
  const suffix = h < 12 ? 'AM' : 'PM'
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${suffix}`
}
