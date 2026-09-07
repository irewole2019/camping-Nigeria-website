/**
 * Types and helpers for the dedicated DoE proposal flow.
 *
 * Unlike the school-programmes proposal (which scores answers and picks a
 * program/tier), this is a structured contact form. The user picks the
 * package directly — Field Day / The Campus Expedition / The Outdoor Year —
 * or "Not sure" if they want the team to recommend one. No engine.
 *
 * Package names, prices and inclusions come from `lib/offers-data.ts`; this
 * module never restates them. The retired Base Camp / Trail Ready / Summit
 * Partner tiers are still accepted as legacy `?tier=` values by the form —
 * see `AwardProposalForm` — but are not valid payload values.
 */

import { MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import {
  formatPackagePrice,
  getOfferGroup,
  type OfferPackage,
} from '@/lib/offers-data'

// ─── Form Types ─────────────────────────────────────────────────────────────

export type RequesterType = 'school' | 'parent'
export type AwardLevel = 'bronze' | 'silver' | 'gold'
export type ParentAwardLevel = AwardLevel | 'unsure'
export type TierInterest =
  | 'field-day'
  | 'campus-expedition'
  | 'outdoor-year'
  | 'unsure'

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
  'field-day',
  'campus-expedition',
  'outdoor-year',
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

// ─── Package data (derived from the offers catalogue) ───────────────────────

/**
 * The school packages a requester can express interest in, in the order they
 * are offered. Read straight from `lib/offers-data.ts` so the form, the email
 * and `/offers/schools` can never disagree about a name or a price.
 */
export const SCHOOL_PACKAGES: OfferPackage[] = getOfferGroup('schools').packages

/** Package slugs in offer order, plus the "Not sure" escape hatch last. */
export const TIER_KEYS: readonly TierInterest[] = [
  ...SCHOOL_PACKAGES.map((p) => p.slug as TierInterest),
  'unsure',
]

/** Radio labels, e.g. "Field Day · From ₦3,000,000". */
export const TIER_INTEREST_LABELS: Record<TierInterest, string> = {
  ...(Object.fromEntries(
    SCHOOL_PACKAGES.map((p) => [p.slug, `${p.name} · ${formatPackagePrice(p)}`]),
  ) as Record<Exclude<TierInterest, 'unsure'>, string>),
  unsure: 'Not sure — recommend on our call',
}

export interface TierStaticData {
  key: Exclude<TierInterest, 'unsure'>
  name: string
  price: string
  includes: string[]
}

/** Card data for the customer email. One entry per package, offer order. */
export const DOE_TIERS: TierStaticData[] = SCHOOL_PACKAGES.map((p) => ({
  key: p.slug as Exclude<TierInterest, 'unsure'>,
  name: p.name,
  price: formatPackagePrice(p),
  includes: p.includes,
}))

/** Blanket caveat under the package cards in the customer email. */
export const DOE_PRICE_NOTE =
  'Prices are indicative and confirmed on group size, dates and location. Quotes are issued within 72 hours of a planning call.'
