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

/**
 * African Dream Community is a community **under Camping Nigeria**, not a
 * third-party partner, and the founders asked for it on the hero. Credit it
 * as ours rather than as a co-host.
 */
export const COMMUNITY_NAME = 'African Dream Community'

// Names the city only — this is the public description, used for the meta
// description, the OG copy and the Event JSON-LD. The venue goes to signees.
export const EVENT_DESCRIPTION =
  'A one-night outdoor camp in Abuja, from 6pm on Saturday 26 September 2026 until 9am the next morning. Adults 18 and over. Tents and mattresses provided, three DJs hosted by DJ SARZ, bonfire, karaoke, movies and games. Venue shared with everyone who signs up. From ₦20,000.'

// 26 September 2026, Saturday — Africa/Lagos is UTC+1, no DST.
//
// 6pm is the flyer's own time ("SEPT 26TH 6PM"), which is already circulating.
// An earlier brief said 4pm; the flyer won because it is what campers have
// actually seen. The 9am close is confirmed by the founders — it is an
// overnight event that ends on the Sunday morning.
export const EVENT_START_ISO = '2026-09-26T18:00:00+01:00'
export const EVENT_END_ISO = '2026-09-27T09:00:00+01:00'
export const EVENT_DATE_LABEL = 'Saturday, 26 September 2026'
export const EVENT_TIME_LABEL = '6:00 PM until 9:00 AM the next morning'

/**
 * Compact forms for the hero spec strip, where the long labels wrap badly.
 *
 * `EVENT_DATE_SHORT` is a literal rather than something derived from
 * EVENT_DATE_LABEL. It used to be `EVENT_DATE_LABEL.replace('Saturday, ',
 * 'Sat 26 Sep')`, which replaced only the weekday and left the rest, so the
 * hero shipped reading "Sat 26 Sep26 September 2026". A short label is not a
 * transformation of a long one — write it out.
 */
export const EVENT_DATE_SHORT = 'Sat 26 Sep'
export const EVENT_TIME_SHORT = '6 PM – 9 AM'

/**
 * The three lines of the hero's passport date stamp, written out rather than
 * parsed from EVENT_DATE_LABEL.
 *
 * Base Camp Kids splits its label on ', ' and ' ' to get the same three parts,
 * which works only because "May" is already short enough for the stamp.
 * "September" is not — it would overflow the box — and a stamp that silently
 * depends on the month being short is a trap. Same lesson as EVENT_DATE_SHORT.
 */
export const DATE_STAMP = {
  weekday: 'Saturday',
  day: '26',
  monthYear: 'Sep 2026',
} as const

/**
 * Minimum age. An adult event: the bar is on the page, in the Event JSON-LD
 * as `suggestedMinAge`, in PLEASE_NOTE, and behind a required checkbox on the
 * sign-up form that the API re-checks.
 */
export const MIN_AGE = 18

/**
 * **Payment is strictly offline.** The form is not a checkout and takes no
 * money: campers pay the team first, by transfer or in person, and the
 * sign-up is the record of someone who has *already* paid.
 *
 * That is why the sheet's `Paid?` column defaults to `Yes` rather than `No`,
 * and why the form carries a required "I have already paid" checkbox — the
 * default is only defensible because the camper is asked to state it, and the
 * API re-checks it. Correct the cell by hand in the rare case someone signs
 * up without having paid.
 *
 * If this ever becomes a real checkout, this note, the checkbox, the sheet
 * default and the page copy all have to change together.
 */
export const PAYMENT_IS_OFFLINE = true
export const PAYMENT_NOTE =
  'Sign-ups are for campers who have already paid. Pay the team first, then fill this in to get your camp code.'

/**
 * Enquiries and bookings line **for this event only**.
 *
 * Deliberately NOT in `lib/constants.ts#CONTACT`: the founders were explicit
 * that this number has nothing to do with the main site. It belongs to Camp
 * Night and should disappear with it. Do not promote it, and do not let the
 * site-wide number replace it here.
 *
 * Given as local `07040538528`; rendered international to match the site's
 * existing convention (see decisions.md) and to stay dialable from abroad.
 */
export const EVENT_PHONE_DISPLAY = '+234 704 053 8528'
export const EVENT_PHONE_TEL = 'tel:+2347040538528'

/**
 * **The exact venue is not public.** It is disclosed only to people who have
 * signed up — in the confirmation email and on the confirmation page.
 *
 * So there are two labels, and which one you reach for depends on who is
 * reading:
 *
 * - `VENUE_PUBLIC_LABEL` (just the city) — anything a stranger can see: the
 *   event page, the `/events` hub card, OG cards, metadata, the Event JSON-LD.
 * - `VENUE_NAME` / `VENUE_LABEL` / `VENUE_MAP_URL` — the reveal. Confirmation
 *   email and `/events/camp-night/registered` only.
 *
 * Before putting any of the latter three on a page, check who can load that
 * page without a code. `tests/camp-night.test.ts` asserts the public label
 * does not carry the venue name, but a test cannot see where you rendered it.
 */
export const VENUE_PUBLIC_LABEL = 'Abuja'

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
 *
 * **Where the cap is actually enforced:** in the Apps Script, not here. The
 * sheet is the only place that knows how many sign-ups exist, so it counts
 * rows and returns `event-full` once it holds this many; the API then refuses
 * the sign-up and sends no email. This constant and the `TENT_CAP` in
 * `docs/camp-night/apps-script.gs` must be changed together — two copies,
 * because the script runs inside Google and cannot import from here.
 *
 * Corollary: while `GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL` is unset there is
 * no count and therefore no cap. Sign-up 51 will succeed.
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
  `This is an adults-only night. You must be ${MIN_AGE} or over to camp.`,
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
