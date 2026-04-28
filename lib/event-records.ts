/**
 * Persists registrations to a Google Sheet via an Apps Script webhook.
 *
 * Why a webhook (not the Sheets API directly): Apps Script Web Apps require
 * no Google Cloud project, no service account JSON, no OAuth dance — paste
 * a small script in the target sheet, deploy as a Web App, paste the URL in
 * env. Same low-friction pattern as the gear-rental items CSV.
 *
 * Failure is non-blocking. The Resend email send is the source of truth for
 * "we received this registration"; the Sheet is a convenience for ops. If
 * the webhook is down, log it and let the email path proceed — the team
 * still has the lead in the internal email and can hand-add the row.
 */

export interface SheetRecordPayload {
  reference: string
  total: number
  status: 'pending' | 'confirmed' | 'abandoned'
  parent: { fullName: string; email: string; phone: string; city: string }
  emergencyContact: { name: string; phone: string }
  children: Array<{ fullName: string; age: number; allergies: string; photoConsent: boolean }>
  notes: string
}

export interface RecordResult {
  ok: boolean
  error?: string
}

/**
 * Generates a registration reference like BCK-2026-AB12CD.
 * 32-char alphabet excluding ambiguous glyphs (0/O, 1/I/L) so refs are
 * easy to read aloud and re-key from a printed receipt.
 */
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateReference(): string {
  const year = new Date().getFullYear()
  let suffix = ''
  for (let i = 0; i < 6; i += 1) {
    suffix += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]
  }
  return `BCK-${year}-${suffix}`
}

export async function recordRegistration(payload: SheetRecordPayload): Promise<RecordResult> {
  const url = process.env.GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL
  if (!url) {
    return { ok: false, error: 'GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL not set' }
  }

  try {
    // Apps Script Web Apps respond to POSTs but redirect through googleusercontent.com
    // on success; `redirect: 'follow'` (the default) handles that automatically.
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
