/**
 * Source of truth for MAD Settings, 31 October 2026.
 * Read by the page render, the sign-up API, the confirmation email, the
 * confirmation page, the Sheet row, and the Event JSON-LD.
 *
 * Built on the September Camp Night framework (./camp-night) section for
 * section. Details came from the flyer (title, presenters, strapline, date,
 * start time, the three early-bird prices, the enquiries number) and from the
 * team (venue, the 9am sleepover close, the 80-tent cap, 18+, the on-site
 * facilities, and the provide/bring/note lists). Nothing here is inferred.
 *
 * **What differs from Camp Night:** a ticket without a tent. "Attendance only"
 * is a day/evening ticket, so the cap counts *tents* — sleepover tickets —
 * and attendance-only sign-ups are not capped at all. See TENT_CAP.
 */

export type EventStatus = 'upcoming' | 'past'

export const EVENT_TITLE = 'MAD Settings'
export const EVENT_FULL_TITLE = 'MAD Settings'
export const EVENT_TAGLINE = 'Pop-up, bonfire party and camping'
export const EVENT_STRAPLINE = 'Pop-Up · Bonfire Party · Camping'

/**
 * The flyer reads "African Dream Community x Tbee Sounds presents". African
 * Dream Community is a community under Camping Nigeria; Tbee Sounds is a
 * separate organisation, so here — unlike Camp Night — `×` is doing real
 * work (see decisions.md on the collaborator slot).
 */
export const COMMUNITY_NAME = 'African Dream Community'
export const PARTNER_NAME = 'Tbee Sounds'

// Names the city only — this is the public description, used for the meta
// description, the OG copy and the Event JSON-LD. The venue goes to signees.
//
// Two versions, picked below EVENT_STATUS: the upcoming copy's sign-up line
// and from-price would read as an open offer once the night has run. Written
// as a pair from the start so retiring the event is a one-line change — the
// lesson from Camp Night (decisions.md, "Retiring an event…").
const DESCRIPTION_UPCOMING =
  'A pop-up, bonfire party and camping night in Abuja, from 12 noon on Saturday 31 October 2026, with sleepovers until 9am the next morning. Adults 18 and over. Three DJs, bonfire, games, movies and karaoke, free Chapman and popcorn, and tents with mattresses for sleepover tickets. Venue shared with everyone who signs up. Early-bird tickets from ₦10,000.'
const DESCRIPTION_PAST =
  'A pop-up, bonfire party and camping night in Abuja that ran from 12 noon on Saturday 31 October 2026, with sleepovers until 9am the next morning. Adults 18 and over, three DJs, bonfire, games, movies and karaoke, free Chapman and popcorn, and tents with mattresses for the sleepover.'

// 31 October 2026, Saturday — Africa/Lagos is UTC+1, no DST.
//
// 12:00pm is the flyer's own time. The 9am close is the sleepover checkout,
// confirmed by the founders; attendance-only guests leave when the party winds
// down, which has no fixed time, so the page does not promise one.
export const EVENT_START_ISO = '2026-10-31T12:00:00+01:00'
export const EVENT_END_ISO = '2026-11-01T09:00:00+01:00'
export const EVENT_DATE_LABEL = 'Saturday, 31 October 2026'
export const EVENT_TIME_LABEL = '12:00 PM, with sleepovers until 9:00 AM the next morning'

/** Written out, not derived from the long labels — see EVENT_DATE_SHORT in ./camp-night. */
export const EVENT_DATE_SHORT = 'Sat 31 Oct'
export const EVENT_TIME_SHORT = '12 PM – 9 AM'

/** The hero's passport date stamp, written out — see DATE_STAMP in ./camp-night. */
export const DATE_STAMP = {
  weekday: 'Saturday',
  day: '31',
  monthYear: 'Oct 2026',
} as const

/**
 * Minimum age. An adult event, confirmed by the founders: on the page, in the
 * Event JSON-LD as `suggestedMinAge`, in PLEASE_NOTE, and behind a required
 * checkbox on the sign-up form that the API re-checks.
 */
export const MIN_AGE = 18

/**
 * **Payment is strictly offline**, exactly as for Camp Night: guests pay the
 * team first, and the sign-up is the record of someone who has already paid.
 * That is what lets the sheet's `Paid?` column default to `Yes`, behind a
 * required checkbox the API re-checks. See PAYMENT_IS_OFFLINE in ./camp-night.
 */
export const PAYMENT_IS_OFFLINE = true
export const PAYMENT_NOTE =
  'Sign-ups are for guests who have already paid. Pay the team first, then fill this in to get your code.'

/**
 * Enquiries line, from the flyer. The same number as Camp Night — it is the
 * events line, not the site's — and, as there, deliberately NOT in
 * `lib/constants.ts#CONTACT`.
 */
