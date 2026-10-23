import { describe, it, expect } from 'vitest'
import {
  SESSION_TTL_SECONDS,
  hasRole,
  passwordMatches,
  signSession,
  verifySession,
} from '@/lib/padi-check/session'
import { toCounts, toGateResult, toRoster, type GateResult, type RosterEntry, type SheetClient } from '@/lib/padi-check/sheet'
import {
  ROSTER_MAX_AGE_MS,
  checkCode,
  createMemoryGateStore,
  gateCounts,
  lagosTime,
  maintain,
  normaliseCode,
  refreshRoster,
} from '@/lib/padi-check/gate'

const SECRET = 'test-secret-not-real'
const NOW = Date.UTC(2026, 9, 31, 18, 0, 0) // 19:00 in Lagos

describe('Padi Check sessions', () => {
  it('verifies a fresh token and reports its role', () => {
    const s = verifySession(signSession('volunteer', SECRET, NOW), SECRET, NOW)
    expect(s?.role).toBe('volunteer')
    expect(s?.expiry).toBe(NOW / 1000 + SESSION_TTL_SECONDS)
  })

  it('rejects an expired token', () => {
    const token = signSession('admin', SECRET, NOW)
    expect(verifySession(token, SECRET, NOW + SESSION_TTL_SECONDS * 1000)).toBeNull()
    expect(verifySession(token, SECRET, NOW + SESSION_TTL_SECONDS * 1000 - 1000)?.role).toBe('admin')
  })

  it('rejects a tampered token (AC-R003-02)', () => {
    const token = signSession('volunteer', SECRET, NOW)
    const [, expiry, sig] = token.split('.')
    expect(verifySession(`admin.${expiry}.${sig}`, SECRET, NOW)).toBeNull()
    expect(verifySession(`volunteer.${Number(expiry) + 3600}.${sig}`, SECRET, NOW)).toBeNull()
    expect(verifySession(token.slice(0, -2) + 'xx', SECRET, NOW)).toBeNull()
    expect(verifySession(token, 'another-secret', NOW)).toBeNull()
  })

  it('rejects unknown roles, junk and empty input', () => {
    expect(verifySession('owner.9999999999.abc', SECRET, NOW)).toBeNull()
    expect(verifySession('nonsense', SECRET, NOW)).toBeNull()
    expect(verifySession(undefined, SECRET, NOW)).toBeNull()
    expect(verifySession(signSession('volunteer', SECRET, NOW), '', NOW)).toBeNull()
  })

  it('gives admin everything and the volunteer only the gate (AC-R003-01)', () => {
    const vol = verifySession(signSession('volunteer', SECRET, NOW), SECRET, NOW)
    const adm = verifySession(signSession('admin', SECRET, NOW), SECRET, NOW)
    expect(hasRole(vol, 'volunteer')).toBe(true)
    expect(hasRole(vol, 'admin')).toBe(false)
    expect(hasRole(adm, 'admin')).toBe(true)
    expect(hasRole(adm, 'volunteer')).toBe(true)
    expect(hasRole(null, 'volunteer')).toBe(false)
  })

  it('compares passwords exactly, and never matches an unset one', () => {
    expect(passwordMatches('green-tent-sunrise', 'green-tent-sunrise')).toBe(true)
    expect(passwordMatches('green-tent-sunris', 'green-tent-sunrise')).toBe(false)
    expect(passwordMatches('', '')).toBe(false)
    expect(passwordMatches('anything', undefined)).toBe(false)
    expect(passwordMatches(12345, '12345')).toBe(false)
  })
})

