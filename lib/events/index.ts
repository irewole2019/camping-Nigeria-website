/**
 * Registry of every Camping Nigeria event, past and upcoming.
 *
 * Deep detail for an event lives in its own module (schedule, FAQs, pricing,
 * image registry); this file holds only what the `/events` hub and the
 * homepage banner need to render a summary. Adding an event means adding a
 * module and one entry here — no page edits.
 *
 * Lifecycle is the `status` field on each entry, deliberately explicit rather
 * than derived from the end date: these pages are statically rendered, so a
 * `Date.now()` comparison bakes in at build time and goes stale between
 * deploys. See the note on EVENT_STATUS in ./base-camp-kids.
 */

import {
  EVENT_TITLE,
  EVENT_TAGLINE,
  EVENT_ANNOUNCEMENT,
  EVENT_STATUS,
  EVENT_PATH,
  EVENT_DATE_LABEL,
  EVENT_START_ISO,
  EVENT_END_ISO,
  VENUE_LABEL,
  VENUE_CITY,
  MIN_AGE,
  MAX_AGE,
  SEAT_CAP,
  EARLY_BIRD_PRICE,
  WALK_IN_PRICE,
  HERO_IMAGE,
  HERO_IMAGE_ALT,
  HOMEPAGE_BANNER_IMAGE,
  HOMEPAGE_BANNER_IMAGE_ALT,
  formatNaira,
  type EventStatus,
} from './base-camp-kids'

import {
  ADULTS_ATTENDED as KH_ADULTS,
  CHILDREN_ATTENDED as KH_CHILDREN,
  EVENT_DATE_LABEL as KH_DATE_LABEL,
  EVENT_END_ISO as KH_END_ISO,
  EVENT_PATH as KH_PATH,
  EVENT_START_ISO as KH_START_ISO,
  EVENT_STATUS as KH_STATUS,
  EVENT_TAGLINE as KH_TAGLINE,
  EVENT_TITLE as KH_TITLE,
  HERO_IMAGE as KH_HERO_IMAGE,
  HERO_IMAGE_ALT as KH_HERO_IMAGE_ALT,
  MAX_AGE as KH_MAX_AGE,
  MIN_AGE as KH_MIN_AGE,
  VENUE_CITY as KH_CITY,
  VENUE_LABEL as KH_VENUE_LABEL,
} from './kiddies-hike'

import {
  EVENT_DATE_LABEL as CN_DATE_LABEL,
  EVENT_END_ISO as CN_END_ISO,
  EVENT_FULL_TITLE as CN_TITLE,
  EVENT_HOST as CN_HOST,
  EVENT_PATH as CN_PATH,
  EVENT_START_ISO as CN_START_ISO,
  EVENT_STATUS as CN_STATUS,
  EVENT_TAGLINE as CN_TAGLINE,
  HERO_IMAGE as CN_HERO_IMAGE,
  HERO_IMAGE_ALT as CN_HERO_IMAGE_ALT,
  LOWEST_PRICE as CN_LOWEST_PRICE,
  MIN_AGE as CN_MIN_AGE,
  TENT_CAP as CN_TENT_CAP,
  VENUE_CITY as CN_CITY,
  VENUE_PUBLIC_LABEL as CN_VENUE_PUBLIC_LABEL,
  formatNaira as cnFormatNaira,
} from './camp-night'

import {
  BANNER_IMAGE as MS_BANNER_IMAGE,
  CARD_IMAGE as MS_CARD_IMAGE,
  COMMUNITY_NAME as MS_COMMUNITY,
  EVENT_DATE_LABEL as MS_DATE_LABEL,
  EVENT_END_ISO as MS_END_ISO,
  EVENT_FULL_TITLE as MS_TITLE,
  EVENT_PATH as MS_PATH,
  EVENT_START_ISO as MS_START_ISO,
  EVENT_STATUS as MS_STATUS,
  EVENT_TAGLINE as MS_TAGLINE,
  HERO_IMAGE_ALT as MS_IMAGE_ALT,
  LOWEST_PRICE as MS_LOWEST_PRICE,
  DAY_TICKET_ON_SALE as MS_DAY_TICKET_ON_SALE,
  MIN_AGE as MS_MIN_AGE,
  PARTNER_NAME as MS_PARTNER,
  TENT_CAP as MS_TENT_CAP,
  VENUE_CITY as MS_CITY,
  VENUE_PUBLIC_LABEL as MS_VENUE_PUBLIC_LABEL,
  formatNaira as msFormatNaira,
} from './mad-settings'

export type { EventStatus }

/** Icon key rather than a component — this module is imported by server components. */
export type EventStatIcon = 'calendar' | 'map-pin' | 'users'

