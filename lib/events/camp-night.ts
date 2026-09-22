/**
 * Source of truth for September Camp Night, 26 September 2026.
 * Read by the page render, the sign-up API, the confirmation email, the
 * confirmation page, the Sheet row, and the Event JSON-LD.
 *
 * Details came from the flyer (title, strapline, host, the six feature
 * callouts) and from the team (date, venue, times, prices, capacity, and the
 * bring/provide/note lists). Nothing here is inferred.
 */

export type EventStatus = 'upcoming' | 'past'

export const EVENT_TITLE = 'Camp Night'
export const EVENT_FULL_TITLE = 'September Camp Night'
export const EVENT_TAGLINE = 'A Night Outdoors'
export const EVENT_STRAPLINE = 'Camp · Connect · Celebrate'
export const EVENT_HOST = 'DJ SARZ'

export const EVENT_DESCRIPTION =
  'A one-night outdoor camp at Brooks Garden and Events Centre, Abuja, on Saturday 26 September 2026. Tents and mattresses provided, three DJs hosted by DJ SARZ, bonfire, karaoke, movies and games. From ₦20,000.'

// 26 September 2026, Saturday — Africa/Lagos is UTC+1, no DST.
// Runs from 6pm through the night; the end stamp is the morning after.
//
// 6pm is the flyer's own time ("SEPT 26TH 6PM"), which is already circulating.
// An earlier brief said 4pm; the flyer won because it is what campers have
// actually seen. The end stamp is an assumption — nobody has given a closing
// time, and schema.org requires one — so correct it if there is a real one.
export const EVENT_START_ISO = '2026-09-26T18:00:00+01:00'
export const EVENT_END_ISO = '2026-09-27T09:00:00+01:00'
export const EVENT_DATE_LABEL = 'Saturday, 26 September 2026'
export const EVENT_TIME_LABEL = '6:00 PM, through the night'

export const VENUE_NAME = 'Brooks Garden and Events Centre'
export const VENUE_CITY = 'Abuja'
export const VENUE_REGION = 'FCT'
export const VENUE_COUNTRY = 'NG'
export const VENUE_LABEL = 'Brooks Garden and Events Centre, Abuja'
export const VENUE_MAP_URL = 'https://maps.app.goo.gl/Mm2LJwSE5USiVgdU6?g_st=ic'

/**
 * The cap is **50 tents**, not 50 people: a couple tent holds two and a
 * shared tent more, so the headcount is deliberately not derived from it.
 * That is also why the Event JSON-LD omits `maximumAttendeeCapacity` — it is
 * a people field, and publishing a tent count there would be wrong data.
 */
export const TENT_CAP = 50

export const EVENT_PATH = '/events/camp-night'
export const REGISTERED_PATH = '/events/camp-night/registered'

/**
 * Lifecycle. Explicit flag rather than a date comparison, for the same reason
 * as the other events: these pages are statically rendered, so `Date.now()`
 * bakes in at build time and goes stale between deploys. Flip to 'past' after
 * the 26th to close sign-ups, drop the Offer from the schema and switch the
 * page to recap framing.
 */
export const EVENT_STATUS: EventStatus = 'upcoming'

export function isSignupOpen(status: EventStatus): boolean {
  return status === 'upcoming'
}

export const SIGNUP_OPEN: boolean = isSignupOpen(EVENT_STATUS)

// ─── Tent packages ──────────────────────────────────────────────────────────

export type TentPackageId = 'shared' | 'single' | 'couple'

export interface TentPackage {
  id: TentPackageId
  name: string
  /** What the buyer is actually getting, in their words. */
  detail: string
  price: number
  /** Sheet and email label, e.g. "Couple tent (2 in a tent)". */
  label: string
}

export const TENT_PACKAGES: TentPackage[] = [
  {
    id: 'shared',
    name: 'Shared tent',
    detail: 'A spot in a shared tent. The sociable option, and the cheapest way in.',
    price: 20_000,
    label: 'Shared tent',
  },
  {
    id: 'single',
    name: 'Single tent',
    detail: 'A tent to yourself. One person, one tent, your own space for the night.',
    price: 25_000,
    label: 'Single tent (1 person)',
  },
  {
    id: 'couple',
    name: 'Couple tent',
    detail: 'A tent for two. Book once, bring your person.',
    price: 30_000,
    label: 'Couple tent (2 in a tent)',
  },
]

export const PACKAGE_IDS: readonly TentPackageId[] = TENT_PACKAGES.map((p) => p.id)

export function isValidPackageId(v: unknown): v is TentPackageId {
  return typeof v === 'string' && (PACKAGE_IDS as readonly string[]).includes(v)
}

export function getTentPackage(id: TentPackageId): TentPackage {
  const pkg = TENT_PACKAGES.find((p) => p.id === id)
  if (!pkg) throw new Error(`Unknown tent package: ${id}`)
  return pkg
}

/** Lowest price on the page, for "from ₦X" copy and the schema Offer. */
export const LOWEST_PRICE = Math.min(...TENT_PACKAGES.map((p) => p.price))

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

// ─── What the night includes ────────────────────────────────────────────────

/** Straight from the flyer's feature block. */
export const FLYER_HIGHLIGHTS: readonly string[] = [
  'Free popcorn and drinks',
  'Karaoke',
  'Bonfire',
  'Movies',
  'Games',
  'Music',
] as const

export const WE_PROVIDE: readonly string[] = [
  'Tent and mattress',
  'Music, 3 DJs, bonfire, games, movies, karaoke',
  'Free popcorn and soft drinks',
  'Mats, canopies, sit-out area',
  'Clear bags to protect your phone if it rains',
] as const

export const BRING: readonly string[] = [
  'Bedsheet, small throw pillow and small throw blanket. Nothing too big, please. A limited number are available to rent.',
  'Pack light. One small bag is plenty.',
  'Warm clothes: a hoodie, socks or stockings for the night cold.',
  'Slippers or Crocs',
  'Toiletries and wipes',
  'Mosquito repellent cream or spray',
  'Power bank',
  'Cash or card. Food and drink vendors will be on site.',
  'Good vibes and energy',
] as const

export const PLEASE_NOTE: readonly string[] = [
  'Do not bring laptops or expensive gadgets.',
  'Pets are allowed, but only domesticated and well-behaved ones. No aggressive pets.',
  'If it rains, there is a covered sit-out and canopy where everyone stays safely.',
  'Be of good behaviour and respect other campers.',
] as const

// ─── Imagery ────────────────────────────────────────────────────────────────

export const HERO_IMAGE = '/images/events/camp-night/hero.webp'
export const HERO_IMAGE_ALT =
  'September Camp Night: tents lit from within on a hillside at night above city lights, with a bonfire, string lights and friends gathered around it'

/** The circulating flyer, shown on the page so the page and the DM match. */
export const FLYER_IMAGE = '/images/events/camp-night/flyer-details.webp'
export const FLYER_IMAGE_ALT =
  'September Camp Night flyer listing the date, 6pm start, host DJ SARZ, the activity list and the three tent prices'