describe('Padi Check mapping (AC-R002-02)', () => {
  const leaky = {
    ok: true,
    status: 'welcome',
    name: 'Ada Obi',
    ticket: 'Sleepover single (1 person)',
    usesTent: true,
    checkedInAt: '2026-10-31T19:05:00',
    checkedIn: 3,
    total: 80,
    email: 'ada@example.com',
    phone: '+2348000000000',
    instagram: '@ada',
    price: 30000,
  }

  it('keeps only the gate fields, whatever the script sends', () => {
    const r = toGateResult(leaky)
    expect(Object.keys(r).sort()).toEqual(
      ['checkedIn', 'checkedInAt', 'name', 'status', 'ticket', 'total', 'usesTent'].sort(),
    )
    expect(JSON.stringify(r)).not.toMatch(/ada@example|\+234|@ada|30000/)
  })

  it('treats anything without a known status as offline', () => {
    // Session 1.2: Google once answered a check-in with the doGet heartbeat.
    expect(toGateResult({ ok: true, service: 'mad-settings-signups', signups: 6 })).toEqual({ status: 'offline' })
    expect(toGateResult({ ok: false, error: 'unauthorised' })).toEqual({ status: 'offline' })
    expect(toGateResult({ ok: true, status: 'maybe' })).toEqual({ status: 'offline' })
    expect(toGateResult(null)).toEqual({ status: 'offline' })
    expect(toGateResult('<html>')).toEqual({ status: 'offline' })
  })

  it('reduces the roster to name, code, ticket, tent and arrival time', () => {
    const roster = toRoster({
      ok: true,
      roster: [
        { ...leaky, code: ' mad-abc234 ', ticketLabel: 'Attendance only (no tent)', usesTent: false },
        { name: 'No code' },
      ],
    })
    expect(roster).toEqual([
      {
        name: 'Ada Obi',
        code: 'MAD-ABC234',
        ticketLabel: 'Attendance only (no tent)',
        usesTent: false,
        checkedInAt: '2026-10-31T19:05:00',
      },
    ])
    expect(toRoster({ ok: false })).toBeNull()
  })

  it('reads counts only when both are numbers', () => {
    expect(toCounts({ ok: true, checkedIn: 2, total: 5 })).toEqual({ checkedIn: 2, total: 5 })
    expect(toCounts({ ok: true, checkedIn: 2 })).toBeNull()
  })
})

describe('Padi Check code shape', () => {
  it('trims and upper-cases a typed code', () => {
    expect(normaliseCode('  mad-b8k2mq ')).toBe('MAD-B8K2MQ')
  })

  it('refuses anything not shaped like a MAD code', () => {
    for (const bad of ['', 'MAD-', 'MAD-B8K2M', 'SCN-B8K2MQ', 'MAD-B8K2MO', 'MAD-B8K2MQ|Ada|Single', 42, null]) {
      expect(normaliseCode(bad)).toBeNull()
    }
  })

  it('formats Lagos time as the sheet stores it', () => {
    expect(lagosTime(NOW)).toBe('2026-10-31T19:00:00')
  })
})

// ─── The gate's fast memory ────────────────────────────────────────────────

const ADA = 'MAD-ADA234'
const BAYO = 'MAD-BAY234'
const LATE = 'MAD-LAT234'

/** A pretend sheet that behaves like the Apps Script and records every call. */
function fakeSheet(opts: { down?: boolean } = {}) {
  const rows = new Map<string, { name: string; ticket: string; usesTent: boolean; paid: boolean; arrived?: string }>([
    [ADA, { name: 'Ada', ticket: 'Sleepover single (1 person)', usesTent: true, paid: true }],
    [BAYO, { name: 'Bayo', ticket: 'Attendance only (no tent)', usesTent: false, paid: false }],
  ])
  const calls: string[] = []
  const state = { down: !!opts.down }
  const counts = () => ({
    checkedIn: [...rows.values()].filter((r) => r.arrived).length,
    total: [...rows.values()].filter((r) => r.paid).length,
  })
  const client: SheetClient = {
    async checkIn(code, at) {
      calls.push(`checkin ${code}${at ? ' @' + at : ''}`)
      if (state.down) return { status: 'offline' }
      const r = rows.get(code)
      if (!r) return { status: 'not-found', ...counts() }
      const guest = { name: r.name, ticket: r.ticket, usesTent: r.usesTent }
      if (!r.paid) return { status: 'not-paid', ...guest, ...counts() }
      if (r.arrived) return { status: 'already', ...guest, checkedInAt: r.arrived, ...counts() }
      r.arrived = at ?? '2026-10-31T19:30:00'
      return { status: 'welcome', ...guest, checkedInAt: r.arrived, ...counts() } as GateResult
    },
    async stats() {
      calls.push('stats')
      return state.down ? null : counts()
    },
    async roster() {
      calls.push('roster')
      if (state.down) return null
      const out: RosterEntry[] = []
      for (const [code, r] of rows) {
        if (!r.paid) continue
        out.push({ name: r.name, code, ticketLabel: r.ticket, usesTent: r.usesTent, ...(r.arrived ? { checkedInAt: r.arrived } : {}) })
      }
      return out
    },
  }
  return { client, rows, calls, state }
}

async function runAll(tasks: Array<() => Promise<void>>) {
  for (const t of tasks) await t()
}

