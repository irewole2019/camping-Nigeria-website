/**
 * Deterministic proposal engine.
 * Takes form answers, scores them against three programs,
 * and returns the best-fit program + tier recommendation.
 *
 * The engine is purely qualitative — it scores against what the school
 * wants to achieve (audience, goals, venue, activities), not against
 * duration. Timing comes from the separate `Scheduling` payload as
 * informational input for the team, never as a scoring signal.
 */

import {
  ON_CAMPUS_CAMPS,
  NATURE_CRAFT,
  LEADERSHIP_DEVELOPMENT,
  type ProgramData,
} from './program-data'

// ─── Form Types ─────────────────────────────────────────────────────────────

export type SchoolType = 'primary' | 'secondary' | 'mixed' | 'university'
export type ClassLevel = 'primary-1-3' | 'primary-4-6' | 'jss-1-3' | 'ss-1-3' | 'mixed'
export type PrimaryGoal = 'team-bonding' | 'eco-creativity' | 'leadership' | 'celebration'
export type ParticipantType = 'general' | 'leaders' | 'mix'
export type Venue = 'on-campus' | 'off-campus' | 'either'
export type Activity =
  | 'camping-tents'
  | 'adire-crafts'
  | 'sports-games'
  | 'leadership-challenges'
  | 'eco-nature'
  | 'bonfire-stories'
  | 'journaling'

/**
 * Drives the On-Campus Camps tier (Spark/Trail/Summit) when camps wins.
 * Asked unconditionally on the form so the engine has the answer when it
 * needs it. Non-camps recommendations ignore this field.
 */
export type OvernightPreference = 'day-only' | 'day-evening' | 'open-to-overnight'

/**
 * Internal bucket used by tier-selection logic for nature-craft and
 * leadership-development. The form sends a raw integer `groupSize`; we
 * bucket it server-side via `bucketGroupSize()`.
 */
export type GroupSizeBucket = 'under-40' | '40-80' | '80-150' | '150+'

export interface ProposalAnswers {
  schoolType: SchoolType
  classLevel: ClassLevel
  /** Raw student count from the form. Bucketed internally for scoring. */
  groupSize: number
  primaryGoal: PrimaryGoal
  participantType: ParticipantType
  venue: Venue
  activities: Activity[]
  overnightPreference: OvernightPreference
}

export interface ContactInfo {
  contactName: string
  role: string
  schoolName: string
  email: string
  phone: string
  website: string
}

/**
 * Optional scheduling input. Captured at Step 6 of the form. Never feeds
 * the engine — purely informational for the team. Empty strings when the
 * customer leaves the dates blank ("rough dates fine").
 */
export interface Scheduling {
  eventStartDate: string  // 'YYYY-MM-DD' or ''
  eventStartTime: string  // 'HH:MM' or ''
  eventEndDate: string
  eventEndTime: string
}

export interface ProposalResult {
  program: ProgramData
  tier: ProgramData['tiers'][number]
  scores: { camps: number; nature: number; leadership: number }
}

// ─── Answer Allowlists (for server-side validation) ─────────────────────────

const VALID_SCHOOL_TYPES: readonly SchoolType[] = ['primary', 'secondary', 'mixed', 'university']
const VALID_CLASS_LEVELS: readonly ClassLevel[] = ['primary-1-3', 'primary-4-6', 'jss-1-3', 'ss-1-3', 'mixed']
const VALID_GOALS: readonly PrimaryGoal[] = ['team-bonding', 'eco-creativity', 'leadership', 'celebration']
const VALID_PARTICIPANT_TYPES: readonly ParticipantType[] = ['general', 'leaders', 'mix']
const VALID_VENUES: readonly Venue[] = ['on-campus', 'off-campus', 'either']
const VALID_ACTIVITIES: readonly Activity[] = [
  'camping-tents',
  'adire-crafts',
  'sports-games',
  'leadership-challenges',
  'eco-nature',
  'bonfire-stories',
  'journaling',
]
const VALID_OVERNIGHT_PREFERENCES: readonly OvernightPreference[] = [
  'day-only',
  'day-evening',
  'open-to-overnight',
]

// Reasonable upper bound for a single school proposal; rejects fabricated
// 1e9 values without constraining real big-school requests.
const MAX_GROUP_SIZE = 5000

/**
 * Map a raw student count to the bucket used by tier-selection logic.
 * Boundaries match the historical enum (Under 40 / 40–80 / 80–150 / 150+).
 */
export function bucketGroupSize(n: number): GroupSizeBucket {
  if (n < 40) return 'under-40'
  if (n < 80) return '40-80'
  if (n < 150) return '80-150'
  return '150+'
}

/**
 * Validates a raw payload against the full ProposalAnswers shape, including
 * allowlists for every enum field. Used by the API to reject fabricated keys.
 */
