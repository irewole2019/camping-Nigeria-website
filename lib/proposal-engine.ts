/**
 * Deterministic proposal engine.
 * Takes form answers, scores them against three programs,
 * and returns the best-fit program + tier recommendation.
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
export type GroupSize = 'under-40' | '40-80' | '80-150' | '150+'
export type PrimaryGoal = 'team-bonding' | 'eco-creativity' | 'leadership' | 'celebration'
export type ParticipantType = 'general' | 'leaders' | 'mix'
export type Duration = 'half-day' | 'full-day' | '2-days'
export type Venue = 'on-campus' | 'off-campus' | 'either'
export type Activity =
  | 'camping-tents'
  | 'adire-crafts'
  | 'sports-games'
  | 'leadership-challenges'
  | 'eco-nature'
  | 'bonfire-stories'
  | 'journaling'

export interface ProposalAnswers {
  schoolType: SchoolType
  classLevel: ClassLevel
  groupSize: GroupSize
  primaryGoal: PrimaryGoal
  participantType: ParticipantType
  duration: Duration
  venue: Venue
  activities: Activity[]
}

export interface ContactInfo {
  contactName: string
  role: string
  schoolName: string
  email: string
  phone: string
  website: string
}

export interface ProposalResult {
  program: ProgramData
  tier: ProgramData['tiers'][number]
  scores: { camps: number; nature: number; leadership: number }
}

// ─── Answer Allowlists (for server-side validation) ─────────────────────────

const VALID_SCHOOL_TYPES: readonly SchoolType[] = ['primary', 'secondary', 'mixed', 'university']
const VALID_CLASS_LEVELS: readonly ClassLevel[] = ['primary-1-3', 'primary-4-6', 'jss-1-3', 'ss-1-3', 'mixed']
const VALID_GROUP_SIZES: readonly GroupSize[] = ['under-40', '40-80', '80-150', '150+']
const VALID_GOALS: readonly PrimaryGoal[] = ['team-bonding', 'eco-creativity', 'leadership', 'celebration']
const VALID_PARTICIPANT_TYPES: readonly ParticipantType[] = ['general', 'leaders', 'mix']
const VALID_DURATIONS: readonly Duration[] = ['half-day', 'full-day', '2-days']
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
  if (!inList(a.groupSize, VALID_GROUP_SIZES)) return false
  if (!inList(a.primaryGoal, VALID_GOALS)) return false
  if (!inList(a.participantType, VALID_PARTICIPANT_TYPES)) return false
  if (!inList(a.duration, VALID_DURATIONS)) return false
  if (!inList(a.venue, VALID_VENUES)) return false
  if (!Array.isArray(a.activities)) return false
  if (!a.activities.every((v) => inList(v, VALID_ACTIVITIES))) return false

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

const DURATION_SCORES: Record<Duration, Scores> = {
  'half-day': [0, 2, 3],
  'full-day': [1, 4, 2],
  '2-days':   [5, 0, 0],
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
  scores = addScores(scores, DURATION_SCORES[answers.duration])
  scores = addScores(scores, VENUE_SCORES[answers.venue])

  for (const activity of answers.activities) {
    scores = addScores(scores, ACTIVITY_SCORES[activity])
  }

  const [camps, nature, leadership] = scores

  // All on-campus-camps tiers are 2-day packages (see program-data.ts).
  // If the user didn't pick a 2-day duration, camps is a content mismatch —
  // disqualify it from winning regardless of score.
  const campsEligible = answers.duration === '2-days'
  const effectiveCamps = campsEligible ? camps : -Infinity

  // Determine winning program — ties broken by goal alignment
  let program: ProgramData
  if (effectiveCamps >= nature && effectiveCamps >= leadership) {
    program = ON_CAMPUS_CAMPS
  } else if (nature >= leadership) {
    program = NATURE_CRAFT
  } else {
    program = LEADERSHIP_DEVELOPMENT
  }

  // Goal-based tiebreaker override (only applies when eligible)
  if (effectiveCamps === nature && nature === leadership) {
    if (answers.primaryGoal === 'leadership') program = LEADERSHIP_DEVELOPMENT
    else if (answers.primaryGoal === 'eco-creativity') program = NATURE_CRAFT
    else program = campsEligible ? ON_CAMPUS_CAMPS : NATURE_CRAFT
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
  const { duration, groupSize, venue } = answers
  const tiers = program.tiers

  // tiers are always ordered: entry [0], mid [1], premium [2]
  if (program.slug === 'on-campus-camps') {
    // campsEligible guarantees duration === '2-days' here, so duration can't
    // differentiate tiers. Use groupSize instead — matches the pattern of
    // nature-craft and leadership-development.
    if (groupSize === '150+') return tiers[2] // Summit
    if (groupSize === '80-150' || groupSize === '40-80') return tiers[1] // Trail
    return tiers[0] // Spark
  }

  if (program.slug === 'nature-craft') {
    if ((duration === 'full-day' && venue === 'off-campus') || groupSize === '150+') return tiers[2] // Bloom
    if (duration === 'full-day' || groupSize === '80-150' || groupSize === '40-80') return tiers[1] // Grow
    return tiers[0] // Seed
  }

  // leadership-development
  if (duration === 'full-day' || venue === 'off-campus' || groupSize === '80-150' || groupSize === '150+') return tiers[2] // Influence
  if (duration === 'half-day' && groupSize !== 'under-40') return tiers[1] // Lead
  return tiers[0] // Rise
}

// ─── Email Formatting ───────────────────────────────────────────────────────

const QUESTION_LABELS: Record<string, string> = {
  schoolType: 'School type',
  classLevel: 'Class level',
  groupSize: 'Group size',
  primaryGoal: 'Primary goal',
  participantType: 'Participants',
  duration: 'Duration',
  venue: 'Venue preference',
  activities: 'Activities of interest',
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
  'under-40': 'Under 40 students',
  '40-80': '40–80 students',
  '80-150': '80–150 students',
  '150+': '150+ students',
  'team-bonding': 'Team bonding & school community',
  'eco-creativity': 'Environmental awareness & creativity',
  leadership: 'Student leadership & character development',
  celebration: 'End-of-term celebration or reward',
  general: 'General student body',
  leaders: 'Prefects, captains, or council members',
  mix: 'A mix of both',
  'half-day': 'Half day (3–4 hours)',
  'full-day': 'Full day (6–8 hours)',
  '2-days': '2 days',
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
    `  Duration: ${result.tier.duration}`,
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
