import { describe, it, expect } from 'vitest'
import {
  generateSignupCode,
  isValidSignupCode,
  normaliseInstagram,
} from '@/lib/events/camp-night-records'
import {
  CHILDREN_INTRO,
  CHILDREN_RULES,
  CHILDREN_WELCOME,
  EVENT_DATE_LABEL,
  EVENT_DATE_SHORT,
  EVENT_DESCRIPTION,
  EVENT_END_ISO,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_START_ISO,
  EVENT_TIME_SHORT,
  LOWEST_PRICE,
  MIN_AGE,
  PAYMENT_IS_OFFLINE,
  PAYMENT_NOTE,
  PLEASE_NOTE,
  TENT_PACKAGES,
  VENUE_LABEL,
  VENUE_MAP_URL,
  VENUE_NAME,
  VENUE_PUBLIC_LABEL,
  getTentPackage,
  isValidPackageId,
} from '@/lib/events/camp-night'
import { CONTACT } from '@/lib/constants'

describe('generateSignupCode', () => {
  it('uses the SCN tag and six characters', () => {
    expect(generateSignupCode()).toMatch(/^SCN-[A-Z2-9]{6}$/)
  })

  it('never emits the worst look-alikes: 0, O, 1 or I', () => {
    // These get read aloud at a gate at night and re-keyed from a phone.
    // L is intentionally in the alphabet — see the note on CODE_ALPHABET.
    const codes = Array.from({ length: 300 }, () => generateSignupCode())
    for (const code of codes) {
      expect(code.slice(4)).not.toMatch(/[01IO]/)
    }
  })

  it('does not repeat across a run many times the size of the event', () => {
    // 50 tents; 2000 draws is a far harsher test than the real load.
    const codes = new Set(Array.from({ length: 2000 }, () => generateSignupCode()))
    expect(codes.size).toBe(2000)
  })
})

describe('isValidSignupCode', () => {
  it('accepts a code this module generated', () => {
    expect(isValidSignupCode(generateSignupCode())).toBe(true)
  })

  it('rejects the wrong tag, wrong length, or ambiguous glyphs', () => {
    expect(isValidSignupCode('BCK-AB12CD')).toBe(false)
    expect(isValidSignupCode('SCN-ABC')).toBe(false)
    expect(isValidSignupCode('SCN-ABCDEFG')).toBe(false)
    expect(isValidSignupCode('SCN-ABC0DE')).toBe(false) // zero
    expect(isValidSignupCode('SCN-ABCIDE')).toBe(false) // capital i
    expect(isValidSignupCode('scn-abcdef')).toBe(false)
  })

  it('rejects non-strings, so a crafted query param cannot be echoed back', () => {
    expect(isValidSignupCode(undefined)).toBe(false)
    expect(isValidSignupCode(null)).toBe(false)
    expect(isValidSignupCode(123)).toBe(false)
    expect(isValidSignupCode({})).toBe(false)
  })
})

describe('normaliseInstagram', () => {
  it('lands on a single leading @ whatever was pasted', () => {
    expect(normaliseInstagram('adaobi')).toBe('@adaobi')
    expect(normaliseInstagram('@adaobi')).toBe('@adaobi')
    expect(normaliseInstagram('@@adaobi')).toBe('@adaobi')
    expect(normaliseInstagram('  adaobi  ')).toBe('@adaobi')
  })

  it('extracts the handle from a pasted profile URL', () => {
    expect(normaliseInstagram('https://instagram.com/adaobi')).toBe('@adaobi')
    expect(normaliseInstagram('https://www.instagram.com/adaobi/')).toBe('@adaobi')
    expect(normaliseInstagram('instagram.com/adaobi?igsh=abc123')).toBe('@adaobi')
  })

  it('returns empty for empty input rather than a bare @', () => {
    expect(normaliseInstagram('')).toBe('')
    expect(normaliseInstagram('   ')).toBe('')
    expect(normaliseInstagram('@')).toBe('')
  })
})

describe('tent packages', () => {
  it('offers exactly the three the flyer prices', () => {
    expect(TENT_PACKAGES.map((p) => p.id)).toEqual(['shared', 'single', 'couple'])
    expect(TENT_PACKAGES.map((p) => p.price)).toEqual([20_000, 25_000, 30_000])
  })

  it('advertises the cheapest tent as the from-price', () => {
    expect(LOWEST_PRICE).toBe(20_000)
    expect(LOWEST_PRICE).toBe(Math.min(...TENT_PACKAGES.map((p) => p.price)))
  })

  it('validates package ids from the form', () => {
    expect(isValidPackageId('shared')).toBe(true)
    expect(isValidPackageId('couple')).toBe(true)
    expect(isValidPackageId('penthouse')).toBe(false)
    expect(isValidPackageId(undefined)).toBe(false)
    expect(isValidPackageId(30_000)).toBe(false)
  })

  it('resolves a package to the label the sheet and email use', () => {
    expect(getTentPackage('single').label).toBe('Single tent (1 person)')
    expect(getTentPackage('couple').price).toBe(30_000)
  })
})

