/**
 * One-off: tells MAD Settings guests who signed up before tribes existed
 * (26/10/2026) which tribe the sheet gave them, with the social link.
 *
 * Run from the repo root with vite-node, which resolves the site's `@/`
 * imports through vitest.config.ts:
 *
 *   Preview (default, sends nothing):
 *     npx vite-node -c vitest.config.ts scripts/send-tribe-emails.ts -- \
 *       --before 2026-10-26T16:00:00+01:00 --out <folder>
 *
 *   Send, once the preview has been approved:
 *     npx vite-node -c vitest.config.ts scripts/send-tribe-emails.ts -- \
 *       --before 2026-10-26T16:00:00+01:00 --send --expect <count from preview>
 *
 * --before   Only guests who signed up before this moment: the time the site
 *            started putting tribes in the confirmation email. Everyone after
 *            it already has their tribe.
 * --expect   The send refuses unless exactly this many guests are due, so a
 *            list that changed since the preview is never mailed blind.
 * --out      Where the preview writes one sample email (HTML) and the list.
 *
 * Reads .env.local for the live sheet link, PADI_CHECK_SCRIPT_SECRET and (for
 * --send) RESEND_API_KEY, and never prints them. The link is read from
 * MAD_SETTINGS_LIVE_SHEET_URL, a name only this script uses, so adding it for
 * a send does not make local dev write into the live sheet; remove the line
 * afterwards. GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL is the fallback.
 * Every email that Resend accepts is recorded in .tribe-emails-sent.json
 * (gitignored), and a rerun skips those codes, so a send that stops halfway
 * can simply be run again.
 */

import fs from 'node:fs'
import path from 'node:path'
import { isValidSignupCode } from '@/lib/events/mad-settings-records'
import { tribeFromName, type Tribe } from '@/lib/events/mad-settings-tribes'
import { buildTribeAnnouncementEmail, tribeAnnouncementSubject } from '@/lib/events/mad-settings-email'
import { sendSingleMail } from '@/lib/mail'

const FROM = 'Camping Nigeria <hello@campingnigeria.com>'
const SENT_LOG = path.resolve('.tribe-emails-sent.json')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Resend allows 2 requests a second by default. */
const GAP_MS = 700

interface Guest {
  signedUpAt: string
  code: string
  name: string
  email: string
  tribe: Tribe
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? undefined : process.argv[i + 1]
}

function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {}
  const file = path.resolve('.env.local')
  if (!fs.existsSync(file)) return out
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return out
}

function mask(email: string): string {
  const [user, domain] = email.split('@')
  return `${user.slice(0, 1)}***@${domain}`
}

async function fetchGuests(url: string, secret: string): Promise<Guest[]> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'tribe-mailing', secret }),
  })
  const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; guests?: unknown[] } | null
  if (!json?.ok || !Array.isArray(json.guests)) {
    throw new Error(
      `The sheet did not return the list (${json?.error ?? `HTTP ${res.status}`}). ` +
        'Is the tribes version of the script deployed, and setupTribes() run?',
    )
  }
  const guests: Guest[] = []
  for (const g of json.guests as Record<string, unknown>[]) {
    const code = String(g.code ?? '').trim().toUpperCase()
    const email = String(g.email ?? '').trim()
    const tribe = tribeFromName(g.tribe)
    if (!isValidSignupCode(code) || !EMAIL_RE.test(email) || !tribe) {
      console.warn(`  skipped a row that is not mailable (code ${code || '(blank)'})`)
      continue
    }
    guests.push({ signedUpAt: String(g.signedUpAt ?? ''), code, name: String(g.name ?? ''), email, tribe })
  }
  return guests
}

async function main() {
  const before = arg('before')
  const cutoff = before ? Date.parse(before) : NaN
  if (!Number.isFinite(cutoff)) throw new Error('Give --before with a date and time, e.g. 2026-10-26T16:00:00+01:00')

  const env = loadEnvLocal()
  const url = env.MAD_SETTINGS_LIVE_SHEET_URL || env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL
  const secret = env.PADI_CHECK_SCRIPT_SECRET
  if (!url || !secret) throw new Error('.env.local needs MAD_SETTINGS_LIVE_SHEET_URL (the live Web app URL) and PADI_CHECK_SCRIPT_SECRET')

  const sent: Record<string, string> = fs.existsSync(SENT_LOG) ? JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')) : {}
  const all = await fetchGuests(url, secret)
  const due = all.filter((g) => {
    const t = Date.parse(g.signedUpAt)
    return Number.isFinite(t) && t < cutoff && !sent[g.code]
  })

  const byTribe: Record<string, number> = {}
  for (const g of due) byTribe[g.tribe.name] = (byTribe[g.tribe.name] ?? 0) + 1
  console.log(`Paid guests with a tribe: ${all.length}`)
  console.log(`Due this email (signed up before ${before}, not yet sent): ${due.length}`)
  console.log(`  by tribe: ${JSON.stringify(byTribe)}`)
  if (Object.keys(sent).length) console.log(`  already sent earlier and skipped: ${Object.keys(sent).length}`)

  if (!process.argv.includes('--send')) {
    const out = arg('out')
    if (out) {
      fs.mkdirSync(out, { recursive: true })
      const sample = due[0] ?? all[0]
      if (sample) {
        fs.writeFileSync(path.join(out, 'tribe-email-sample.html'), buildTribeAnnouncementEmail(sample, sample.tribe))
      }
      const lines = due.map((g) => `${g.name}\t${g.tribe.name}\t${mask(g.email)}\t${g.code}`)
      fs.writeFileSync(path.join(out, 'tribe-email-list.tsv'), ['Name\tTribe\tEmail\tCode', ...lines].join('\n'))
      console.log(`Preview written to ${out} (one sample email and the list). Nothing was sent.`)
    } else {
      console.log('Preview only. Nothing was sent. Add --out <folder> to save a sample email and the list.')
    }
    return
  }

  const expected = Number(arg('expect'))
  if (!Number.isInteger(expected) || expected !== due.length) {
    throw new Error(`Refusing to send: ${due.length} guests are due, but --expect says ${arg('expect') ?? '(missing)'}. Preview again.`)
  }
  const resendKey = env.RESEND_API_KEY
  if (!resendKey) throw new Error('.env.local needs RESEND_API_KEY to send')

  let ok = 0
  let failed = 0
  for (const g of due) {
    const accepted = await sendSingleMail(resendKey, {
      from: FROM,
      to: [g.email],
      subject: tribeAnnouncementSubject(g.tribe),
      html: buildTribeAnnouncementEmail(g, g.tribe),
    })
    if (accepted) {
      ok += 1
      sent[g.code] = new Date().toISOString()
      fs.writeFileSync(SENT_LOG, JSON.stringify(sent, null, 2))
    } else {
      failed += 1
      console.warn(`  not accepted by Resend: ${g.code}`)
    }
    await new Promise((r) => setTimeout(r, GAP_MS))
  }
  console.log(`Sent ${ok}. Not accepted: ${failed}.${failed ? ' Run the same command again to retry just those.' : ''}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
