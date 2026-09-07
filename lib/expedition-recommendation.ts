/**
 * Deterministic package recommendation for the Duke of Edinburgh expedition
 * assessment. Shared by both the client (to preview the result instantly)
 * and the API (to derive the trusted result for outbound email).
 *
 * The three recommendable packages are the school offers in
 * `lib/offers-data.ts` — Field Day, The Campus Expedition, The Outdoor Year.
 * Names, inclusions and prices are read from there, never restated here, so
 * a price change is one edit in one file.
 *
 * This replaced the retired Base Camp / Trail Ready / Summit Partner tiers,
 * which differed by how much Camping Nigeria managed. The school offers
 * differ by duration and depth instead, so Q4 asks about time commitment
 * rather than management level — see decisions.md.
 */

import {
  formatPackagePrice,
  getOfferGroup,
  getPackagePriceNote,
  type OfferPackage,
} from '@/lib/offers-data'

export type AnswerKey = 'A' | 'B' | 'C' | 'D'
export type TierKey = 'field-day' | 'campus-expedition' | 'outdoor-year'

export interface TierResult {
  key: TierKey
  name: string
  summary: string
  includes: string[]
  price: string
  priceNote: string
}

/** Order matters — it is the Q4 A/B/C mapping, shallowest to deepest. */
export const TIER_KEYS: readonly TierKey[] = [
  'field-day',
  'campus-expedition',
  'outdoor-year',
]

export function isValidTierKey(v: unknown): v is TierKey {
  return typeof v === 'string' && (TIER_KEYS as readonly string[]).includes(v)
}

// Q2 (Award status) tunes the opening of the summary paragraph
const Q2_SUMMARY_PREFIX: Record<AnswerKey, string> = {
  A: 'Since your school already runs the Award, ',
  B: 'As your school prepares to launch the Award, ',
  C: 'Although your school is not yet running the Award, ',
  D: '',
}

// Q3 (Group size) is surfaced in the summary copy — answered by the user,
// not used to choose the package. Every school offer is priced as a
// mobilisation fee plus a per-student rate, so group size moves the quote
// rather than the recommendation.
const Q3_GROUP_LABEL: Record<AnswerKey, string> = {
  A: 'your group of up to 30 students',
  B: 'your group of 30–60 students',
  C: 'your group of 60–100 students',
  D: 'a group your size',
}

/**
 * Shared closing note. Individual packages carry their own mobilisation +
 * per-student breakdown, surfaced as `TierResult.priceNote`; this is the
 * blanket caveat that applies to all of them.
 */
export const PRICE_NOTE =
  'Prices are indicative and confirmed on group size, dates and location.'

/** Assessment-specific prose. The package's own `summary` is written for a
 *  browsing reader; these address someone who has just answered four
 *  questions, and weave in their group size. */
const SUMMARY_TEMPLATES: Record<TierKey, (groupLabel: string) => string> = {
  'field-day': (g) =>
    `A single facilitated day on your own campus is the right place to start. We bring the equipment, the facilitators and the safety paperwork, your teachers supervise, and ${g} gets a full programme without anyone having to travel.`,
  'campus-expedition': (g) =>
    `Two days and a night on campus gives ${g} a real expedition without leaving the school gates. Students pitch and strike their own camp, sleep in it, and you get the overnight supervision plan, the certificates and the impact report that come with it.`,
  'outdoor-year': (g) =>
    `You are planning at the calendar level, not the event level. The Outdoor Year locks two to three programmes for ${g} before the school year fills up, designed so each year group builds on the last.`,
}

function toTierResult(pkg: OfferPackage, summary: string): TierResult {
  return {
    key: pkg.slug as TierKey,
    name: pkg.name,
    summary,
    includes: pkg.includes,
    price: formatPackagePrice(pkg),
    priceNote: getPackagePriceNote(pkg) ?? PRICE_NOTE,
  }
}

export function isValidAnswerKey(v: unknown): v is AnswerKey {
  return v === 'A' || v === 'B' || v === 'C' || v === 'D'
}

// Reasonable upper bound for a single school's expedition group; rejects
// fabricated values without constraining real big-school requests.
const MAX_GROUP_SIZE = 5000

/**
 * Validates a raw student count from the assessment form. Must be a positive
 * integer within the upper bound.
 */
export function isValidGroupSize(v: unknown): v is number {
  return (
    typeof v === 'number' &&
    Number.isFinite(v) &&
    Number.isInteger(v) &&
    v >= 1 &&
    v <= MAX_GROUP_SIZE
  )
}

/**
 * Map a raw student count to the assessment's A/B/C/D bucket so the copy
 * helpers have a label to use.
 *
 * Boundaries match the original Q3 labels (Under 30 / 30 to 60 / 60 to 100 /
 * More than 100). The labels overlap at the edges (60 is in both B and C);
 * we resolve in favour of the lower bucket so 60 students lands in B
 * "30 to 60", and 61 lands in C "60 to 100".
 */
export function bucketGroupSizeToAnswerKey(n: number): AnswerKey {
  if (n < 30) return 'A'
  if (n <= 60) return 'B'
  if (n <= 100) return 'C'
  return 'D'
}

/**
 * Q4 selects the package by time commitment:
 *   A → Field Day (one day)
 *   B → The Campus Expedition (two days, one night)
 *   C → The Outdoor Year (programmes across the year)
 *   D / unanswered → The Campus Expedition, the middle option
 */
export function getRecommendedTier(
  q2: AnswerKey | undefined,
  q3: AnswerKey | undefined,
  q4: AnswerKey | undefined,
): TierResult {
  const prefix = q2 ? Q2_SUMMARY_PREFIX[q2] : ''
  const groupLabel = q3 ? Q3_GROUP_LABEL[q3] : 'your group'

  const key: TierKey =
    q4 === 'A' ? 'field-day' : q4 === 'C' ? 'outdoor-year' : 'campus-expedition'

  const pkg = getOfferGroup('schools').packages.find((p) => p.slug === key)
  if (!pkg) throw new Error(`Recommendation references a missing package: ${key}`)

  const base = SUMMARY_TEMPLATES[key](groupLabel)
  // Lowercase the first character of the base summary when a prefix is present
  const summary = prefix
    ? prefix + base.charAt(0).toLowerCase() + base.slice(1)
    : base

  return toTierResult(pkg, summary)
}
