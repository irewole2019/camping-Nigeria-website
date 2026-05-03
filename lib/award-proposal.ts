/**
 * Types and helpers for the dedicated DoE proposal flow.
 *
 * Unlike the school-programmes proposal (which scores answers and picks a
 * program/tier), this is a structured contact form. The user picks the tier
 * directly — Base Camp / Trail Ready / Summit Partner — or "Not sure" if
 * they want the team to recommend one. No engine.
 */

import { MAX_LENGTHS, withinLengthCaps } from '@/lib/html'

// ─── Form Types ─────────────────────────────────────────────────────────────

export type RequesterType = 'school' | 'parent'
export type AwardLevel = 'bronze' | 'silver' | 'gold'
export type ParentAwardLevel = AwardLevel | 'unsure'
export type TierInterest = 'base-camp' | 'trail-ready' | 'summit-partner' | 'unsure'

export interface SchoolRequester {
  requesterType: 'school'
  schoolName: string
  role: string
  studentCount: number
  awardLevels: AwardLevel[]
}

export interface ParentRequester {
  requesterType: 'parent'
  studentSchool: string
  studentClass: string
  awardLevel: ParentAwardLevel
}

export type AwardProposalDetails = SchoolRequester | ParentRequester

export interface AwardProposalContact {
  contactName: string
  email: string
  phone: string
}

export interface AwardProposalScheduling {
  eventStartDate: string
  eventStartTime: string
  eventEndDate: string
  eventEndTime: string
}

export interface AwardProposalPayload {
  details: AwardProposalDetails
  tierInterest: TierInterest
  scheduling: AwardProposalScheduling
  notes: string
  contact: AwardProposalContact
}

// ─── Allowlists ─────────────────────────────────────────────────────────────

const VALID_REQUESTER_TYPES: readonly RequesterType[] = ['school', 'parent']
const VALID_AWARD_LEVELS: readonly AwardLevel[] = ['bronze', 'silver', 'gold']
const VALID_PARENT_AWARD_LEVELS: readonly ParentAwardLevel[] = [
  'bronze',
  'silver',
  'gold',
  'unsure',
]
const VALID_TIER_INTERESTS: readonly TierInterest[] = [
  'base-camp',
  'trail-ready',
  'summit-partner',
  'unsure',
]

const MAX_STUDENT_COUNT = 5000

const inList = <T extends string>(v: unknown, list: readonly T[]): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v)

const TIME_PATTERN = /^\d{2}:\d{2}$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// ─── Validation ─────────────────────────────────────────────────────────────

/**
 * Validates the full DoE proposal payload, including the school-vs-parent
 * branch. Used by the API to reject fabricated keys and malformed input.
 */
