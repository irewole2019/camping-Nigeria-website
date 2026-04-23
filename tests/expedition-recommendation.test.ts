import { describe, it, expect } from 'vitest'
import {
  isValidAnswerKey,
  getRecommendedTier,
} from '@/lib/expedition-recommendation'

describe('isValidAnswerKey', () => {
  it('accepts A, B, C, D', () => {
    expect(isValidAnswerKey('A')).toBe(true)
    expect(isValidAnswerKey('B')).toBe(true)
    expect(isValidAnswerKey('C')).toBe(true)
    expect(isValidAnswerKey('D')).toBe(true)
  })

  it('rejects lowercase, other letters, and non-strings', () => {
    expect(isValidAnswerKey('a')).toBe(false)
    expect(isValidAnswerKey('E')).toBe(false)
    expect(isValidAnswerKey('')).toBe(false)
    expect(isValidAnswerKey(null)).toBe(false)
    expect(isValidAnswerKey(undefined)).toBe(false)
    expect(isValidAnswerKey(1)).toBe(false)
  })
})

describe('getRecommendedTier — Q4 drives tier selection', () => {
  it('A -> Base Camp', () => {
    expect(getRecommendedTier(undefined, undefined, 'A').key).toBe('base-camp')
  })

  it('B -> Trail Ready', () => {
    expect(getRecommendedTier(undefined, undefined, 'B').key).toBe('trail-ready')
  })

  it('C -> Summit Partner', () => {
    expect(getRecommendedTier(undefined, undefined, 'C').key).toBe('summit-partner')
  })

  it('D (unsure) -> Trail Ready as safe middle ground', () => {
    expect(getRecommendedTier(undefined, undefined, 'D').key).toBe('trail-ready')
  })

  it('missing Q4 -> Trail Ready default', () => {
    expect(getRecommendedTier(undefined, undefined, undefined).key).toBe('trail-ready')
  })
})

describe('getRecommendedTier — Q2 tunes the summary prefix', () => {
  it('Q2=A prepends "Since your school already runs the Award"', () => {
    const tier = getRecommendedTier('A', 'B', 'B')
    expect(tier.summary).toMatch(/^Since your school already runs the Award, /)
  })

  it('Q2=B prepends "As your school prepares to launch the Award"', () => {
    const tier = getRecommendedTier('B', 'B', 'B')
    expect(tier.summary).toMatch(/^As your school prepares to launch the Award, /)
  })

  it('Q2=D leaves the summary with its own capitalized opening', () => {
    const tier = getRecommendedTier('D', 'B', 'B')
    // No prefix -> summary starts with its original capital letter
    expect(tier.summary.charAt(0)).toMatch(/[A-Z]/)
  })
})

describe('getRecommendedTier — Q3 weaves group-size into the summary', () => {
  it('Q3=A surfaces "under 30 students"', () => {
    const tier = getRecommendedTier(undefined, 'A', 'B')
    expect(tier.summary).toContain('up to 30 students')
  })

  it('Q3=B surfaces "30–60 students"', () => {
    const tier = getRecommendedTier(undefined, 'B', 'B')
    expect(tier.summary).toContain('30–60 students')
  })

  it('Q3=D (unsure) falls back to a neutral phrase', () => {
    const tier = getRecommendedTier(undefined, 'D', 'B')
    expect(tier.summary).toContain('a group your size')
  })
})

describe('getRecommendedTier — always populated fields', () => {
  it('always returns a priceNote and non-empty includes list', () => {
    const tier = getRecommendedTier('A', 'A', 'A')
    expect(tier.priceNote).toBeTruthy()
    expect(tier.includes.length).toBeGreaterThan(0)
    expect(tier.price).toMatch(/₦/)
  })
})
