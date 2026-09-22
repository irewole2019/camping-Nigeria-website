import { describe, it, expect } from 'vitest'
import {
  generateSignupCode,
  isValidSignupCode,
  normaliseInstagram,
} from '@/lib/events/camp-night-records'
import {
  LOWEST_PRICE,
  TENT_PACKAGES,
  getTentPackage,
  isValidPackageId,
} from '@/lib/events/camp-night'

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
