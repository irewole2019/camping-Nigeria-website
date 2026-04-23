/**
 * Deterministic tier recommendation for the Duke of Edinburgh expedition
 * assessment. Shared by both the client (to preview the result instantly)
 * and the API (to derive the trusted result for outbound email).
 */

export type AnswerKey = 'A' | 'B' | 'C' | 'D'
export type TierKey = 'base-camp' | 'trail-ready' | 'summit-partner'

export interface TierResult {
  key: TierKey
  name: string
  summary: string
  includes: string[]
  price: string
  priceNote: string
}

// Q2 (Award status) tunes the opening of the summary paragraph
const Q2_SUMMARY_PREFIX: Record<AnswerKey, string> = {
  A: 'Since your school already runs the Award, ',
  B: 'As your school prepares to launch the Award, ',
  C: 'Although your school is not yet running the Award, ',
  D: '',
}

// Q3 (Group size) is surfaced in the summary copy — answered by the user,
// not used to change the tier (pricing is flat: base 60 students, +₦50k/student to 100).
const Q3_GROUP_LABEL: Record<AnswerKey, string> = {
  A: 'your group of up to 30 students',
  B: 'your group of 30–60 students',
  C: 'your group of 60–100 students',
  D: 'a group your size',
}

// Shared across every tier — base includes up to 60 students, then per-head to 100
export const PRICE_NOTE = 'Additional students from ₦50,000 each — max group of 100.'

function buildTier(
  key: TierKey,
  name: string,
  summary: string,
  includes: string[],
  price: string,
): TierResult {
  return { key, name, summary, includes, price, priceNote: PRICE_NOTE }
}

export function isValidAnswerKey(v: unknown): v is AnswerKey {
  return v === 'A' || v === 'B' || v === 'C' || v === 'D'
}

export function getRecommendedTier(
  q2: AnswerKey | undefined,
  q3: AnswerKey | undefined,
  q4: AnswerKey | undefined,
): TierResult {
  const prefix = q2 ? Q2_SUMMARY_PREFIX[q2] : ''
  const groupLabel = q3 ? Q3_GROUP_LABEL[q3] : 'your group'

  // Helper that lowercases the first character of the base summary when a prefix is present
  const summary = (base: string) =>
    prefix ? prefix + base.charAt(0).toLowerCase() + base.slice(1) : base

  const tier = (k: TierKey): TierResult => {
    switch (k) {
      case 'base-camp':
        return buildTier(
          'base-camp',
          'Base Camp',
          summary(
            `You are in a good position to run the expedition yourself. What ${groupLabel} needs is reliable, quality equipment that is delivered, set up, and collected without drama.`,
          ),
          [
            'Tent rental, sleeping bags, mats, and camping lights',
            'Equipment delivery and collection',
            'Setup guidance from our team',
            'Safety checklist document',
          ],
          'From ₦3,000,000 for up to 60 students',
        )
      case 'trail-ready':
        return buildTier(
          'trail-ready',
          'Trail Ready',
          summary(
            `You need more than equipment. You need a structured program delivered by people who know what they are doing. Trail Ready puts our facilitators on-site alongside your team so ${groupLabel} has the expedition it should.`,
          ),
          [
            'Everything in Base Camp',
            'Camping Nigeria facilitators on-site throughout',
            'Structured program: eco-awareness, team challenges, evening experience',
            'Parent communication pack ready to send',
            'Post-event summary report',
            'Photo documentation',
          ],
          'From ₦5,000,000 for up to 60 students',
        )
      case 'summit-partner':
        return buildTier(
          'summit-partner',
          'Summit Partner',
          summary(
            `You want it done. Summit Partner means you hand over the operational weight for ${groupLabel} and we carry it. Equipment, facilitation, catering, first aid, certificates, documentation. Your school provides a teacher on-site and the student list. We handle the rest.`,
          ),
          [
            'Everything in Trail Ready',
            'Full custom program design',
            'Catering coordination',
            'On-site first aid trained staff',
            'Branded participant certificates',
            'Professional photo and video recap',
            'Full written debrief with school leadership',
            'Priority annual slot',
          ],
          'From ₦8,000,000 for up to 60 students',
        )
    }
  }

  switch (q4) {
    case 'A':
      return tier('base-camp')
    case 'C':
      return tier('summit-partner')
    case 'B':
    case 'D':
    default:
      return tier('trail-ready')
  }
}
