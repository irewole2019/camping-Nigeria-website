import { describe, it, expect } from 'vitest'
import { BUTTON_COPY, DETAIL_COPY, LOGIN_COPY, RESULTS, SCANNER_COPY } from '@/lib/padi-check/copy'
import { cleanTypedCode, formatArrivalTime } from '@/lib/padi-check/extract-code'
import { countsFrom, toScreen } from '@/lib/padi-check/screen'

describe('Padi Check copy (usl-build/6-landing-page-copy.md, Surfaces 4 and 5)', () => {
  it('uses the agreed words for each result', () => {
    expect(Object.fromEntries(Object.entries(RESULTS).map(([k, v]) => [k, v.word]))).toEqual({
      welcome: 'Welcome in',
      already: 'Already checked in',
      'not-found': 'We cannot find this code',
      'not-paid': 'Not marked as paid',
      offline: 'Cannot reach the list',
      'camera-off': 'The camera is off',
    })
  })

  it('puts the agreed buttons on each result', () => {
    expect(RESULTS.welcome.buttons).toEqual(['next'])
    expect(RESULTS.already.buttons).toEqual(['call', 'next'])
    expect(RESULTS['not-found'].buttons).toEqual(['call', 'retry'])
    expect(RESULTS['not-paid'].buttons).toEqual(['call', 'next'])
    expect(RESULTS.offline.buttons).toEqual(['retry'])
    expect(RESULTS['camera-off'].buttons).toEqual([])
  })

  it('keeps the house rules: no contractions, none of the banned words', () => {
    const all = JSON.stringify([LOGIN_COPY, SCANNER_COPY, BUTTON_COPY, DETAIL_COPY, RESULTS, SCANNER_COPY.count(1, 2)])
    expect(all).not.toMatch(/\b(can't|cannot't|don't|didn't|isn't|won't|we're|you're|it's|let's)\b/i)
    expect(all).not.toMatch(/invalid|denied|secure|fraud/i)
  })

  it('uses a distinct word for every state, so each reads without colour (AC-R005-01)', () => {
    const words = Object.values(RESULTS).map((r) => r.word)
    expect(new Set(words).size).toBe(words.length)
  })
})

describe('Padi Check code box', () => {
  it('upper-cases and keeps six characters', () => {
    expect(cleanTypedCode('b8k2mq')).toBe('B8K2MQ')
    expect(cleanTypedCode('b8k2mqxyz')).toBe('B8K2MQ')
  })

  it('accepts a pasted code or a whole Gate pass QR', () => {
    expect(cleanTypedCode('MAD-B8K2MQ')).toBe('B8K2MQ')
    expect(cleanTypedCode(' mad-b8k2mq ')).toBe('B8K2MQ')
    expect(cleanTypedCode('MAD-B8K2MQ|Ada Obi|Sleepover single (1 person)')).toBe('B8K2MQ')
  })

  it('keeps a typed MAD without a hyphen, which can be part of a real code', () => {
    expect(cleanTypedCode('MADK2Q')).toBe('MADK2Q')
  })

  it('drops spaces and punctuation', () => {
    expect(cleanTypedCode('b8 k2-mq')).toBe('B8K2MQ')
  })
})

describe('Padi Check arrival time', () => {
  it('shows the sheet time as h:mm am/pm', () => {
    expect(formatArrivalTime('2026-10-31T19:05:00')).toBe('7:05 pm')
    expect(formatArrivalTime('2026-10-31T00:30:00')).toBe('12:30 am')
    expect(formatArrivalTime('2026-10-31T12:00:00')).toBe('12:00 pm')
    expect(formatArrivalTime('2026-10-31T09:41:12')).toBe('9:41 am')
  })

  it('passes anything else through, and blank stays blank', () => {
    expect(formatArrivalTime('Yes')).toBe('Yes')
    expect(formatArrivalTime(undefined)).toBe('')
  })
})

describe('Padi Check result content (AC-R005-03)', () => {
  const leaky = {
    name: 'Ada Obi',
    ticket: 'Sleepover single (1 person)',
    usesTent: true,
    checkedInAt: '2026-10-31T19:05:00',
    email: 'ada@example.com',
    phone: '+2348000000000',
  }

  it('welcome: name, then ticket and Tent', () => {
    expect(toScreen({ ...leaky, status: 'welcome' }, 'MAD-B8K2MQ')).toEqual({
      state: 'welcome',
      name: 'Ada Obi',
      detail: 'Sleepover single (1 person) · Tent',
    })
    expect(toScreen({ status: 'welcome', name: 'Bo', ticket: 'Attendance only (no tent)', usesTent: false }, 'x').detail).toBe(
      'Attendance only (no tent) · No tent',
    )
  })

  it('already: name, then the first arrival time', () => {
    expect(toScreen({ ...leaky, status: 'already' }, 'MAD-B8K2MQ')).toEqual({
      state: 'already',
      name: 'Ada Obi',
      detail: 'at 7:05 pm',
    })
  })

  it('not found shows the code that was checked, not a name', () => {
    expect(toScreen({ status: 'not-found' }, 'MAD-B8K2MQ')).toEqual({
      state: 'not-found',
      name: 'MAD-B8K2MQ',
      detail: 'Check the code with the guest, or type it in',
    })
  })

  it('not paid shows the name only', () => {
    expect(toScreen({ ...leaky, status: 'not-paid' }, 'MAD-B8K2MQ')).toEqual({ state: 'not-paid', name: 'Ada Obi' })
  })

  it('anything unexpected is offline, never a guess', () => {
    for (const reply of [null, {}, { status: 'maybe' }, { error: 'Sign in again.' }]) {
      expect(toScreen(reply, 'MAD-B8K2MQ')).toEqual({ state: 'offline', detail: 'Check your signal and try again' })
    }
  })

  it('never carries an email or phone number onto the screen', () => {
    for (const status of ['welcome', 'already', 'not-found', 'not-paid', 'offline']) {
      expect(JSON.stringify(toScreen({ ...leaky, status }, 'MAD-B8K2MQ'))).not.toMatch(/example\.com|\+234/)
    }
  })

  it('reads the live count only when both numbers are there', () => {
    expect(countsFrom({ checkedIn: 3, total: 80 })).toEqual({ checkedIn: 3, total: 80 })
    expect(countsFrom({ checkedIn: 3 })).toBeNull()
    expect(countsFrom(null)).toBeNull()
  })
})