describe('event timing', () => {
  it('runs overnight, 6pm Saturday to 9am Sunday, in Lagos time', () => {
    expect(EVENT_START_ISO).toBe('2026-09-26T18:00:00+01:00')
    expect(EVENT_END_ISO).toBe('2026-09-27T09:00:00+01:00')
  })

  it('ends after it starts, and spans a single night', () => {
    const start = new Date(EVENT_START_ISO).getTime()
    const end = new Date(EVENT_END_ISO).getTime()
    expect(end).toBeGreaterThan(start)
    expect((end - start) / 3_600_000).toBe(15)
  })
})

describe('short labels for the hero spec strip', () => {
  // These shipped garbled once: the short date was built with
  // EVENT_DATE_LABEL.replace('Saturday, ', 'Sat 26 Sep'), which swapped the
  // weekday and kept the rest, rendering "Sat 26 Sep26 September 2026".
  it('is a short date, not a long one with the weekday swapped', () => {
    expect(EVENT_DATE_SHORT).toBe('Sat 26 Sep')
    expect(EVENT_DATE_SHORT.length).toBeLessThan(EVENT_DATE_LABEL.length)
    expect(EVENT_DATE_SHORT).not.toMatch(/September|2026/)
  })

  it('agrees with the full label on the day and month', () => {
    expect(EVENT_DATE_LABEL).toContain('26 September')
    expect(EVENT_DATE_SHORT).toContain('26 Sep')
  })

  it('has a short time label covering both ends of the night', () => {
    expect(EVENT_TIME_SHORT).toBe('6 PM – 9 AM')
  })
})

describe('age policy', () => {
  it('is 18 and over to sign up', () => {
    expect(MIN_AGE).toBe(18)
  })

  it('states the minimum in PLEASE_NOTE, which the confirmation email renders', () => {
    expect(PLEASE_NOTE.some((n) => n.includes(String(MIN_AGE)))).toBe(true)
  })

  it('no longer calls the night adults-only, now that children are welcome', () => {
    // The bar is on signing up, not attending. If this ever reverts to a
    // blanket 18+, the CHILDREN_* block has to go with it.
    const all = PLEASE_NOTE.join(' ').toLowerCase()
    expect(all).not.toContain('adults-only')
    expect(all).not.toContain('adults only')
  })
})

describe('children', () => {
  it('welcomes them, and says so before it says anything else', () => {
    expect(CHILDREN_WELCOME).toBe(true)
    expect(CHILDREN_INTRO.toLowerCase()).toContain('bring the kids')
  })

  it('carries the supervision rule, which is the load-bearing one', () => {
    const all = CHILDREN_RULES.join(' ').toLowerCase()
    expect(all).toContain('guardian')
    expect(all).toContain('stays with them')
  })

  it('carries the behaviour warning the founders asked for', () => {
    const all = CHILDREN_RULES.join(' ').toLowerCase()
    expect(all).toContain('well behaved')
    expect(all).toContain('asked to leave')
  })

  it('points at the event line rather than publishing a child price', () => {
    // No child rate has been set. If one is, it belongs in TENT_PACKAGES.
    const all = CHILDREN_RULES.join(' ').toLowerCase()
    expect(all).toContain('call us')
    expect(all).not.toMatch(/₦|naira/)
  })
})

describe('the venue is not public', () => {
  // The exact venue is disclosed to signees only — confirmation email and
  // confirmation page. Everything a stranger can load says the city.
  it('has a public label carrying the city and not the venue', () => {
    expect(VENUE_PUBLIC_LABEL).toBe('Abuja')
    expect(VENUE_PUBLIC_LABEL).not.toContain(VENUE_NAME)
    expect(VENUE_PUBLIC_LABEL.toLowerCase()).not.toContain('brooks')
  })

  it('keeps the venue out of the public description, which feeds meta and JSON-LD', () => {
    expect(EVENT_DESCRIPTION).not.toContain(VENUE_NAME)
    expect(EVENT_DESCRIPTION.toLowerCase()).not.toContain('brooks')
    expect(EVENT_DESCRIPTION).toContain('Abuja')
  })

  it('still holds the full venue and map link, for the email and the confirmation page', () => {
    expect(VENUE_NAME).toBe('Brooks Garden and Events Centre')
    expect(VENUE_LABEL).toContain(VENUE_NAME)
    expect(VENUE_MAP_URL).toMatch(/^https:\/\//)
  })
})

describe('payment model', () => {
  // Payment is offline and made BEFORE sign-up, which is the only reason the
  // sheet can record a row as paid. If a checkout is ever added, this flag and
  // the sheet default have to move together.
  it('is offline, so the form is not a checkout', () => {
    expect(PAYMENT_IS_OFFLINE).toBe(true)
  })

  it('tells campers to pay before signing up', () => {
    expect(PAYMENT_NOTE).toMatch(/already paid/i)
  })
})

describe('event enquiries line', () => {
  // The founders were explicit that this number belongs to Camp Night alone
  // and has nothing to do with the main site. If someone ever "tidies" it into
  // CONTACT, or points the event at the site number, these fail.
  it('is the Camp Night number, not the site-wide one', () => {
    expect(EVENT_PHONE_DISPLAY).toBe('+234 704 053 8528')
    expect(EVENT_PHONE_DISPLAY).not.toBe(CONTACT.phone)
  })

  it('has a tel: link whose digits match the displayed number', () => {
    expect(EVENT_PHONE_TEL).toBe('tel:+2347040538528')
    expect(EVENT_PHONE_TEL.replace('tel:', '')).toBe(EVENT_PHONE_DISPLAY.replace(/\s/g, ''))
  })
})
