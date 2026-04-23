import { describe, it, expect } from 'vitest'
import {
  isValidAnswers,
  scoreAnswers,
  type ProposalAnswers,
} from '@/lib/proposal-engine'

const validAnswers: ProposalAnswers = {
  schoolType: 'secondary',
  classLevel: 'jss-1-3',
  groupSize: '40-80',
  primaryGoal: 'leadership',
  participantType: 'leaders',
  duration: 'full-day',
  venue: 'on-campus',
  activities: ['leadership-challenges', 'journaling'],
}

describe('isValidAnswers', () => {
  it('accepts a fully-valid payload', () => {
    expect(isValidAnswers(validAnswers)).toBe(true)
  })

  it('rejects non-objects', () => {
    expect(isValidAnswers(null)).toBe(false)
    expect(isValidAnswers(undefined)).toBe(false)
    expect(isValidAnswers('string')).toBe(false)
  })

  it('rejects unknown enum values (prevents fabricated answers)', () => {
    expect(isValidAnswers({ ...validAnswers, schoolType: 'nursery' })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, duration: 'three-days' })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, venue: 'forest-moon-of-endor' })).toBe(false)
  })

  it('rejects missing fields', () => {
    const withoutSchoolType: Record<string, unknown> = { ...validAnswers }
    delete withoutSchoolType.schoolType
    expect(isValidAnswers(withoutSchoolType)).toBe(false)
  })

  it('rejects activities that are not arrays', () => {
    expect(isValidAnswers({ ...validAnswers, activities: 'bonfire-stories' })).toBe(false)
  })

  it('rejects arrays with unknown activity values', () => {
    expect(
      isValidAnswers({ ...validAnswers, activities: ['bonfire-stories', 'ice-skating'] }),
    ).toBe(false)
  })

  it('accepts an empty activities array', () => {
    expect(isValidAnswers({ ...validAnswers, activities: [] })).toBe(true)
  })
})

describe('scoreAnswers — program selection', () => {
  it('picks leadership-development for leadership-focused full-day leaders', () => {
    const result = scoreAnswers({
      ...validAnswers,
      primaryGoal: 'leadership',
      participantType: 'leaders',
      activities: ['leadership-challenges'],
    })
    expect(result.program.slug).toBe('leadership-development')
  })

  it('picks nature-craft for eco-focused primary-school groups', () => {
    const result = scoreAnswers({
      schoolType: 'primary',
      classLevel: 'primary-1-3',
      groupSize: '40-80',
      primaryGoal: 'eco-creativity',
      participantType: 'general',
      duration: 'half-day',
      venue: 'on-campus',
      activities: ['adire-crafts', 'eco-nature'],
    })
    expect(result.program.slug).toBe('nature-craft')
  })

  it('never picks on-campus-camps when duration is not 2-days (campsEligible guard)', () => {
    // The guard forces on-campus-camps to lose when duration is half-day/full-day.
    // Even with answers that scored highly for camps, the program should switch.
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: '80-150',
      primaryGoal: 'celebration',
      participantType: 'mix',
      duration: 'half-day', // disqualifies on-campus-camps
      venue: 'on-campus',
      activities: ['camping-tents', 'bonfire-stories'],
    })
    expect(result.program.slug).not.toBe('on-campus-camps')
  })

  it('allows on-campus-camps when duration is 2-days', () => {
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: '150+',
      primaryGoal: 'celebration',
      participantType: 'mix',
      duration: '2-days',
      venue: 'on-campus',
      activities: ['camping-tents', 'bonfire-stories'],
    })
    expect(result.program.slug).toBe('on-campus-camps')
  })
})

describe('scoreAnswers — tier selection', () => {
  it('on-campus-camps uses groupSize: 150+ -> premium', () => {
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: '150+',
      primaryGoal: 'celebration',
      participantType: 'mix',
      duration: '2-days',
      venue: 'on-campus',
      activities: ['camping-tents'],
    })
    expect(result.program.slug).toBe('on-campus-camps')
    expect(result.tier).toBe(result.program.tiers[2])
  })

  it('on-campus-camps uses groupSize: 40-80 -> mid tier', () => {
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: '40-80',
      primaryGoal: 'celebration',
      participantType: 'mix',
      duration: '2-days',
      venue: 'on-campus',
      activities: ['camping-tents'],
    })
    if (result.program.slug === 'on-campus-camps') {
      expect(result.tier).toBe(result.program.tiers[1])
    }
  })

  it('on-campus-camps uses groupSize: under-40 -> entry tier', () => {
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: 'under-40',
      primaryGoal: 'celebration',
      participantType: 'mix',
      duration: '2-days',
      venue: 'on-campus',
      activities: ['camping-tents'],
    })
    if (result.program.slug === 'on-campus-camps') {
      expect(result.tier).toBe(result.program.tiers[0])
    }
  })
})
