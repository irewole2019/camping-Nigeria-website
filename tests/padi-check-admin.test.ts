import { describe, it, expect, beforeAll } from 'vitest'
import { NextRequest } from 'next/server'
import { CARD_COPY, LIST_COPY } from '@/lib/padi-check/copy'
import { formatPhoneForPrint, lagosStamp, toPrintedList } from '@/lib/padi-check/roster'
import { SESSION_COOKIE, signSession } from '@/lib/padi-check/session'
import { toRoster } from '@/lib/padi-check/sheet'
import { GET as rosterRoute } from '@/app/api/padi-check/roster/route'

describe('printed guest list (AC-R011-01)', () => {
  // Shaped like the script's roster reply, with everything a sheet row could leak.
  const raw = {
    ok: true,
    roster: [
      { name: 'Zainab Bello', code: 'MAD-ZZZ234', ticketLabel: 'Attendance only (no tent)', usesTent: false, email: 'z@example.com', phone: '+2348000000001' },
      { name: 'ada Obi', code: 'MAD-AAA234', ticketLabel: 'Sleepover single (1 person)', usesTent: true, instagram: '@ada', price: 30000, checkedInAt: '2026-10-31T19:05:00' },
    ],
  }

  it('keeps name, code, ticket and tent only, and never email or phone', () => {
    const list = toPrintedList(toRoster(raw)!)
    for (const g of list) expect(Object.keys(g).sort()).toEqual(['code', 'name', 'tent', 'ticket'])
    expect(JSON.stringify(list)).not.toMatch(/example\.com|\+234|@ada|30000/)
  })

  it('sorts by name, ignoring case, and labels the tent', () => {
    expect(toPrintedList(toRoster(raw)!)).toEqual([
      { name: 'ada Obi', code: 'MAD-AAA234', ticket: 'Sleepover single (1 person)', tent: 'Tent' },
      { name: 'Zainab Bello', code: 'MAD-ZZZ234', ticket: 'Attendance only (no tent)', tent: 'No tent' },
    ])
  })

  it('formats the print stamp and the count', () => {
    expect(lagosStamp(Date.UTC(2026, 9, 31, 18, 5))).toBe('31 Oct 2026, 7:05 PM')
    expect(LIST_COPY.count(1)).toBe('1 paid guest')
    expect(LIST_COPY.count(80)).toBe('80 paid guests')
  })
})

describe('Gate card (Surface 6, AC-R010-01)', () => {
  it('uses the agreed words', () => {
    expect(CARD_COPY.rows.map((r) => `${r.lead} ${r.text}`)).toEqual([
      'Green, Welcome in: let them in. Hand a tent to "Tent" guests.',
      'Orange, Already checked in: do not let in yet. Call Toyosi.',
      'Red: do not turn anyone away. Call Toyosi.',
      'Grey, Cannot reach the list: try again. Still stuck? Use the Lookup tab in the Sheet.',
    ])
    expect(`${CARD_COPY.never.lead} ${CARD_COPY.never.text}`).toBe("Never show or read out a guest's details to anyone else.")
  })

  it('prints the Toyosi number in groups', () => {
    expect(formatPhoneForPrint('+2348012345678')).toBe('+234 801 234 5678')
    expect(formatPhoneForPrint('+234 801 234 5678')).toBe('+234 801 234 5678')
    expect(formatPhoneForPrint(undefined)).toBe('')
  })
})

describe('GET /api/padi-check/roster (AC-R003-01)', () => {
  const SECRET = 'test-session-secret-not-real'
  beforeAll(() => {
    process.env.PADI_CHECK_SESSION_SECRET = SECRET
  })
  const call = (cookie?: string) =>
    rosterRoute(new NextRequest('https://example.test/api/padi-check/roster', { headers: cookie ? { cookie } : {} }))

  it('401 without a session', async () => {
    expect((await call()).status).toBe(401)
  })

  it('403 for a volunteer', async () => {
    expect((await call(`${SESSION_COOKIE}=${signSession('volunteer', SECRET)}`)).status).toBe(403)
  })

  it('lets an admin through (503 here only because no sheet is configured in tests)', async () => {
    const res = await call(`${SESSION_COOKIE}=${signSession('admin', SECRET)}`)
    expect([200, 503]).toContain(res.status)
  })
})