export interface EventBannerContent {
  image: string
  imageAlt: string
  /** Pill over the image, e.g. 'Now Booking · 30 Seats'. */
  badge: string
  eyebrow: string
  headline: string
  announcement: string
  body: string
  stats: { icon: EventStatIcon; label: string; value: string }[]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export interface EventSummary {
  slug: string
  title: string
  tagline: string
  /** One or two sentences for the hub card. */
  blurb: string
  path: string
  status: EventStatus
  dateLabel: string
  /** ISO 8601 with timezone — used only for ordering. */
  startIso: string
  endIso: string
  venueLabel: string
  city: string
  ageRange: string
  image: string
  imageAlt: string
  /**
   * Homepage banner content. Read only while the event is upcoming, so a past
   * entry keeps its copy as the worked example for the next edition.
   */
  banner?: EventBannerContent
}

const BASE_CAMP_KIDS: EventSummary = {
  slug: 'base-camp-kids',
  title: EVENT_TITLE,
  tagline: EVENT_TAGLINE,
  blurb:
    'A camping-themed Children’s Day built like a scaled-down version of our school camps — real tents, house teams, craft stations, and outdoor games, with souvenirs every child took home.',
  path: EVENT_PATH,
  status: EVENT_STATUS,
  dateLabel: EVENT_DATE_LABEL,
  startIso: EVENT_START_ISO,
  endIso: EVENT_END_ISO,
  venueLabel: VENUE_LABEL,
  city: VENUE_CITY,
  ageRange: `Ages ${MIN_AGE}–${MAX_AGE}`,
  image: HERO_IMAGE,
  imageAlt: HERO_IMAGE_ALT,
  banner: {
    image: HOMEPAGE_BANNER_IMAGE,
    imageAlt: HOMEPAGE_BANNER_IMAGE_ALT,
    badge: `Now Booking · ${SEAT_CAP} Seats`,
    eyebrow: 'Children’s Day · Abuja · 2026',
    headline: `Base Camp Kids — a real camp adventure for kids ${MIN_AGE} to ${MAX_AGE}.`,
    announcement: EVENT_ANNOUNCEMENT,
    body: `Tents. House teams. Outdoor games. Souvenirs they keep. One Saturday only, ${SEAT_CAP} seats, in ${VENUE_CITY}. Save ${formatNaira(WALK_IN_PRICE - EARLY_BIRD_PRICE)} by registering online before they sell out.`,
    stats: [
      { icon: 'calendar', label: 'When', value: EVENT_DATE_LABEL.replace('Saturday, ', '') },
      { icon: 'map-pin', label: 'Where', value: VENUE_CITY },
      { icon: 'users', label: 'Seats', value: `${SEAT_CAP} only` },
    ],
    primaryCta: { label: 'Reserve a Seat', href: `${EVENT_PATH}#register` },
    secondaryCta: { label: 'See the Full Day', href: EVENT_PATH },
  },
}

/**
 * No `banner` — it has already run, so it can never drive the homepage
 * banner. Base Camp Kids keeps its banner copy as the worked example for the
 * next edition; one is enough.
 */
const KIDDIES_HIKE: EventSummary = {
  slug: 'kiddies-hike',
  title: KH_TITLE,
  tagline: KH_TAGLINE,
  blurb: `A potluck family hike above Abuja. ${KH_CHILDREN} children and ${KH_ADULTS} parents walked a trail through farmland, scrambled up bare rock, and shared a picnic everybody brought a dish to. Free to attend.`,
  path: KH_PATH,
  status: KH_STATUS,
  dateLabel: KH_DATE_LABEL,
  startIso: KH_START_ISO,
  endIso: KH_END_ISO,
  venueLabel: KH_VENUE_LABEL,
  city: KH_CITY,
  ageRange: `Ages ${KH_MIN_AGE}–${KH_MAX_AGE}`,
  image: KH_HERO_IMAGE,
  imageAlt: KH_HERO_IMAGE_ALT,
}

/**
 * The first upcoming event since both others went past, so this entry is what
 * switches the homepage `EventBanner` back on through
 * `FEATURED_UPCOMING_EVENT`. Drop the `banner` block, or flip EVENT_STATUS to
 * 'past' after the night, and the homepage goes quiet again on its own.
 *
 * `ageRange` reads "Adults 18+" rather than a span: Camp Night is an adults'
 * night out, unlike the two children's events. The minimum is confirmed by
 * the founders and enforced on the sign-up form — see MIN_AGE in ./camp-night.
 */
const CAMP_NIGHT: EventSummary = {
  slug: 'camp-night',
  title: CN_TITLE,
  tagline: CN_TAGLINE,
  blurb:
    'One night under canvas above the city. Tents pitched and mattresses in before you arrive, three DJs, a bonfire, karaoke and movies until it burns down.',
  path: CN_PATH,
  status: CN_STATUS,
  dateLabel: CN_DATE_LABEL,
  startIso: CN_START_ISO,
  endIso: CN_END_ISO,
  // Public label only — the hub is a stranger-facing page and the Camp Night
  // venue is disclosed to signees, not published. See ./camp-night.
  venueLabel: CN_VENUE_PUBLIC_LABEL,
  city: CN_CITY,
  ageRange: `Adults ${CN_MIN_AGE}+`,
  image: CN_HERO_IMAGE,
  imageAlt: CN_HERO_IMAGE_ALT,
  banner: {
    image: CN_HERO_IMAGE,
    imageAlt: CN_HERO_IMAGE_ALT,
    badge: `Now Booking · ${CN_TENT_CAP} Tents`,
    eyebrow: 'Camp Night · Abuja · 2026',
    headline: 'September Camp Night — a night outdoors, above the city.',
    announcement: `Hosted by ${CN_HOST}`,
    body: `Tents pitched and mattresses in before you arrive. Three DJs, a bonfire, karaoke, movies and games. ${CN_TENT_CAP} tents only, in ${CN_CITY}, from ${cnFormatNaira(CN_LOWEST_PRICE)}.`,
    stats: [
      { icon: 'calendar', label: 'When', value: CN_DATE_LABEL.replace('Saturday, ', '') },
      { icon: 'map-pin', label: 'Where', value: CN_CITY },
      { icon: 'users', label: 'Tents', value: `${CN_TENT_CAP} only` },
    ],
    primaryCta: { label: 'Save My Spot', href: `${CN_PATH}#signup` },
    secondaryCta: { label: 'See the Night', href: CN_PATH },
  },
}

/**
 * The only upcoming event, so it drives `FEATURED_UPCOMING_EVENT` and the
 * homepage `EventBanner`. Flip EVENT_STATUS in ./mad-settings to 'past' after
 * the night and the banner goes quiet on its own.
 *
 * Card and banner use top-anchored crops of the square cover (CARD_IMAGE,
 * BANNER_IMAGE) — a centred crop cuts the top of the title off.
 */
const MAD_SETTINGS: EventSummary = {
  slug: 'mad-settings',
  title: MS_TITLE,
  tagline: MS_TAGLINE,
  blurb:
    'A pop-up and bonfire party from midday, then a night under canvas for anyone who stays. Three DJs, games on the big screen, and Chapman and popcorn on us.',
  path: MS_PATH,
  status: MS_STATUS,
  dateLabel: MS_DATE_LABEL,
  startIso: MS_START_ISO,
  endIso: MS_END_ISO,
  // Public label only — same rule as Camp Night: the venue goes to signees.
  venueLabel: MS_VENUE_PUBLIC_LABEL,
  city: MS_CITY,
  ageRange: `Adults ${MS_MIN_AGE}+`,
  image: MS_CARD_IMAGE,
  imageAlt: MS_IMAGE_ALT,
  banner: {
    image: MS_BANNER_IMAGE,
    imageAlt: MS_IMAGE_ALT,
    badge: `Early Bird · From ${msFormatNaira(MS_LOWEST_PRICE)}`,
    eyebrow: 'MAD Settings · Abuja · 2026',
    headline: 'MAD Settings — pop-up, bonfire party and camping.',
    announcement: `${MS_COMMUNITY} × ${MS_PARTNER}`,
    body: `A day-into-night party with a sleepover for anyone who wants it. Three DJs, a bonfire, games, movies and karaoke, with free Chapman and popcorn. ${MS_DAY_TICKET_ON_SALE ? `Come for the day, or book one of ${MS_TENT_CAP} tents.` : `Day tickets are sold out: book one of ${MS_TENT_CAP} tents.`}`,
    stats: [
      { icon: 'calendar', label: 'When', value: MS_DATE_LABEL.replace('Saturday, ', '') },
      { icon: 'map-pin', label: 'Where', value: MS_CITY },
      { icon: 'users', label: 'Tents', value: `${MS_TENT_CAP} only` },
    ],
    primaryCta: { label: 'Save My Spot', href: `${MS_PATH}#signup` },
    secondaryCta: { label: 'See the Tickets', href: `${MS_PATH}#tickets` },
  },
}

export const EVENTS: EventSummary[] = [MAD_SETTINGS, CAMP_NIGHT, BASE_CAMP_KIDS, KIDDIES_HIKE]

/** Soonest first — the next thing to happen leads the hub. */
export const UPCOMING_EVENTS: EventSummary[] = EVENTS.filter(
  (e) => e.status === 'upcoming',
).sort((a, b) => a.startIso.localeCompare(b.startIso))

/** Most recent first — the freshest proof of delivery leads. */
export const PAST_EVENTS: EventSummary[] = EVENTS.filter((e) => e.status === 'past').sort((a, b) =>
  b.startIso.localeCompare(a.startIso),
)

/** Drives the homepage banner. Null whenever nothing is taking registrations. */
export const FEATURED_UPCOMING_EVENT: EventSummary | null = UPCOMING_EVENTS[0] ?? null