export function isValidPayload(raw: unknown): raw is AwardProposalPayload {
  if (!raw || typeof raw !== 'object') return false
  const r = raw as Record<string, unknown>

  // ── details (school or parent branch) ──
  const details = r.details as Record<string, unknown> | undefined
  if (!details || typeof details !== 'object') return false
  if (!inList(details.requesterType, VALID_REQUESTER_TYPES)) return false

  if (details.requesterType === 'school') {
    if (typeof details.schoolName !== 'string' || !details.schoolName.trim()) return false
    if (typeof details.role !== 'string' || !details.role.trim()) return false
    if (
      typeof details.studentCount !== 'number' ||
      !Number.isFinite(details.studentCount) ||
      !Number.isInteger(details.studentCount) ||
      details.studentCount < 1 ||
      details.studentCount > MAX_STUDENT_COUNT
    ) {
      return false
    }
    if (!Array.isArray(details.awardLevels) || details.awardLevels.length === 0) return false
    if (!details.awardLevels.every((v) => inList(v, VALID_AWARD_LEVELS))) return false
    if (
      !withinLengthCaps([
        [details.schoolName, MAX_LENGTHS.schoolName],
        [details.role, MAX_LENGTHS.role],
      ])
    ) {
      return false
    }
  } else {
    // parent
    if (typeof details.studentSchool !== 'string' || !details.studentSchool.trim()) return false
    if (typeof details.studentClass !== 'string' || !details.studentClass.trim()) return false
    if (!inList(details.awardLevel, VALID_PARENT_AWARD_LEVELS)) return false
    if (
      !withinLengthCaps([
        [details.studentSchool, MAX_LENGTHS.schoolName],
        [details.studentClass, MAX_LENGTHS.role],
      ])
    ) {
      return false
    }
  }

  // ── tierInterest ──
  if (!inList(r.tierInterest, VALID_TIER_INTERESTS)) return false

  // ── contact ──
  const contact = r.contact as Record<string, unknown> | undefined
  if (!contact || typeof contact !== 'object') return false
  if (typeof contact.contactName !== 'string' || !contact.contactName.trim()) return false
  if (
    typeof contact.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  ) {
    return false
  }
  if (
    typeof contact.phone !== 'string' ||
    contact.phone.replace(/\D/g, '').length < 7
  ) {
    return false
  }
  if (
    !withinLengthCaps([
      [contact.contactName, MAX_LENGTHS.name],
      [contact.email, MAX_LENGTHS.email],
      [contact.phone, MAX_LENGTHS.phone],
    ])
  ) {
    return false
  }

  // ── scheduling (optional, both-or-neither when present) ──
  const scheduling = r.scheduling as Record<string, unknown> | undefined
  if (!scheduling || typeof scheduling !== 'object') return false
  for (const f of ['eventStartDate', 'eventStartTime', 'eventEndDate', 'eventEndTime'] as const) {
    if (typeof scheduling[f] !== 'string') return false
  }
  const startDate = scheduling.eventStartDate as string
  const startTime = scheduling.eventStartTime as string
  const endDate = scheduling.eventEndDate as string
  const endTime = scheduling.eventEndTime as string
  if (startDate && !DATE_PATTERN.test(startDate)) return false
  if (endDate && !DATE_PATTERN.test(endDate)) return false
  if (startTime && !TIME_PATTERN.test(startTime)) return false
  if (endTime && !TIME_PATTERN.test(endTime)) return false
  if (startDate && !endDate) return false
  if (endDate && !startDate) return false
  if (startDate && endDate && endDate < startDate) return false

  // ── notes (optional, length-capped) ──
  if (typeof r.notes !== 'string') return false
  if (!withinLengthCaps([[r.notes, MAX_LENGTHS.longText]])) return false

  return true
}

// ─── Display Labels ─────────────────────────────────────────────────────────

export const REQUESTER_LABELS: Record<RequesterType, string> = {
  school: 'School staff or coordinator',
  parent: 'Parent or guardian',
}

export const AWARD_LEVEL_LABELS: Record<AwardLevel | 'unsure', string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  unsure: 'Not sure yet',
}

export const TIER_INTEREST_LABELS: Record<TierInterest, string> = {
  'base-camp': 'Base Camp · From ₦3,000,000 for up to 60 students',
  'trail-ready': 'Trail Ready · From ₦5,000,000 for up to 60 students',
  'summit-partner': 'Summit Partner · From ₦8,000,000 for up to 60 students',
  unsure: 'Not sure — recommend on our call',
}

// ─── Tier Static Data (for email templates) ─────────────────────────────────

/**
 * Snapshot of the three DoE tier descriptions used in the customer email.
 * Mirrors the visible content on /schools/international-award and the live
 * tier data in lib/expedition-recommendation.ts. Lifted here so the email
 * template can render multiple tier cards (when the user picked "Not sure")
 * without depending on the assessment-specific summary helpers.
 */
export interface TierStaticData {
  key: 'base-camp' | 'trail-ready' | 'summit-partner'
  name: string
  price: string
  includes: string[]
}

export const DOE_TIERS: TierStaticData[] = [
  {
    key: 'base-camp',
    name: 'Base Camp',
    price: 'From ₦3,000,000 for up to 60 students',
    includes: [
      'Tent rental, sleeping bags, mats, and camping lights',
      'Equipment delivery and collection',
      'Setup guidance from our team',
      'Safety checklist document',
    ],
  },
  {
    key: 'trail-ready',
    name: 'Trail Ready',
    price: 'From ₦5,000,000 for up to 60 students',
    includes: [
      'Everything in Base Camp',
      'Camping Nigeria facilitators on-site throughout',
      'Structured programme: eco-awareness, team challenges, evening experience',
      'Parent communication pack ready to send',
      'Post-event summary report',
      'Photo documentation',
    ],
  },
  {
    key: 'summit-partner',
    name: 'Summit Partner',
    price: 'From ₦8,000,000 for up to 60 students',
    includes: [
      'Everything in Trail Ready',
      'Full custom programme design',
      'Catering coordination',
      'On-site first aid trained staff',
      'Branded participant certificates',
      'Professional photo and video recap',
      'Full written debrief with school leadership',
      'Priority annual slot',
    ],
  },
]

// Shared across every tier — base includes up to 60 students, then per-head to 100
export const DOE_PRICE_NOTE = 'Additional students from ₦50,000 each — max group of 100.'