describe('Padi Check gate memory', () => {
  it('answers a known guest from memory, then writes the arrival to the sheet', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await refreshRoster(store, sheet.client, NOW)
    sheet.calls.length = 0

    const first = await checkCode(ADA, { store, sheet: sheet.client, now: NOW })
    expect(first.result).toEqual({
      status: 'welcome',
      name: 'Ada',
      ticket: 'Sleepover single (1 person)',
      usesTent: true,
      checkedInAt: '2026-10-31T19:00:00',
      checkedIn: 1,
      total: 1,
    })
    expect(sheet.calls).toEqual([]) // the guest did not wait for the sheet
    expect(await store.pending(10)).toEqual([[ADA, '2026-10-31T19:00:00']])

    await runAll(first.background)
    expect(sheet.calls).toEqual([`checkin ${ADA} @2026-10-31T19:00:00`])
    expect(sheet.rows.get(ADA)?.arrived).toBe('2026-10-31T19:00:00')
    expect(await store.pending(10)).toEqual([])
  })

  it('says already on the second scan, with the first time, and replays it for the Scan log', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await refreshRoster(store, sheet.client, NOW)
    await checkCode(ADA, { store, sheet: sheet.client, now: NOW })

    const again = await checkCode(ADA, { store, sheet: sheet.client, now: NOW + 60_000 })
    expect(again.result.status).toBe('already')
    expect(again.result.checkedInAt).toBe('2026-10-31T19:00:00')
    sheet.calls.length = 0
    await runAll(again.background)
    expect(sheet.calls).toEqual([`checkin ${ADA} @2026-10-31T19:00:00`])
  })

  it('lets exactly one of two simultaneous scans through', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await refreshRoster(store, sheet.client, NOW)
    const [a, b] = await Promise.all([
      checkCode(ADA, { store, sheet: sheet.client, now: NOW }),
      checkCode(ADA, { store, sheet: sheet.client, now: NOW }),
    ])
    expect([a.result.status, b.result.status].sort()).toEqual(['already', 'welcome'])
  })

  it('asks the sheet about codes it does not know: unpaid, unknown, and late sign-ups', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await refreshRoster(store, sheet.client, NOW)

    expect((await checkCode(BAYO, { store, sheet: sheet.client })).result.status).toBe('not-paid')
    expect((await checkCode('MAD-ZZZZZZ', { store, sheet: sheet.client })).result.status).toBe('not-found')

    sheet.rows.set(LATE, { name: 'Late', ticket: 'Attendance only (no tent)', usesTent: false, paid: true })
    const late = await checkCode(LATE, { store, sheet: sheet.client, now: NOW })
    expect(late.result.status).toBe('welcome')
    // Remembered, so the next scan is instant and says already.
    sheet.calls.length = 0
    expect((await checkCode(LATE, { store, sheet: sheet.client, now: NOW })).result.status).toBe('already')
    expect(sheet.calls).toEqual([])
  })

  it('keeps the gate open when the sheet is down, and catches up when it returns', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await refreshRoster(store, sheet.client, NOW)
    sheet.state.down = true

    const r = await checkCode(ADA, { store, sheet: sheet.client, now: NOW })
    expect(r.result.status).toBe('welcome')
    await runAll(r.background)
    expect(await store.pending(10)).toHaveLength(1) // not confirmed, kept for retry
    expect((await checkCode('MAD-ZZZZZZ', { store, sheet: sheet.client })).result.status).toBe('offline')

    sheet.state.down = false
    await maintain(store, sheet.client, NOW + 1000)
    expect(await store.pending(10)).toEqual([])
    expect(sheet.rows.get(ADA)?.arrived).toBe('2026-10-31T19:00:00')
  })

  it('with no memory at all, asks the sheet for everything', async () => {
    const sheet = fakeSheet()
    expect((await checkCode(ADA, { store: null, sheet: sheet.client })).result.status).toBe('welcome')
    expect(sheet.calls).toEqual([`checkin ${ADA}`])
    expect(await gateCounts(null, sheet.client)).toEqual({ checkedIn: 1, total: 1 })
  })

  it('refreshes a stale list, learns arrivals from the sheet, and drops removed guests', async () => {
    const store = createMemoryGateStore()
    const sheet = fakeSheet()
    await maintain(store, sheet.client, NOW) // first load
    expect(await store.getGuest(ADA)).not.toBeNull()

    sheet.rows.get(ADA)!.arrived = '2026-10-31T18:45:00' // marked by hand in the sheet
    sheet.calls.length = 0
    await maintain(store, sheet.client, NOW + 1000)
    expect(sheet.calls).toEqual([]) // not stale yet

    await maintain(store, sheet.client, NOW + ROSTER_MAX_AGE_MS + 1000)
    const r = await checkCode(ADA, { store, sheet: sheet.client })
    expect(r.result.status).toBe('already')
    expect(r.result.checkedInAt).toBe('2026-10-31T18:45:00')

    sheet.rows.delete(ADA)
    await refreshRoster(store, sheet.client, NOW + 2 * ROSTER_MAX_AGE_MS)
    expect(await store.getGuest(ADA)).toBeNull()
    expect(await store.counts()).toEqual({ checkedIn: 0, total: 0 })
  })
})