export function isValidAnswers(raw: unknown): raw is ProposalAnswers {
  if (!raw || typeof raw !== 'object') return false
  const a = raw as Record<string, unknown>

  const inList = <T extends string>(v: unknown, list: readonly T[]): v is T =>
    typeof v === 'string' && (list as readonly string[]).includes(v)

  if (!inList(a.schoolType, VALID_SCHOOL_TYPES)) return false
  if (!inList(a.classLevel, VALID_CLASS_LEVELS)) return false
  if (
    typeof a.groupSize !== 'number' ||
    !Number.isFinite(a.groupSize) ||
    !Number.isInteger(a.groupSize) ||
    a.groupSize < 1 ||
    a.groupSize > MAX_GROUP_SIZE
  ) {
    return false
  }
  if (!inList(a.primaryGoal, VALID_GOALS)) return false
  if (!inList(a.participantType, VALID_PARTICIPANT_TYPES)) return false
  if (!inList(a.venue, VALID_VENUES)) return false
  if (!Array.isArray(a.activities)) return false
  if (!a.activities.every((v) => inList(v, VALID_ACTIVITIES))) return false
  if (!inList(a.overnightPreference, VALID_OVERNIGHT_PREFERENCES)) return false

  return true
}

// ─── Scoring Tables ─────────────────────────────────────────────────────────

type Scores = [camps: number, nature: number, leadership: number]

const SCHOOL_TYPE_SCORES: Record<SchoolType, Scores> = {
  primary:    [2, 3, 0],
  secondary:  [2, 1, 3],
  mixed:      [2, 2, 1],
  university: [0, 3, 2],
}

const CLASS_LEVEL_SCORES: Record<ClassLevel, Scores> = {
  'primary-1-3': [1, 3, 0],
  'primary-4-6': [2, 2, 0],
  'jss-1-3':     [3, 2, 1],
  'ss-1-3':      [1, 0, 4],
  mixed:         [2, 1, 1],
}

const GOAL_SCORES: Record<PrimaryGoal, Scores> = {
  'team-bonding':   [4, 1, 1],
  'eco-creativity': [1, 4, 0],
  leadership:       [0, 0, 5],
  celebration:      [3, 3, 0],
}

const PARTICIPANT_SCORES: Record<ParticipantType, Scores> = {
  general: [3, 3, 0],
  leaders: [0, 0, 5],
  mix:     [1, 1, 2],
}

const VENUE_SCORES: Record<Venue, Scores> = {
  'on-campus':  [3, 1, 1],
  'off-campus': [1, 3, 2],
  either:       [2, 2, 2],
}

