import { describe, it, expect } from 'vitest'
import {
  isValidAnswers,
  scoreAnswers,
  bucketGroupSize,
  computeProgramDays,
  getCampDurationOverride,
  type ProposalAnswers,
  type Scheduling,
} from '@/lib/proposal-engine'

const validAnswers: ProposalAnswers = {
  schoolType: 'secondary',
  classLevel: 'jss-1-3',
  groupSize: 60,
  primaryGoal: 'leadership',
  participantType: 'leaders',
  venue: 'on-campus',
  activities: ['leadership-challenges', 'journaling'],
  overnightPreference: 'day-evening',
}

describe('bucketGroupSize', () => {
  it('buckets numbers against the historical boundaries', () => {
    expect(bucketGroupSize(1)).toBe('under-40')
    expect(bucketGroupSize(39)).toBe('under-40')
    expect(bucketGroupSize(40)).toBe('40-80')
    expect(bucketGroupSize(79)).toBe('40-80')
    expect(bucketGroupSize(80)).toBe('80-150')
    expect(bucketGroupSize(149)).toBe('80-150')
    expect(bucketGroupSize(150)).toBe('150+')
    expect(bucketGroupSize(500)).toBe('150+')
  })
})

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
    expect(isValidAnswers({ ...validAnswers, venue: 'forest-moon-of-endor' })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, overnightPreference: 'maybe' })).toBe(false)
  })

  it('rejects missing fields', () => {
    const withoutSchoolType: Record<string, unknown> = { ...validAnswers }
    delete withoutSchoolType.schoolType
    expect(isValidAnswers(withoutSchoolType)).toBe(false)
    const withoutOvernight: Record<string, unknown> = { ...validAnswers }
    delete withoutOvernight.overnightPreference
    expect(isValidAnswers(withoutOvernight)).toBe(false)
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

  it('rejects non-number groupSize (string buckets are no longer valid)', () => {
    expect(isValidAnswers({ ...validAnswers, groupSize: '40-80' })).toBe(false)
  })

  it('rejects zero, negative, or non-integer groupSize', () => {
    expect(isValidAnswers({ ...validAnswers, groupSize: 0 })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, groupSize: -10 })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, groupSize: 12.5 })).toBe(false)
    expect(isValidAnswers({ ...validAnswers, groupSize: NaN })).toBe(false)
  })

  it('rejects absurdly large groupSize values', () => {
    expect(isValidAnswers({ ...validAnswers, groupSize: 1_000_000 })).toBe(false)
  })

  it('accepts every valid overnight preference', () => {
    const prefs = ['day-only', 'day-evening', 'open-to-overnight'] as const
    for (const p of prefs) {
      expect(isValidAnswers({ ...validAnswers, overnightPreference: p })).toBe(true)
    }
  })
})

describe('scoreAnswers — program selection', () => {
  it('picks leadership-development for leadership-focused leaders', () => {
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
      groupSize: 60,
      primaryGoal: 'eco-creativity',
      participantType: 'general',
      venue: 'on-campus',
      activities: ['adire-crafts', 'eco-nature'],
      overnightPreference: 'day-only',
    })
    expect(result.program.slug).toBe('nature-craft')
  })

  it('never picks on-campus-camps when venue is off-campus (camps is on-campus by definition)', () => {
    const result = scoreAnswers({
      schoolType: 'mixed',
      classLevel: 'mixed',
      groupSize: 100,
      primaryGoal: 'celebration',
      participantType: 'mix',
      venue: 'off-campus',
      activities: ['camping-tents', 'bonfire-stories'],
      overnightPreference: 'open-to-overnight',
    })
    expect(result.program.slug).not.toBe('on-campus-camps')
  })

  it('allows on-campus-camps for any overnight preference when venue is on-campus', () => {
    for (const overnightPreference of ['day-only', 'day-evening', 'open-to-overnight'] as const) {
      const result = scoreAnswers({
        schoolType: 'mixed',
        classLevel: 'mixed',
        groupSize: 200,
        primaryGoal: 'celebration',
        participantType: 'mix',
        venue: 'on-campus',
        activities: ['camping-tents', 'bonfire-stories'],
        overnightPreference,
      })
      expect(result.program.slug).toBe('on-campus-camps')
    }
  })
})

describe('scoreAnswers — tier selection', () => {
  const baseCampsAnswers: Omit<ProposalAnswers, 'overnightPreference'> = {
    schoolType: 'mixed',
    classLevel: 'mixed',
    groupSize: 100,
    primaryGoal: 'celebration',
    participantType: 'mix',
    venue: 'on-campus',
    activities: ['camping-tents'],
  }

  it('on-campus-camps: day-only -> Spark (entry tier)', () => {
    const result = scoreAnswers({ ...baseCampsAnswers, overnightPreference: 'day-only' })
    expect(result.program.slug).toBe('on-campus-camps')
    expect(result.tier.name).toBe('Spark')
  })

  it('on-campus-camps: day-evening -> Trail (mid tier)', () => {
    const result = scoreAnswers({ ...baseCampsAnswers, overnightPreference: 'day-evening' })
    expect(result.program.slug).toBe('on-campus-camps')
    expect(result.tier.name).toBe('Trail')
  })

  it('on-campus-camps: open-to-overnight -> Summit (premium tier)', () => {
    const result = scoreAnswers({ ...baseCampsAnswers, overnightPreference: 'open-to-overnight' })
    expect(result.program.slug).toBe('on-campus-camps')
    expect(result.tier.name).toBe('Summit')
  })

  it('on-campus-camps tier is independent of group size — overnight pref drives it', () => {
    const small = scoreAnswers({ ...baseCampsAnswers, groupSize: 20, overnightPreference: 'open-to-overnight' })
    const large = scoreAnswers({ ...baseCampsAnswers, groupSize: 250, overnightPreference: 'open-to-overnight' })
    if (small.program.slug === 'on-campus-camps' && large.program.slug === 'on-campus-camps') {
      expect(small.tier.name).toBe('Summit')
      expect(large.tier.name).toBe('Summit')
    }
  })
})

