import { describe, it, expect } from 'vitest'
import {
  generateSignupCode,
  isValidSignupCode,
} from '@/lib/events/mad-settings-records'
import { generateSignupCode as generateCampNightCode } from '@/lib/events/camp-night-records'
import {
  DATE_STAMP,
  EVENT_DATE_LABEL,
  EVENT_DATE_SHORT,
  EVENT_DESCRIPTION,
  EVENT_END_ISO,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_START_ISO,
  EVENT_STATUS,
  EVENT_TIME_SHORT,
  LOWEST_PRICE,
  MIN_AGE,
  ON_SITE,
  PAYMENT_IS_OFFLINE,
  PAYMENT_NOTE,
  PLEASE_NOTE,
  SECURITY_INTRO,
  SECURITY_POINTS,
  SIGNUP_OPEN,
  TENT_CAP,
  TICKETS,
  VENUE_LABEL,
  VENUE_MAP_URL,
  VENUE_NAME,
  VENUE_PUBLIC_LABEL,
  getTicket,
  isValidTicketId,
} from '@/lib/events/mad-settings'
import { FEATURED_UPCOMING_EVENT } from '@/lib/events'
import { CONTACT } from '@/lib/constants'

describe('generateSignupCode', () => {
  it('uses the MAD tag and six characters', () => {
    expect(generateSignupCode()).toMatch(/^MAD-[A-Z2-9]{6}$/)
  })

  it('never emits the worst look-alikes: 0, O, 1 or I', () => {
    const codes = Array.from({ length: 300 }, () => generateSignupCode())
    for (const code of codes) {
      expect(code.slice(4)).not.toMatch(/[01IO]/)
    }
  })

  it('does not repeat across a run many times the size of the event', () => {
    const codes = new Set(Array.from({ length: 2000 }, () => generateSignupCode()))
    expect(codes.size).toBe(2000)
  })
})

describe('isValidSignupCode', () => {
  it('accepts a code this module generated', () => {
    expect(isValidSignupCode(generateSignupCode())).toBe(true)
  })

  it('rejects a Camp Night code, so the two events cannot be confused at a gate', () => {
    expect(isValidSignupCode(generateCampNightCode())).toBe(false)
  })

  it('rejects the wrong length, ambiguous glyphs, lowercase and non-strings', () => {
    expect(isValidSignupCode('MAD-ABC')).toBe(false)
    expect(isValidSignupCode('MAD-ABCDEFG')).toBe(false)
    expect(isValidSignupCode('MAD-ABC0DE')).toBe(false)
    expect(isValidSignupCode('mad-abcdef')).toBe(false)
    expect(isValidSignupCode(undefined)).toBe(false)
    expect(isValidSignupCode(123)).toBe(false)
  })
})

describe('tickets', () => {
  it('offers exactly the three the flyer prices', () => {
    expect(TICKETS.map((t) => t.id)).toEqual(['attendance', 'single', 'couple'])
    // Couple went from ₦35,000 (early bird) to ₦40,000 on 31/10/2026.
    expect(TICKETS.map((t) => t.price)).toEqual([10_000, 30_000, 40_000])
  })

  it('gives a tent to the sleepover tickets only', () => {
    // The Apps Script counts only tent rows against TENT_CAP. If attendance
    // ever claimed a tent, day guests would start getting "tents full".
    expect(getTicket('attendance').usesTent).toBe(false)
    expect(getTicket('single').usesTent).toBe(true)
    expect(getTicket('couple').usesTent).toBe(true)
  })

  it('advertises the cheapest ticket still on sale as the from-price', () => {
    // Attendance only (₦10,000) sold out on 28/10/2026, so the from-price is
    // the cheapest sleepover ticket.
    expect(LOWEST_PRICE).toBe(30_000)
    expect(EVENT_DESCRIPTION).toContain('from ₦30,000')
    expect(EVENT_DESCRIPTION).not.toContain('₦10,000')
  })

  it('validates ticket ids from the form', () => {
    expect(isValidTicketId('attendance')).toBe(true)
    expect(isValidTicketId('couple')).toBe(true)
    expect(isValidTicketId('shared')).toBe(false) // a Camp Night package
    expect(isValidTicketId(undefined)).toBe(false)
  })
})

describe('capacity', () => {
  it('caps tents at 80', () => {
    expect(TENT_CAP).toBe(80)
  })
})

describe('event timing', () => {
  it('runs 12 noon Saturday 31 October to 9am Sunday, in Lagos time', () => {
    expect(EVENT_START_ISO).toBe('2026-10-31T12:00:00+01:00')
    expect(EVENT_END_ISO).toBe('2026-11-01T09:00:00+01:00')
  })

  it('falls on a Saturday', () => {
    // 12:00 Lagos is 11:00 UTC on the same date.
    expect(new Date(EVENT_START_ISO).getUTCDay()).toBe(6)
    expect(EVENT_DATE_LABEL.startsWith('Saturday')).toBe(true)
    expect(DATE_STAMP.weekday).toBe('Saturday')
  })

  it('has short labels that are short and agree with the long ones', () => {
    expect(EVENT_DATE_SHORT).toBe('Sat 31 Oct')
    expect(EVENT_DATE_SHORT).not.toMatch(/October|2026/)
    expect(EVENT_DATE_LABEL).toContain('31 October')
    expect(EVENT_TIME_SHORT).toBe('12 PM – 9 AM')
  })
})

describe('lifecycle', () => {
  it('is open and featured on the homepage while upcoming', () => {
    expect(EVENT_STATUS).toBe('upcoming')
    expect(SIGNUP_OPEN).toBe(true)
    expect(FEATURED_UPCOMING_EVENT?.slug).toBe('mad-settings')
  })
})