export const EVENT_PHONE_DISPLAY = '+234 704 053 8528'
export const EVENT_PHONE_TEL = 'tel:+2347040538528'

/**
 * **The exact venue is not public** — the same split as Camp Night.
 *
 * - `VENUE_PUBLIC_LABEL` (just the city) — anything a stranger can see: the
 *   event page, the `/events` hub card, OG cards, metadata, the Event JSON-LD.
 * - `VENUE_NAME` / `VENUE_LABEL` / `VENUE_MAP_URL` — the reveal. Confirmation
 *   email and `/events/mad-settings/registered` (with a code) only.
 */
export const VENUE_PUBLIC_LABEL = 'Abuja'

export const VENUE_NAME = 'Brooks Garden and Events Centre'
export const VENUE_CITY = 'Abuja'
export const VENUE_REGION = 'FCT'
export const VENUE_COUNTRY = 'NG'
export const VENUE_LABEL = 'Brooks Garden and Events Centre, Abuja'
export const VENUE_MAP_URL = 'https://maps.app.goo.gl/Mm2LJwSE5USiVgdU6?g_st=ic'

/**
 * **80 tents.** Only sleepover tickets take a tent, so only they count; the
 * attendance-only ticket is not capped. A couple tent holds two, so this is
 * not a headcount either, which is why the Event JSON-LD omits
 * `maximumAttendeeCapacity` (a people field).
 *
 * **Enforced in the Apps Script, not here** — the page is static and cannot
 * count. The script counts rows whose `Tent?` column is `Yes` and answers
 * `tents-full` at this number. This constant and the `TENT_CAP` in
 * `docs/mad-settings/apps-script.gs` must change together, AND a change to the
 * script only takes effect once it is re-pasted and redeployed as a new
 * version of the existing deployment (see state.md entry 54 for the trap).
 *
 * With `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` unset there is no count and
 * therefore no cap.
 */
export const TENT_CAP = 80

export const EVENT_PATH = '/events/mad-settings'
export const REGISTERED_PATH = '/events/mad-settings/registered'

/**
 * Lifecycle. Explicit flag rather than a date comparison — these pages are
 * statically rendered, so `Date.now()` bakes in at build time. Flip to 'past'
 * after the 31st: closes sign-ups, drops the schema Offer, and switches the
 * page, description and homepage banner to recap. Also demote the sitemap
 * entry to 0.4 / yearly.
 */
export const EVENT_STATUS: EventStatus = 'upcoming'

export function isSignupOpen(status: EventStatus): boolean {
  return status === 'upcoming'
}

export const SIGNUP_OPEN: boolean = isSignupOpen(EVENT_STATUS)

export const EVENT_DESCRIPTION = SIGNUP_OPEN ? DESCRIPTION_UPCOMING : DESCRIPTION_PAST

// ─── Tickets ────────────────────────────────────────────────────────────────

export type TicketId = 'attendance' | 'single' | 'couple'

export interface Ticket {
  id: TicketId
  name: string
  /** What the buyer is actually getting, in their words. */
  detail: string
  price: number
  /** Sheet and email label, e.g. "Sleepover couple (2 in a tent)". */
  label: string
  /** Whether this ticket takes one of the TENT_CAP tents. */
  usesTent: boolean
}

/**
 * The flyer's three prices, all marked as early-bird tickets. Nobody has given
 * a regular price or an early-bird deadline, so the page says "early bird"
 * and invents neither.
 */
export const PRICES_ARE_EARLY_BIRD = true

export const TICKETS: Ticket[] = [
  {
    id: 'attendance',
    name: 'Attendance only',
    detail: 'The pop-up, the bonfire party, the music and the games, without the sleepover.',
    price: 10_000,
    label: 'Attendance only (no tent)',
    usesTent: false,
  },
  {
    id: 'single',
    name: 'Sleepover single',
    detail: 'The whole day and night, then a tent and mattress to yourself until 9am.',
    price: 30_000,
    label: 'Sleepover single (1 person)',
    usesTent: true,
  },
  {
    id: 'couple',
    name: 'Sleepover couple',
    detail: 'A tent for two. Book once, bring your person, and stay the night.',
    price: 35_000,
    label: 'Sleepover couple (2 in a tent)',
    usesTent: true,
  },
]

export const TICKET_IDS: readonly TicketId[] = TICKETS.map((t) => t.id)

export function isValidTicketId(v: unknown): v is TicketId {
  return typeof v === 'string' && (TICKET_IDS as readonly string[]).includes(v)
}

export function getTicket(id: TicketId): Ticket {
  const ticket = TICKETS.find((t) => t.id === id)
  if (!ticket) throw new Error(`Unknown ticket: ${id}`)
  return ticket
}

/** Lowest price on the page, for "from ₦X" copy and the schema Offer. */
export const LOWEST_PRICE = Math.min(...TICKETS.map((t) => t.price))

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

