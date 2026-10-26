/**
 * The four MAD Settings tribes (house colours), added 26/10/2026. Every
 * sign-up belongs to one; a couple ticket is one sign-up, so a couple shares
 * a tribe.
 *
 * **The Google Sheet assigns them, not the site.** Only the sheet knows how
 * many people are in each tribe, so the Apps Script gives each new sign-up the
 * tribe with the fewest people (a couple counts as two) and stores it in the
 * Tribe column. `TRIBE_NAMES` in `docs/mad-settings/apps-script.gs` is a
 * second copy of the names below, in the same order; change both together.
 *
 * `tribeFromCode` is only the fallback for a sign-up the sheet did not record
 * (webhook down). The internal email then says the tribe is not in the sheet,
 * so the team adds it by hand with the rest of the row.
 */

export type TribeId = 'gadaff' | 'kutinga' | 'mandi' | 'sellas'

export interface Tribe {
  id: TribeId
  /** As written on the badge, in the sheet, and everywhere a guest sees it. */
  name: string
  /** The animal on the badge, for alt text. */
  animal: string
  /** Badge colour, sampled from the artwork. */
  colour: string
  /** Text colour that reads on `colour`. */
  ink: string
  /** The team's badge artwork, transparent PNG. */
  image: string
  imageWidth: number
  imageHeight: number
}

export const TRIBES: readonly Tribe[] = [
  {
    id: 'gadaff',
    name: 'Gadaff',
    animal: 'ram',
    colour: '#ffcf26',
    ink: '#1a1a1a',
    image: '/images/events/mad-settings/tribes/gadaff.png',
    imageWidth: 332,
    imageHeight: 137,
  },
  {
    id: 'kutinga',
    name: 'Kutinga',
    animal: 'eagle',
    colour: '#da1717',
    ink: '#ffffff',
    image: '/images/events/mad-settings/tribes/kutinga.png',
    imageWidth: 310,
    imageHeight: 130,
  },
  {
    id: 'mandi',
    name: 'Mandi',
    animal: 'bear',
    colour: '#2a5b18',
    ink: '#ffffff',
    image: '/images/events/mad-settings/tribes/mandi.png',
    imageWidth: 276,
    imageHeight: 140,
  },
  {
    id: 'sellas',
    name: 'Sellas',
    animal: 'wolf',
    colour: '#111111',
    ink: '#ffffff',
    image: '/images/events/mad-settings/tribes/sellas.png',
    imageWidth: 276,
    imageHeight: 138,
  },
]

export function getTribe(id: TribeId): Tribe {
  const tribe = TRIBES.find((t) => t.id === id)
  if (!tribe) throw new Error(`Unknown tribe: ${id}`)
  return tribe
}

export function isValidTribeId(v: unknown): v is TribeId {
  return typeof v === 'string' && TRIBES.some((t) => t.id === v)
}

/**
 * The sheet stores the display name ("Kutinga"). Accepts any case and stray
 * spaces, since the column can be edited by hand; null for anything else.
 */
export function tribeFromName(v: unknown): Tribe | null {
  if (typeof v !== 'string') return null
  const key = v.trim().toLowerCase()
  return TRIBES.find((t) => t.name.toLowerCase() === key) ?? null
}

/**
 * Fallback only — see the module comment. Stable for a given code, so the
 * email, the confirmation page and the internal notification agree.
 */
export function tribeFromCode(code: string): Tribe {
  let h = 0
  for (const ch of code.trim().toUpperCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return TRIBES[h % TRIBES.length]
}

/**
 * Fallback partner tribe for a couple the sheet did not record: always a
 * different tribe from the guest's, and stable for the code.
 */
export function partnerTribeFromCode(code: string, guestTribe: Tribe): Tribe {
  const others = TRIBES.filter((t) => t.id !== guestTribe.id)
  let h = 7
  for (const ch of code.trim().toUpperCase()) h = (h * 17 + ch.charCodeAt(0)) >>> 0
  return others[h % others.length]
}

/** "Ada Obi" → "Ada"; empty for a blank name. Splits on whitespace only. */
export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ''
}

/** "Kutinga tribe badge: an eagle" — the badge's alt text, wherever it shows. */
export function tribeBadgeAlt(tribe: Tribe): string {
  const article = /^[aeiou]/i.test(tribe.animal) ? 'an' : 'a'
  return `${tribe.name} tribe badge: ${article} ${tribe.animal}`
}

/** People a ticket brings, for balancing: a couple ticket is two. */
export function peopleForTicket(ticketLabelOrId: string): 1 | 2 {
  return /couple/i.test(ticketLabelOrId) ? 2 : 1
}

/**
 * The link the team asked to close every confirmation email with (26/10/2026),
 * worded as they gave it.
 */
export const SOCIAL_URL = 'https://madsettings.theboostnation.space/'
export const SOCIAL_LINE_BEFORE = 'Visit '
export const SOCIAL_LINE_AFTER =
  ' to join the social part of the camping experience for the African Dream Camping Experience.'