const ACTIVITY_SCORES: Record<Activity, Scores> = {
  'camping-tents':         [4, 1, 0],
  'adire-crafts':          [0, 4, 0],
  'sports-games':          [3, 2, 1],
  'leadership-challenges': [0, 0, 4],
  'eco-nature':            [1, 4, 0],
  'bonfire-stories':       [3, 3, 0],
  journaling:              [1, 1, 3],
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

function addScores(base: Scores, add: Scores): Scores {
  return [base[0] + add[0], base[1] + add[1], base[2] + add[2]]
}

export function scoreAnswers(answers: ProposalAnswers): ProposalResult {
  let scores: Scores = [0, 0, 0]

  scores = addScores(scores, SCHOOL_TYPE_SCORES[answers.schoolType])
  scores = addScores(scores, CLASS_LEVEL_SCORES[answers.classLevel])
  scores = addScores(scores, GOAL_SCORES[answers.primaryGoal])
  scores = addScores(scores, PARTICIPANT_SCORES[answers.participantType])
  scores = addScores(scores, VENUE_SCORES[answers.venue])

  for (const activity of answers.activities) {
    scores = addScores(scores, ACTIVITY_SCORES[activity])
  }

  const [camps, nature, leadership] = scores

  // On-Campus Camps is on-campus by program definition. If the school
  // explicitly asked for off-campus, camps is incoherent regardless of how
  // the rest of the answers score.
  const campsAllowed = answers.venue !== 'off-campus'
  const effectiveCamps = campsAllowed ? camps : -Infinity

  // Determine winning program — ties broken by goal alignment
  let program: ProgramData
  if (effectiveCamps >= nature && effectiveCamps >= leadership) {
    program = ON_CAMPUS_CAMPS
  } else if (nature >= leadership) {
    program = NATURE_CRAFT
  } else {
    program = LEADERSHIP_DEVELOPMENT
  }

  // Goal-based tiebreaker override
  if (effectiveCamps === nature && nature === leadership) {
    if (answers.primaryGoal === 'leadership') program = LEADERSHIP_DEVELOPMENT
    else if (answers.primaryGoal === 'eco-creativity') program = NATURE_CRAFT
    else program = campsAllowed ? ON_CAMPUS_CAMPS : NATURE_CRAFT
  }

  const tier = selectTier(program, answers)

  return {
    program,
    tier,
    scores: { camps, nature, leadership },
  }
}

// ─── Tier Selection ─────────────────────────────────────────────────────────

function selectTier(
  program: ProgramData,
  answers: ProposalAnswers
): ProgramData['tiers'][number] {
  const tiers = program.tiers
  const groupSize = bucketGroupSize(answers.groupSize)

  // tiers are always ordered: entry [0], mid [1], premium [2]
  if (program.slug === 'on-campus-camps') {
    // tier follows overnight preference directly
    if (answers.overnightPreference === 'open-to-overnight') return tiers[2] // Summit
    if (answers.overnightPreference === 'day-evening') return tiers[1]       // Trail
    return tiers[0]                                                          // Spark (day-only)
  }

  if (program.slug === 'nature-craft') {
    if (groupSize === '150+' || answers.venue === 'off-campus') return tiers[2] // Bloom
    if (groupSize === '80-150' || groupSize === '40-80') return tiers[1]        // Grow
    return tiers[0]                                                              // Seed
  }

  // leadership-development
  if (
    groupSize === '150+' ||
    groupSize === '80-150' ||
    answers.venue === 'off-campus'
  ) {
    return tiers[2] // Influence
  }
  if (groupSize === '40-80') return tiers[1] // Lead
  return tiers[0]                            // Rise
}

// ─── Email Formatting ───────────────────────────────────────────────────────

const QUESTION_LABELS: Record<string, string> = {
  schoolType: 'School type',
  classLevel: 'Class level',
  groupSize: 'Group size',
  primaryGoal: 'Primary goal',
  participantType: 'Participants',
  venue: 'Venue preference',
  activities: 'Activities of interest',
  overnightPreference: 'Overnight preference',
}

const OPTION_LABELS: Record<string, string> = {
  primary: 'Primary school',
  secondary: 'Secondary school',
  mixed: 'Mixed (Primary & Secondary)',
  university: 'University or College',
  'primary-1-3': 'Primary 1–3',
  'primary-4-6': 'Primary 4–6',
  'jss-1-3': 'JSS 1–3',
  'ss-1-3': 'SS 1–3',
  'team-bonding': 'Team bonding & school community',
  'eco-creativity': 'Environmental awareness & creativity',
  leadership: 'Student leadership & character development',
  celebration: 'End-of-term celebration or reward',
  general: 'General student body',
  leaders: 'Prefects, captains, or council members',
  mix: 'A mix of both',
  'on-campus': 'On school campus',
  'off-campus': 'Off-campus outdoor venue',
  either: 'Either works',
  'camping-tents': 'Camping & tent setup',
  'adire-crafts': 'Adire tie-dye & cultural crafts',
  'sports-games': 'Sports & team games',
  'leadership-challenges': 'Leadership challenges & simulations',
  'eco-nature': 'Eco-awareness & nature walks',
  'bonfire-stories': 'Bonfire & storytelling',
  journaling: 'Journaling & reflection',
  'day-only': 'Day only (no overnight, no evening)',
  'day-evening': 'Day + evening (no overnight)',
  'open-to-overnight': 'Open to overnight stay',
}

export function formatEmailBody(
  answers: ProposalAnswers,
  contact: ContactInfo,
  result: ProposalResult
): string {
  const lines: string[] = [
    'RECOMMENDED PROGRAM',
    `  Program: ${result.program.title}`,
    `  Package: ${result.tier.name} (${result.tier.tag})`,
    `  Format: ${result.tier.duration}`,
    '',
    'SCHOOL DETAILS',
    `  School: ${contact.schoolName}`,
    `  Contact: ${contact.contactName}, ${contact.role}`,
    `  Email: ${contact.email}`,
    `  Phone: ${contact.phone}`,
    contact.website ? `  Website: ${contact.website}` : '',
    '',
    'RESPONSES',
  ]

  for (const [key, label] of Object.entries(QUESTION_LABELS)) {
    if (key === 'groupSize') {
      lines.push(`  ${label}: ${answers.groupSize} students`)
      continue
    }
    const value = answers[key as keyof ProposalAnswers]
    if (Array.isArray(value)) {
      lines.push(`  ${label}: ${value.map((v) => OPTION_LABELS[v] || v).join(', ')}`)
    } else {
      lines.push(`  ${label}: ${OPTION_LABELS[value as string] || value}`)
    }
  }

  lines.push('')
  lines.push('Sent from campingnigeria.com proposal form')

  return lines.filter((l) => l !== undefined).join('\n')
}

export function formatEmailSubject(contact: ContactInfo): string {
  return `New School Proposal Request — ${contact.schoolName}`
}
