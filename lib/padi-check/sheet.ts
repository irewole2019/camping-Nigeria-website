/**
 * Padi Check's calls to the MAD Settings Apps Script (usl-build/7-prd.md,
 * R-001 and R-002). Server-only: the script URL and secret never reach the
 * browser.
 *
 * The script is slow and uneven — Session 1.2 measured a median of 4.8 s and
 * a third of calls past 15 s — so the gate does not wait on it for guests it
 * already knows (see `./gate.ts`). These calls are the slow path and the
 * background write.
 */

import { tribeFromName } from '@/lib/events/mad-settings-tribes'

export type ScanStatus = 'welcome' | 'already' | 'not-found' | 'not-paid'
export type GateStatus = ScanStatus | 'offline'

/**
 * Everything the gate may show. Name, ticket, tent, tribe and a time: never
 * email, phone, Instagram or price, whatever the script sends.
 */
export interface GateResult {
  status: GateStatus
  name?: string
  ticket?: string
  usesTent?: boolean
  /** The tribe's display name ("Kutinga"), only when it is one of the four. */
  tribe?: string
  checkedInAt?: string
  checkedIn?: number
  total?: number
}

export interface RosterEntry {
  name: string
  code: string
  ticketLabel: string
  usesTent: boolean
  /** The tribe's display name, when the row has a valid one. */
  tribe?: string
  /** Present when the sheet already shows the guest as arrived. */
  checkedInAt?: string
}

export const SCRIPT_TIMEOUT_MS = 8000

const SCAN_STATUSES: readonly string[] = ['welcome', 'already', 'not-found', 'not-paid']

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function count(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined
}

/**
 * Turns whatever the script returned into a GateResult, copying only the
 * allowed fields. Anything without a known `status` is `offline`: Google has
 * been seen to answer a check-in with the doGet heartbeat (Session 1.2), and
 * the gate must never read that as a result.
 */
export function toGateResult(raw: unknown): GateResult {
  if (!isRecord(raw) || raw.ok !== true || typeof raw.status !== 'string') {
    return { status: 'offline' }
  }
  if (!SCAN_STATUSES.includes(raw.status)) return { status: 'offline' }

  const out: GateResult = { status: raw.status as ScanStatus }
  if (typeof raw.name === 'string') out.name = raw.name
  if (typeof raw.ticket === 'string') out.ticket = raw.ticket
  if (typeof raw.usesTent === 'boolean') out.usesTent = raw.usesTent
  const tribe = tribeFromName(raw.tribe)
  if (tribe) out.tribe = tribe.name
  if (typeof raw.checkedInAt === 'string') out.checkedInAt = raw.checkedInAt
  const checkedIn = count(raw.checkedIn)
  const total = count(raw.total)
  if (checkedIn !== undefined) out.checkedIn = checkedIn
  if (total !== undefined) out.total = total
  return out
}

/** The roster reply, reduced to well-formed entries with only the allowed fields. */
export function toRoster(raw: unknown): RosterEntry[] | null {
  if (!isRecord(raw) || raw.ok !== true || !Array.isArray(raw.roster)) return null
  const out: RosterEntry[] = []
  for (const r of raw.roster) {
    if (!isRecord(r) || typeof r.code !== 'string' || !r.code.trim()) continue
    const entry: RosterEntry = {
      name: typeof r.name === 'string' ? r.name : '',
      code: r.code.trim().toUpperCase(),
      ticketLabel: typeof r.ticketLabel === 'string' ? r.ticketLabel : '',
      usesTent: r.usesTent === true,
    }
    const tribe = tribeFromName(r.tribe)
    if (tribe) entry.tribe = tribe.name
    if (typeof r.checkedInAt === 'string' && r.checkedInAt) entry.checkedInAt = r.checkedInAt
    out.push(entry)
  }
  return out
}

export interface Counts {
  checkedIn: number
  total: number
}

export function toCounts(raw: unknown): Counts | null {
  if (!isRecord(raw) || raw.ok !== true) return null
  const checkedIn = count(raw.checkedIn)
  const total = count(raw.total)
  return checkedIn === undefined || total === undefined ? null : { checkedIn, total }
}

/** POSTs one action to the script; null on timeout, network error or bad JSON. */
async function callScript(body: Record<string, unknown>): Promise<unknown> {
  const url = process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL
  const secret = process.env.PADI_CHECK_SCRIPT_SECRET
  if (!url || !secret) return null
  try {
    // Apps Script answers a POST with a redirect to googleusercontent.com;
    // fetch follows it as a GET, which is what the script expects.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, secret }),
      signal: AbortSignal.timeout(SCRIPT_TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** The sheet's own check-in. `at` is the gate's arrival time, if it has one. */
export async function sheetCheckIn(code: string, at?: string): Promise<GateResult> {
  return toGateResult(await callScript({ action: 'checkin', code, ...(at ? { at } : {}) }))
}

export async function sheetStats(): Promise<Counts | null> {
  return toCounts(await callScript({ action: 'stats' }))
}

export async function sheetRoster(): Promise<RosterEntry[] | null> {
  return toRoster(await callScript({ action: 'roster' }))
}

export interface SheetClient {
  checkIn: typeof sheetCheckIn
  stats: typeof sheetStats
  roster: typeof sheetRoster
}

export const sheet: SheetClient = { checkIn: sheetCheckIn, stats: sheetStats, roster: sheetRoster }