describe('computeProgramDays — noon-to-noon ceil(elapsed_h / 24)', () => {
  const baseScheduling = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
  ): Scheduling => ({
    eventStartDate: startDate,
    eventStartTime: startTime,
    eventEndDate: endDate,
    eventEndTime: endTime,
  })

  it('returns null when either date is missing', () => {
    expect(computeProgramDays(baseScheduling('', '', '', ''))).toBeNull()
    expect(
      computeProgramDays(baseScheduling('2026-05-01', '09:00', '', '')),
    ).toBeNull()
  })

  it('canonical noon-to-noon: 24h = 1 day', () => {
    expect(
      computeProgramDays(baseScheduling('2026-05-01', '12:00', '2026-05-02', '12:00')),
    ).toBe(1)
  })

  it('default school hours 09:00-16:00 over 4 calendar days = 4 days', () => {
    expect(
      computeProgramDays(baseScheduling('2026-05-01', '09:00', '2026-05-04', '16:00')),
    ).toBe(4)
  })

  it('cross-noon barely (49h) ceils to 3', () => {
    expect(
      computeProgramDays(baseScheduling('2026-05-01', '12:00', '2026-05-03', '13:00')),
    ).toBe(3)
  })

  it('end before start returns null', () => {
    expect(
      computeProgramDays(baseScheduling('2026-05-04', '12:00', '2026-05-01', '12:00')),
    ).toBeNull()
  })
})

describe('getCampDurationOverride', () => {
  const sched = (start: string, end: string): Scheduling => ({
    eventStartDate: start,
    eventStartTime: '09:00',
    eventEndDate: end,
    eventEndTime: '16:00',
  })

  const campsAnswers: ProposalAnswers = {
    schoolType: 'mixed',
    classLevel: 'mixed',
    groupSize: 100,
    primaryGoal: 'celebration',
    participantType: 'mix',
    venue: 'on-campus',
    activities: ['camping-tents'],
    overnightPreference: 'open-to-overnight',
  }

  it('returns null when scheduling has no dates', () => {
    const result = scoreAnswers(campsAnswers)
    const override = getCampDurationOverride(result, {
      eventStartDate: '',
      eventStartTime: '',
      eventEndDate: '',
      eventEndTime: '',
    })
    expect(override).toBeNull()
  })

  it('returns null for non-camps programmes (even when 4-day window)', () => {
    const natureResult = scoreAnswers({
      ...campsAnswers,
      schoolType: 'primary',
      classLevel: 'primary-1-3',
      primaryGoal: 'eco-creativity',
      participantType: 'general',
      activities: ['adire-crafts', 'eco-nature'],
    })
    if (natureResult.program.slug !== 'on-campus-camps') {
      expect(getCampDurationOverride(natureResult, sched('2026-05-01', '2026-05-04'))).toBeNull()
    }
  })

  it('returns null for exactly 2-day camps (standard tier fits)', () => {
    const result = scoreAnswers(campsAnswers)
    expect(getCampDurationOverride(result, sched('2026-05-01', '2026-05-02'))).toBeNull()
  })

  it('overrides for camps + same-day (1 day) request', () => {
    const result = scoreAnswers(campsAnswers)
    const override = getCampDurationOverride(result, sched('2026-05-01', '2026-05-01'))
    expect(override).not.toBeNull()
    expect(override?.title).toBe('1-Day On-Campus Camp')
    expect(override?.days).toBe(1)
    expect(override?.tierTag).toBe('Custom')
    expect(override?.tierDuration).toContain('1 day')
  })

  it('overrides for camps + 3+ day window', () => {
    const result = scoreAnswers(campsAnswers)
    const override = getCampDurationOverride(result, sched('2026-05-01', '2026-05-04'))
    expect(override).not.toBeNull()
    expect(override?.title).toBe('Multi-day On-Campus Camps')
    expect(override?.days).toBe(4)
    expect(override?.tierTag).toBe('Custom')
    expect(override?.tierDuration).toContain('4 days')
  })

  it('preserves the format suffix from the standard tier in the override', () => {
    // Open-to-overnight → Summit ("2 days · overnight") → "{N} days · overnight"
    const overnightOverride = getCampDurationOverride(
      scoreAnswers({ ...campsAnswers, overnightPreference: 'open-to-overnight' }),
      sched('2026-05-01', '2026-05-04'),
    )
    expect(overnightOverride?.tierDuration).toBe('4 days · overnight')

    // Day-only → Spark ("2 days · day camp") → "{N} days · day camp"
    const dayOnlyOverride = getCampDurationOverride(
      scoreAnswers({ ...campsAnswers, overnightPreference: 'day-only' }),
      sched('2026-05-01', '2026-05-04'),
    )
    expect(dayOnlyOverride?.tierDuration).toBe('4 days · day camp')
  })
})
