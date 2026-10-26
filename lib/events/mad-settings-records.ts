/**
 * MAD Settings sign-up codes, and persistence to a Google Sheet.
 *
 * A copy of `./camp-night-records` with its own tag, sheet and env var rather
 * than a shared abstraction, for the reason given there: separate events,
 * separate sheets, separate lifetimes. Instagram normalisation is reused, not
 * copied — it is a pure string helper with no event in it.
 */

import type { TicketId } from '@/lib/events/mad-settings'
import { tribeFromName, type Tribe } from '@/lib/events/mad-settings-tribes'

export { normaliseInstagram } from '@/lib/events/camp-night-records'

export interface MadSettingsSheetPayload {
  /** The MAD code. Unique per signee; the thing the team looks up. */
  code: string
  name: string
  email: string
  phone: string
  /** Stored with a single leading @, or empty if not given. */
  instagram: string
  ticketId: TicketId
  ticketLabel: string
  /**
   * Whether this ticket takes a tent. The Apps Script counts only these
   * against TENT_CAP, so attendance-only sign-ups are never refused as full.
   */
  usesTent: boolean
  price: number
  /** `Yes` whenever the guest ticked "I have already paid" — see PAYMENT_IS_OFFLINE. */
  paid: 'Yes' | 'No'
}

export interface RecordResult {
  ok: boolean
  error?: string
  /**
   * The tribe the sheet assigned (least-filled, under its lock). Absent when
   * the row was not recorded, or when the live script predates tribes — the
   * caller falls back to `tribeFromCode` and flags it in the internal email.
   */
  tribe?: Tribe
}

/** Same alphabet as Camp Night: no 0/O, no 1/I. See CODE_ALPHABET there. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const CODE_TAG = 'MAD'

/**
 * Generates a sign-up code like `MAD-B8K2MQ`. Random, not sequential, with the
 * Apps Script rejecting a duplicate — the reasoning is on
 * `generateSignupCode` in `./camp-night-records`.
 */
export function generateSignupCode(): string {
  let suffix = ''
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `${CODE_TAG}-${suffix}`
}

/** Shape check for a code, used by the confirmation page and any lookup. */
export function isValidSignupCode(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    new RegExp(`^${CODE_TAG}-[${CODE_ALPHABET}]{${CODE_LENGTH}}$`).test(v)
  )
}

/**
 * Appends a sign-up to the MAD Settings sheet via its Apps Script webhook.
 * Non-blocking on failure, except `duplicate-code` (the caller retries) and
 * `tents-full` (the caller refuses the sign-up) — same contract as Camp Night.
 */
export async function recordMadSettingsSignup(
  payload: MadSettingsSheetPayload,
): Promise<RecordResult> {
  const url = process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL
  if (!url) {
    return { ok: false, error: 'GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL not set' }
  }

  try {
    // Apps Script Web Apps redirect through googleusercontent.com on success;
    // fetch follows redirects by default, which handles that.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return { ok: false, error: `Sheets webhook returned ${res.status}` }
    }

    const json: unknown = await res.json().catch(() => null)
    if (json && typeof json === 'object' && 'ok' in json) {
      const result = json as { ok: boolean; error?: string; tribe?: unknown }
      if (!result.ok) return { ok: false, error: result.error || 'unknown' }
      const tribe = tribeFromName(result.tribe)
      return tribe ? { ok: true, tribe } : { ok: true }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