// ─── Safety and security ────────────────────────────────────────────────────

/**
 * **Every line here must be something we actually do** — the rule from Camp
 * Night, which explains it in full. `SECURITY_POINTS` follows from how the
 * event is built. `ON_SITE` is the same five facilities confirmed for Brooks
 * Garden on 23/09/2026, which the founders confirmed again for 31 October on
 * 13/10/2026 — and, as before, nothing more specific than that.
 *
 * "A small, known group" from Camp Night is NOT reused: attendance-only
 * tickets are uncapped, so only the sleepover side is a capped group, and the
 * wording here says exactly that.
 */
export const SECURITY_INTRO =
  'Sleeping somewhere new should feel easy rather than risky, so here is exactly how the day and night are set up.'

export const SECURITY_POINTS: readonly { title: string; detail: string }[] = [
  {
    title: 'A closed guest list',
    detail:
      'No walk-ins and nothing sold at the gate. Everyone there signed up in advance with a name, phone number and email, and arrives with a code we check against that list.',
  },
  {
    title: 'A private venue',
    detail:
      'The address is not published anywhere. It goes out by email to people who have signed up, so the only people who know where to turn up are the people who are meant to be there.',
  },
  {
    title: 'A capped sleepover',
    detail: `${TENT_CAP} tents and no more. Everyone staying the night has one of them, booked in advance, so the camp does not grow after dark.`,
  },
  {
    title: 'Adults only',
    detail: `Everyone on site is ${MIN_AGE} or over. There is no mixed-age crowd to manage.`,
  },
  {
    title: 'Behaviour is not negotiable',
    detail:
      'Respecting other guests is a condition of being there. Anyone disruptive is asked to leave, and that applies for the whole night, not just while the music is on.',
  },
]

/** Icon key rather than a component — this module is imported by server components. */
export type OnSiteIcon = 'shield' | 'first-aid' | 'light' | 'toilet' | 'parking'

export const ON_SITE: readonly { icon: OnSiteIcon; title: string; detail: string }[] = [
  {
    icon: 'shield',
    title: 'Security personnel',
    detail: 'Security staff are on site for the event.',
  },
  {
    icon: 'first-aid',
    title: 'First aid',
    detail: 'First aid is available on site if anyone needs it.',
  },
  {
    icon: 'light',
    title: 'Lighting',
    detail: 'The grounds are lit, so you are not walking back to your tent in the dark.',
  },
  {
    icon: 'toilet',
    title: 'Toilets',
    detail: 'Toilets on site, no trek and no bush.',
  },
  {
    icon: 'parking',
    title: 'Parking',
    detail: 'Ample parking space if you are driving.',
  },
]

// ─── What the event includes ────────────────────────────────────────────────

/** Straight from the flyer. */
export const FLYER_HIGHLIGHTS: readonly string[] = [
  'Pop-up',
  'Bonfire party',
  'Camping',
  'Free Chapman and popcorn for everyone',
] as const

export const WE_PROVIDE: readonly string[] = [
  'Tent and mattress, for sleepover tickets',
  'Music, 3 DJs, bonfire, games, movies, karaoke',
  'Free popcorn and Chapman',
  'Mats, canopies, sit-out area',
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
  `This is an adults-only event. You must be ${MIN_AGE} or over to attend.`,
  'Do not bring laptops or expensive gadgets.',
  'Pets are allowed, but only domesticated and well-behaved ones. No aggressive pets.',
  'If it rains, there is a covered sit-out and canopy where everyone stays safely.',
  'Be of good behaviour and respect other guests.',
  'Join in with the games on the LED screen.',
] as const

// ─── Imagery ────────────────────────────────────────────────────────────────

/**
 * The team's website cover, a square graphic. `CARD_IMAGE` and `BANNER_IMAGE`
 * are top-anchored crops of it for the 16:10 hub card and the 4:3 homepage
 * banner: a centred crop of the square cuts "Mad" off the top of the title.
 */
export const HERO_IMAGE = '/images/events/mad-settings/hero.webp'
export const CARD_IMAGE = '/images/events/mad-settings/card.webp'
export const BANNER_IMAGE = '/images/events/mad-settings/banner.webp'
export const HERO_IMAGE_ALT =
  'MAD Settings cover: the title in bold black and green lettering on purple, with a small tent, gears and the strip "Pop-up, bonfire party, camping", above a man holding his head in surprise'

/** The circulating flyer, shown on the page so the page and the DM match. */
export const FLYER_IMAGE = '/images/events/mad-settings/flyer-details.webp'
export const FLYER_IMAGE_ALT =
  'MAD Settings flyer: African Dream Community and Tbee Sounds present a pop-up, bonfire party and camping night on 31 October in Abuja from 12pm, with early-bird tickets at ₦10,000 attendance only, ₦30,000 sleepover single and ₦35,000 sleepover couple'
