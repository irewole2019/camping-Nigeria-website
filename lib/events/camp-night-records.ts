/**
 * Camp Night sign-up codes, and persistence to a Google Sheet.
 *
 * Kept separate from `lib/event-records.ts` (Base Camp Kids) rather than
 * generalised: the two events have different fields, different sheets and
 * different lifetimes, and a shared abstraction over two shapes that will
 * never converge costs more than the duplication saves.
 */

import type { TentPackageId } from '@/lib/events/camp-night'

export interface CampNightSheetPayload {
  /** The SCN code. Unique per signee; the thing the team looks up. */
  code: string
  name: string
  email: string
  phone: string
  /** Stored with a single leading @, or empty if not given. */
  instagram: string
  packageId: TentPackageId
  packageLabel: string
  price: number
  /**
   * Goes straight into the sheet's `Paid?` column. Payment happens offline
   * before sign-up, so this is `Yes` whenever the camper ticked the box that
   * says so — see PAYMENT_IS_OFFLINE in ./camp-night.
   */
  paid: 'Yes' | 'No'
}

export interface RecordResult {
  ok: boolean
  error?: string
}

/**
 * 32-character alphabet with the worst look-alikes removed: no `0` or `O`,
 * no `1` or `I`. Codes get read aloud at a gate at night and re-keyed from a
 * phone screen, so `SCN-B8K2MQ` has to survive that.
 *
 * `L` is deliberately kept. It is the same alphabet Base Camp Kids uses, and
 * uppercase L reads distinctly from `1` in the monospace the code renders in.
 * (The comment on `generateReference` in `lib/event-records.ts` claims L is
 * excluded — it is not, and never was. This one is accurate.)
 */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6

/**
 * Generates a sign-up code like `SCN-B8K2MQ`.
 *
 * **On uniqueness:** this is random, not sequential, because a Google Sheet
 * offers no atomic counter to hand out consecutive numbers. 32^6 is about
 * 1.07 billion combinations, so across a 50-tent event the chance of any two
 * codes colliding is roughly one in twenty million — far below the chance of
 * a duplicate row from a double-submitted form.
 *
 * The Apps Script enforces the real guarantee: it rejects a code that already
 * exists in the sheet, so a collision fails loudly rather than quietly
 * overwriting somebody's booking. See `docs/camp-night/apps-script.gs`.
 */
export function generateSignupCode(): string {
  let suffix = ''
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `SCN-${suffix}`
}

/** Shape check for a code, used by the confirmation page and any lookup. */
export function isValidSignupCode(v: unknown): v is string {
  return typeof v === 'string' && new RegExp(`^SCN-[${CODE_ALPHABET}]{${CODE_LENGTH}}$`).test(v)
}

/**
 * Normalises an Instagram handle to a single leading @, or empty string.
 * Accepts what people actually paste: `@name`, `name`, a profile URL, or a
 * URL with a trailing slash and query string.
 */
export function normaliseInstagram(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  // Pull the handle out of a profile URL if that is what was pasted.
  const urlMatch = trimmed.match(/instagram\.com\/([^/?#\s]+)/i)
  const candidate = urlMatch ? urlMatch[1] : trimmed

  const handle = candidate.replace(/^@+/, '').trim()
  return handle ? `@${handle}` : ''
}

/**
 * Appends a sign-up to the Google Sheet via an Apps Script webhook.
 *
 * Failure is non-blocking, matching the Base Camp Kids pattern: the Resend
 * email is the source of truth that a sign-up happened, and the Sheet is the
 * team's browsable copy. If the webhook is down, log it and let the email
 * proceed — the internal notification still carries every field, so the row
 * can be added by hand.
 *
 * The one case that is NOT silent is a duplicate code: the script returns
 * `{ ok: false, error: 'duplicate-code' }` and the caller retries with a
 * fresh code rather than issuing two people the same one.
 */
export async function recordCampNightSignup(
  payload: CampNightSheetPayload,
): Promise<RecordResult> {
  const url = process.env.GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL
  if (!url) {
    return { ok: false, error: 'GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL not set' }
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
      const result = json as { ok: boolean; error?: string }
      return result.ok ? { ok: true } : { ok: false, error: result.error || 'unknown' }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