describe('age policy', () => {
  it('is 18 and over, and says so in PLEASE_NOTE', () => {
    expect(MIN_AGE).toBe(18)
    expect(PLEASE_NOTE.some((n) => n.includes(String(MIN_AGE)))).toBe(true)
  })
})

describe('the venue is not public', () => {
  it('has a public label carrying the city and not the venue', () => {
    expect(VENUE_PUBLIC_LABEL).toBe('Abuja')
    expect(VENUE_PUBLIC_LABEL.toLowerCase()).not.toContain('brooks')
  })

  it('keeps the venue out of the public description, which feeds meta and JSON-LD', () => {
    expect(EVENT_DESCRIPTION).not.toContain(VENUE_NAME)
    expect(EVENT_DESCRIPTION.toLowerCase()).not.toContain('brooks')
    expect(EVENT_DESCRIPTION).toContain('Abuja')
  })

  it('still holds the full venue and map link, for the email and the confirmation page', () => {
    expect(VENUE_LABEL).toContain(VENUE_NAME)
    expect(VENUE_MAP_URL).toMatch(/^https:\/\//)
  })
})

describe('safety section', () => {
  it('every claim traces to something the event actually enforces', () => {
    const all = SECURITY_POINTS.map((p) => `${p.title} ${p.detail}`).join(' ').toLowerCase()
    expect(all).toContain('signed up in advance')
    expect(all).toContain('not published')
    expect(all).toContain(String(TENT_CAP))
    expect(all).toContain(String(MIN_AGE))
    expect(all).toContain('asked to leave')
  })

  it('does not claim the whole crowd is capped — only the tents are', () => {
    const all = SECURITY_POINTS.map((p) => `${p.title} ${p.detail}`).join(' ').toLowerCase()
    expect(all).not.toContain('capped group of campers')
    expect(all).not.toContain('small, known group')
  })

  it('lists the five on-site facilities and claims nothing more specific', () => {
    expect(ON_SITE.map((i) => i.icon)).toEqual(['shield', 'first-aid', 'light', 'toilet', 'parking'])
    const all = ON_SITE.map((i) => `${i.title} ${i.detail}`)
      .concat(SECURITY_INTRO)
      .join(' ')
      .toLowerCase()
    for (const claim of ['armed', 'cctv', 'patrol', '24/7', 'all night', 'trained', 'paramedic', 'guarded', 'monitored']) {
      expect(all).not.toContain(claim)
    }
  })
})

describe('payment model', () => {
  it('is offline and paid before sign-up', () => {
    expect(PAYMENT_IS_OFFLINE).toBe(true)
    expect(PAYMENT_NOTE).toMatch(/already paid/i)
  })
})

describe('event enquiries line', () => {
  it('is the flyer number, not the site-wide one', () => {
    expect(EVENT_PHONE_DISPLAY).toBe('+234 704 053 8528')
    expect(EVENT_PHONE_DISPLAY).not.toBe(CONTACT.phone)
    expect(EVENT_PHONE_TEL.replace('tel:', '')).toBe(EVENT_PHONE_DISPLAY.replace(/\s/g, ''))
  })
})

describe('sold-out tickets', () => {
  it('has Attendance only sold out, and both sleepover tickets on sale', async () => {
    const { TICKETS_ON_SALE, DAY_TICKET_ON_SALE, getTicket } = await import('@/lib/events/mad-settings')
    expect(getTicket('attendance').soldOut).toBe(true)
    expect(TICKETS_ON_SALE.map((t) => t.id)).toEqual(['single', 'couple'])
    expect(DAY_TICKET_ON_SALE).toBe(false)
    // Still listed on the page, marked sold out, so the flyer and page agree.
    expect(TICKETS.map((t) => t.id)).toEqual(['attendance', 'single', 'couple'])
  })

  it('tells the homepage banner the day ticket is gone, and quotes the new from-price', async () => {
    const banner = FEATURED_UPCOMING_EVENT?.banner
    expect(banner?.badge).toBe('Tickets From ₦30,000')
    expect(banner?.body).toContain('Day tickets are sold out')
    expect(banner?.body).not.toContain('Come for the day')
  })

  it('refuses a sold-out ticket at the API, before touching the sheet', async () => {
    const { vi } = await import('vitest')
    const saved = { ...process.env }
    process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL = 'https://sheet.invalid/exec'
    process.env.RESEND_API_KEY = 're_test'
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    const fetchSpy = vi.fn(async () => new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchSpy)
    try {
      const { POST } = await import('@/app/api/mad-settings-signup/route')
      const res = await POST(
        new Request('http://localhost/api/mad-settings-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.3.3.3' },
          body: JSON.stringify({
            name: 'Ada Obi',
            email: 'ada@example.com',
            phone: '0803 000 0000',
            instagram: '',
            ticketId: 'attendance',
            partnerName: '',
            ageConfirmed: true,
            paidConfirmed: true,
            website_confirm: '',
          }),
        }),
      )
      expect(res.status).toBe(409)
      expect((await res.json()).error).toMatch(/sold out/i)
      expect(fetchSpy).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
      process.env = saved
    }
  })
})

describe('after early bird (31/10/2026)', () => {
  it('drops the words "early bird" from the description, and the couple ticket is ₦40,000', async () => {
    const { PRICES_ARE_EARLY_BIRD, getTicket } = await import('@/lib/events/mad-settings')
    expect(PRICES_ARE_EARLY_BIRD).toBe(false)
    expect(EVENT_DESCRIPTION).not.toMatch(/early.bird/i)
    expect(EVENT_DESCRIPTION).toContain('Tickets from ₦30,000')
    expect(getTicket('couple').price).toBe(40_000)
    expect(getTicket('single').price).toBe(30_000)
  })
})
