import { describe, it, expect } from 'vitest'
import { isValidPayload } from '@/lib/award-proposal'

const validSchoolPayload = {
  details: {
    requesterType: 'school',
    schoolName: 'Greenfield Academy',
    role: 'Head Teacher',
    studentCount: 60,
    awardLevels: ['bronze', 'silver'],
  },
  tierInterest: 'trail-ready',
  scheduling: {
    eventStartDate: '',
    eventStartTime: '',
    eventEndDate: '',
    eventEndTime: '',
  },
  notes: '',
  contact: {
    contactName: 'Amara Okafor',
    email: 'amara@school.edu.ng',
    phone: '08012345678',
  },
}

const validParentPayload = {
  details: {
    requesterType: 'parent',
    studentSchool: 'Lagos Preparatory School',
    studentClass: 'SS 2',
    awardLevel: 'bronze',
  },
  tierInterest: 'unsure',
  scheduling: {
    eventStartDate: '',
    eventStartTime: '',
    eventEndDate: '',
    eventEndTime: '',
  },
  notes: '',
  contact: {
    contactName: 'Tunde Adebayo',
    email: 'tunde@example.com',
    phone: '07040538528',
  },
}

describe('isValidPayload — school path', () => {
  it('accepts a fully-valid school payload', () => {
    expect(isValidPayload(validSchoolPayload)).toBe(true)
  })

  it('rejects empty schoolName / role', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, schoolName: '' },
      }),
    ).toBe(false)
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, role: '   ' },
      }),
    ).toBe(false)
  })

  it('rejects non-integer / out-of-range studentCount', () => {
    for (const v of [0, -5, 1.5, NaN, '60', null, undefined, 1_000_000]) {
      expect(
        isValidPayload({
          ...validSchoolPayload,
          details: { ...validSchoolPayload.details, studentCount: v },
        }),
      ).toBe(false)
    }
  })

  it('rejects empty awardLevels array', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, awardLevels: [] },
      }),
    ).toBe(false)
  })

  it('rejects unknown awardLevel values', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, awardLevels: ['bronze', 'platinum'] },
      }),
    ).toBe(false)
  })

  it('accepts every valid awardLevel combination', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, awardLevels: ['bronze', 'silver', 'gold'] },
      }),
    ).toBe(true)
  })
})

describe('isValidPayload — parent path', () => {
  it('accepts a fully-valid parent payload', () => {
    expect(isValidPayload(validParentPayload)).toBe(true)
  })

  it('rejects empty studentSchool / studentClass', () => {
    expect(
      isValidPayload({
        ...validParentPayload,
        details: { ...validParentPayload.details, studentSchool: '' },
      }),
    ).toBe(false)
    expect(
      isValidPayload({
        ...validParentPayload,
        details: { ...validParentPayload.details, studentClass: '' },
      }),
    ).toBe(false)
  })

  it('accepts "unsure" award level for parents', () => {
    expect(
      isValidPayload({
        ...validParentPayload,
        details: { ...validParentPayload.details, awardLevel: 'unsure' },
      }),
    ).toBe(true)
  })

  it('rejects unknown awardLevel value', () => {
    expect(
      isValidPayload({
        ...validParentPayload,
        details: { ...validParentPayload.details, awardLevel: 'platinum' },
      }),
    ).toBe(false)
  })
})

describe('isValidPayload — shared fields', () => {
  it('rejects unknown tierInterest values', () => {
    expect(isValidPayload({ ...validSchoolPayload, tierInterest: 'titanium' })).toBe(false)
  })

  it('accepts every valid tierInterest', () => {
    for (const t of ['base-camp', 'trail-ready', 'summit-partner', 'unsure'] as const) {
      expect(isValidPayload({ ...validSchoolPayload, tierInterest: t })).toBe(true)
    }
  })

  it('rejects bad emails and short phones', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        contact: { ...validSchoolPayload.contact, email: 'not-an-email' },
      }),
    ).toBe(false)
    expect(
      isValidPayload({
        ...validSchoolPayload,
        contact: { ...validSchoolPayload.contact, phone: '12345' },
      }),
    ).toBe(false)
  })

  it('rejects scheduling with only one date set (both-or-neither rule)', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        scheduling: {
          eventStartDate: '2026-05-01',
          eventStartTime: '09:00',
          eventEndDate: '',
          eventEndTime: '',
        },
      }),
    ).toBe(false)
  })

  it('rejects scheduling where end < start', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        scheduling: {
          eventStartDate: '2026-05-04',
          eventStartTime: '09:00',
          eventEndDate: '2026-05-01',
          eventEndTime: '16:00',
        },
      }),
    ).toBe(false)
  })

  it('accepts scheduling with valid both-set dates', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        scheduling: {
          eventStartDate: '2026-05-01',
          eventStartTime: '09:00',
          eventEndDate: '2026-05-04',
          eventEndTime: '16:00',
        },
      }),
    ).toBe(true)
  })

  it('rejects malformed date / time strings', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        scheduling: {
          eventStartDate: '01/05/2026',
          eventStartTime: '09:00',
          eventEndDate: '2026-05-04',
          eventEndTime: '16:00',
        },
      }),
    ).toBe(false)
    expect(
      isValidPayload({
        ...validSchoolPayload,
        scheduling: {
          eventStartDate: '2026-05-01',
          eventStartTime: '9am',
          eventEndDate: '2026-05-04',
          eventEndTime: '16:00',
        },
      }),
    ).toBe(false)
  })

  it('rejects unknown requesterType', () => {
    expect(
      isValidPayload({
        ...validSchoolPayload,
        details: { ...validSchoolPayload.details, requesterType: 'coordinator' },
      }),
    ).toBe(false)
  })
})
