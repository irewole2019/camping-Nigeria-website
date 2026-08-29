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

export const EVENTS: EventSummary[] = [BASE_CAMP_KIDS]

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
