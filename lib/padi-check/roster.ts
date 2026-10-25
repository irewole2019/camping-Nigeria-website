import { DETAIL_COPY } from './copy'
import type { RosterEntry } from './sheet'

/**
 * The printed guest list (R-011): name, code, ticket and tent, sorted by
 * name. Nothing else reaches the page, whatever the roster carries.
 */
export interface PrintedGuest {
  name: string
  code: string
  ticket: string
  tent: string
}

export function toPrintedList(roster: RosterEntry[]): PrintedGuest[] {
  return roster
    .map((r) => ({
      name: r.name.trim(),
      code: r.code,
      ticket: r.ticketLabel,
      tent: r.usesTent ? DETAIL_COPY.tent : DETAIL_COPY.noTent,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.code.localeCompare(b.code))
}

/** "+2348012345678" → "+234 801 234 5678" for print. Anything else is shown as given. */
export function formatPhoneForPrint(raw: string | undefined): string {
  const digits = (raw ?? '').replace(/[^\d+]/g, '')
  const m = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(digits)
  return m ? `+234 ${m[1]} ${m[2]} ${m[3]}` : (raw ?? '').trim()
}

/** "25 Oct 2026, 4:05 PM" in Lagos, for the list's printed timestamp. */
export function lagosStamp(now = Date.now()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(now)
    .replace(/\b(am|pm)\b/, (s) => s.toUpperCase())
}
