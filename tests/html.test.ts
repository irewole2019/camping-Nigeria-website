import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  safeUrl,
  isHoneypotTripped,
  withinLengthCaps,
  MAX_LENGTHS,
} from '@/lib/html'

describe('escapeHtml', () => {
  it('escapes the five HTML metacharacters', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    )
    expect(escapeHtml("it's & it was")).toBe('it&#39;s &amp; it was')
  })

  it('escapes ampersands before other replacements (no double-encoding issues)', () => {
    // If & were replaced after &lt;, the output would contain &amp;lt;
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('&')).toBe('&amp;')
    expect(escapeHtml('&amp;')).toBe('&amp;amp;') // the literal input, escaped
  })

  it('coerces null and undefined to empty string', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })

  it('stringifies non-strings', () => {
    expect(escapeHtml(42)).toBe('42')
    expect(escapeHtml(true)).toBe('true')
  })
})

describe('safeUrl', () => {
  it('allows http and https', () => {
    expect(safeUrl('http://example.com/')).toBe('http://example.com/')
    expect(safeUrl('https://example.com/path?q=1')).toBe('https://example.com/path?q=1')
  })

  it('blocks javascript:, data:, vbscript:', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('')
    expect(safeUrl('data:text/html,<script>1</script>')).toBe('')
    expect(safeUrl('vbscript:msgbox(1)')).toBe('')
  })

  it('upgrades bare hostnames to https', () => {
    expect(safeUrl('example.com')).toBe('https://example.com/')
    expect(safeUrl('school.edu.ng')).toBe('https://school.edu.ng/')
  })

  it('returns empty for empty/nullish/invalid input', () => {
    expect(safeUrl('')).toBe('')
    expect(safeUrl(null)).toBe('')
    expect(safeUrl(undefined)).toBe('')
    expect(safeUrl('   ')).toBe('')
    expect(safeUrl('not a url at all with spaces')).toBe('')
  })
})

describe('isHoneypotTripped', () => {
  it('returns true when website_confirm is non-empty', () => {
    expect(isHoneypotTripped({ website_confirm: 'http://spam.site' })).toBe(true)
    expect(isHoneypotTripped({ website_confirm: 'x' })).toBe(true)
  })

  it('returns false when website_confirm is empty, missing, or whitespace', () => {
    expect(isHoneypotTripped({ website_confirm: '' })).toBe(false)
    expect(isHoneypotTripped({ website_confirm: '   ' })).toBe(false)
    expect(isHoneypotTripped({ fullName: 'real user' })).toBe(false)
    expect(isHoneypotTripped({})).toBe(false)
  })

  it('returns false for non-object inputs', () => {
    expect(isHoneypotTripped(null)).toBe(false)
    expect(isHoneypotTripped(undefined)).toBe(false)
    expect(isHoneypotTripped('hello')).toBe(false)
    expect(isHoneypotTripped(42)).toBe(false)
  })

  it('returns false when website_confirm is the wrong type', () => {
    // A bot filling a number-typed field shouldn't trip — string check only
    expect(isHoneypotTripped({ website_confirm: 42 })).toBe(false)
    expect(isHoneypotTripped({ website_confirm: null })).toBe(false)
  })
})

describe('withinLengthCaps', () => {
  it('passes when every value is within its cap', () => {
    expect(
      withinLengthCaps([
        ['Amara Okafor', MAX_LENGTHS.name],
        ['a@b.co', MAX_LENGTHS.email],
      ]),
    ).toBe(true)
  })

  it('fails if any value exceeds its cap', () => {
    expect(
      withinLengthCaps([
        ['ok', MAX_LENGTHS.name],
        ['x'.repeat(MAX_LENGTHS.email + 1), MAX_LENGTHS.email],
      ]),
    ).toBe(false)
  })

  it('treats non-string values as failures', () => {
    // Protects against nested-object payloads slipping through
    expect(
      withinLengthCaps([[{} as unknown as string, MAX_LENGTHS.name]]),
    ).toBe(false)
  })

  it('accepts empty strings', () => {
    expect(withinLengthCaps([['', MAX_LENGTHS.name]])).toBe(true)
  })
})
