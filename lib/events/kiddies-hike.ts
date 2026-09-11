/**
 * Source of truth for the Kiddies Hike and Fun Day, 21 August 2026.
 * Read by the page render, the Event JSON-LD, and the events registry.
 * Update here, not in component literals.
 *
 * Content transcribed from `docs/events/CampingNigeria_KiddiesHike_EventBreakdown_v3.docx`,
 * the approved copy deck. Two conventions carried over from that document:
 *
 * 1. **No em dashes in the copy.** The deck states this as a house preference
 *    for this page. Base Camp Kids uses them freely, so the two pages differ
 *    typographically on purpose. Don't "fix" it.
 * 2. **The venue is "Abuja" and nothing more specific.** The hill is not named
 *    and MagicLand is not mentioned, per an explicit decision in the deck. The
 *    flyer's 20-slot cap is also left off; only the real turnout is stated.
 */

export type EventStatus = 'upcoming' | 'past'

export const EVENT_TITLE = 'Kiddies Hike and Fun Day'
export const EVENT_TAGLINE = 'A potluck family hike, and a proper climb for small legs.'
export const EVENT_PARTNERS = 'Camping Nigeria × Discovery Haven × NAZ Concepts'
export const EVENT_EYEBROW = 'Kiddies Hike · Abuja · 2026'

export const EVENT_DESCRIPTION =
  'A potluck family hike in Abuja on 21 August 2026. Fifty children and thirty five parents climbed together, worked a trail hunt, and shared a picnic. Free to attend.'

export const EVENT_HERO_PARAGRAPH =
  'Fifty children and thirty five parents walked out of Abuja and up a rock. They carried trail hunt booklets, ticked off what they found on the way, got their faces painted at the top with the whole city behind them, played games on the summit, painted their own canvas bags, and came back down to a picnic everybody had brought a dish to. Free to attend. Here is how the day was built.'

// 21 August 2026, Friday — Africa/Lagos is UTC+1, no DST
export const EVENT_START_ISO = '2026-08-21T09:00:00+01:00'
export const EVENT_END_ISO = '2026-08-21T16:30:00+01:00'
export const EVENT_DATE_LABEL = 'Friday, 21 August 2026'
export const EVENT_TIME_LABEL = '9:00 AM to 4:30 PM'

export const VENUE_CITY = 'Abuja'
export const VENUE_REGION = 'FCT'
export const VENUE_COUNTRY = 'NG'
/** Deliberately unspecific — see the header note. */
export const VENUE_LABEL = 'Abuja'

export const MIN_AGE = 4
export const MAX_AGE = 12

/** Real attendance, not a cap. The flyer's 20-slot limit is not published. */
export const CHILDREN_ATTENDED = 50
export const ADULTS_ATTENDED = 35
export const MARSHALS = 10

export const IS_FREE = true

export const EVENT_PATH = '/events/kiddies-hike'

/**
 * Lifecycle state. Explicit flag rather than a `Date.now() > EVENT_END_ISO`
 * comparison, for the same reason as Base Camp Kids: these pages are
 * statically rendered, so a runtime date check bakes in at build time and
 * goes stale between deploys.
 *
 * This edition has already run, so the page is a recap from the start.
 */
export const EVENT_STATUS: EventStatus = 'past'

// ─── Imagery ────────────────────────────────────────────────────────────────

/**
 * Real photography from the day, converted from the originals in the Kiddies
 * Adventure folder. Sources were 26 HEIC stills (3024×4032 tile grids) and 6
 * QuickTime clips; the nine published frames are the set the deck selected.
 *
 * Two of the nine are still frames pulled from video, not photos —
 * `IMG_9786 (1).mov` (the trailhead group, also the hero and OG image) and
 * `IMG_9806.mov` (the booklet close-up). The deck lists both as "(still)".
 *
 * Converted with ffmpeg. HEIC needs two passes: ffmpeg assembles the tile
 * grid through an internal complex filtergraph, so a simple `-vf` cannot
 * attach to the decode. Decode to full-size PNG first, then scale and encode
 * WebP from that. Long edge capped at 1400px (hero 1744px), quality 82.
 *
 * PHOTO CONSENT: the deck flags that several children are individually
 * identifiable in close-up, and that each face must be checked against the
 * consent list before publishing. That check has not been done in code and
 * cannot be — it is a human step before deploy.
 */
export const HERO_IMAGE = '/images/events/kiddies-hike/hero.webp'
export const HERO_IMAGE_ALT =
  'The full group of children, parents and marshals gathered at the trailhead holding Little Explorers Trail Hunt booklets, with the rock hill rising behind them'

/** True once real event photography has replaced the placeholders. */
export const HAS_EVENT_PHOTOGRAPHY = true

export interface GalleryImage {
  src: string
  alt: string
  /** Original filename, so a frame can always be traced back to its source. */
  sourceFile: string
  /** Capture time from the original's embedded timestamp. */
  capturedAt: string
}

/**
 * In publication order, per the deck. Coverage stops at 11:30 — there are no
 * photographs of the descent, the potluck, the open games or the bag
 * painting. The deck flags the missing bag-painting shot as the one worth
 * capturing at the next edition.
 */
export const GALLERY: GalleryImage[] = [
  {
    src: '/images/events/kiddies-hike/gallery-01-trailhead-group.webp',
    alt: 'The full group of children and parents gathered at the trailhead before setting off, holding trail hunt booklets, with the rock hill behind them',
    sourceFile: 'IMG_9786 (1).mov',
    capturedAt: '9:42',
  },
  {
    src: '/images/events/kiddies-hike/gallery-02-trail-hunt-booklet.webp',
    alt: 'A child holding up a Little Explorers Trail Hunt booklet with the clue card readable, the rock face and Abuja behind',
    sourceFile: 'IMG_9806.mov',
    capturedAt: '10:03',
  },
  {
    src: '/images/events/kiddies-hike/gallery-03-farmland-booklets.webp',
    alt: 'Children in team lanyards holding their trail hunt booklets on the path through maize farmland, a tall tree and a marshal in hi-vis behind them',
    sourceFile: 'IMG_5837.heic',
    capturedAt: '10:02',
  },
  {
    src: '/images/events/kiddies-hike/gallery-04-the-climb.webp',
    alt: 'The line of hikers working its way up a grassy path toward the rock summit, with Abuja spread out in the valley below',
    sourceFile: 'IMG_5870.heic',
    capturedAt: '10:20',
  },
  {
    src: '/images/events/kiddies-hike/gallery-05-child-on-the-rock.webp',
    alt: 'A young child standing alone on bare rock holding her trail hunt booklet, the green hill rising behind her',
    sourceFile: 'IMG_5852.heic',
    capturedAt: '10:09',
  },
  {
    src: '/images/events/kiddies-hike/gallery-06-face-painting-summit.webp',
    alt: 'A face painter kneeling to paint a child’s face on the summit rock, with the city visible far below',
    sourceFile: 'IMG_5883.heic',
    capturedAt: '10:34',
  },
  {
    src: '/images/events/kiddies-hike/gallery-07-bee-face-paint.webp',
    alt: 'Close-up of a child in a wide-brimmed hat with a bee painted on her cheek',
    sourceFile: 'IMG_5915.heic',
    capturedAt: '10:46',
  },
  {
    src: '/images/events/kiddies-hike/gallery-08-summit-games.webp',
    alt: 'A team leader with her arms around two laughing children on the summit rock, maize fields behind them',
    sourceFile: 'IMG_5934.heic',
    capturedAt: '11:04',
  },
  {
    src: '/images/events/kiddies-hike/gallery-09-games-marshals.webp',
    alt: 'Children and parents gathered on the summit rock with marshals in hi-vis vests among them',
    sourceFile: 'IMG_5962.heic',
    capturedAt: '11:24',
  },
]

// ─── Positioning ────────────────────────────────────────────────────────────

export const POSITIONING_TITLE = 'Not a Stroll. A Climb.'
export const POSITIONING_SUBHEAD = 'A real trail, sized for small legs.'
export const POSITIONING_BODY =
  'Most children’s outings happen on flat ground with a bouncing castle in the corner. This one went uphill. Children aged four to twelve walked a trail through farmland, scrambled up bare rock, and stood at the top looking down at Abuja, which is not a view most of them had ever had of their own city. They were not just walking. Every child carried a Little Explorers Trail Hunt booklet and worked through it as they climbed, so the route came with things to find and name. Parents did the whole climb alongside them. Nobody was dropped off and collected.'
/** Printed on the trail hunt booklet, so it is already the event's own line. */
export const POSITIONING_STRAPLINE = 'Play. Connect. Explore.'

// ─── Souvenirs ──────────────────────────────────────────────────────────────

export interface SouvenirEntry {
  name: string
  description: string
}

/**
 * Three cards, no images — unlike Base Camp Kids, which has generated art for
 * each. These are real objects photographed on the day; the cards stay
 * text-only until those photos are processed.
 *
 * NOTE on the third card: the deck flags `[CONFIRM THEY KEPT THE BAGS]` as
 * unresolved. The copy below therefore describes what the children made
 * without claiming they took it home. Add "Theirs to keep." once confirmed —
 * and the matching FAQ answer below.
 */
export const SOUVENIRS: SouvenirEntry[] = [
  {
    name: 'Little Explorers Trail Hunt booklet',
    description:
      'The printed clue booklet each child carried up the trail, worked through in their own hand as they climbed. Play, Connect, Explore, on the cover. Theirs to keep.',
  },
  {
    name: 'Their explorer name tag',
    description:
      'Every child wore a lanyard and team card for the day, colour-coded to their group. It doubled as their sign-out check at the end, and it went home with them.',
  },
  {
    name: 'The bag they painted',
    description:
      'Not a goodie bag handed over full. A plain bag and a set of paints, and whatever each child made of it. No two were alike.',
  },
]

// ─── Schedule ───────────────────────────────────────────────────────────────

/**
 * How the times were established. Not rendered — kept so the provenance of
 * each row survives in the repo. 'photo' rows come from the capture timestamp
 * embedded in the photos from the day, which is the only clock being trusted.
 */
export type ScheduleSource = 'photo' | 'flyer' | 'confirmed'

export interface ScheduleEntry {
  time: string
  block: string
  source: ScheduleSource
}

export const SCHEDULE: ScheduleEntry[] = [
  { time: '9:00 AM', source: 'flyer', block: 'Arrival and check-in. Consent forms confirmed, explorer name tags and team lanyards issued, trail hunt booklets handed out' },
  { time: '9:35 AM', source: 'photo', block: 'The group assembles at the foot of the hill' },
  { time: '9:36 AM', source: 'photo', block: 'Warm-up. The whole group stretches together before setting off' },
  { time: '9:42 AM', source: 'photo', block: 'Group photo at the trailhead, booklets in hand' },
  { time: '9:47 AM', source: 'photo', block: 'The hike begins. Marshals in hi-vis at the front and the back of the line' },
  { time: '10:00 AM', source: 'photo', block: 'Little Explorers Trail Hunt underway. Children work through their clue cards as they walk, naming what they find along the route' },
  { time: '10:20 AM', source: 'photo', block: 'The climb. The group works its way up the rock face together, adults hand in hand with the smaller children' },
  { time: '10:34 AM', source: 'photo', block: 'Summit. Abuja spread out below, and the face painting station opens on the rock' },
  { time: '10:45 AM', source: 'photo', block: 'Face painting, family photos, and rest on picnic mats at the top' },
  { time: '11:04 AM', source: 'photo', block: 'Games and dancing on the summit, led by the team' },
  { time: '11:25 AM', source: 'photo', block: 'Team relay games on the rock before heading down' },
  { time: 'Afternoon', source: 'confirmed', block: 'Descent, the potluck picnic where every family shared the dish they brought, bag painting, and open games' },
  { time: '4:30 PM', source: 'flyer', block: 'Close and sign-out. Children released only to the adult on their tag' },
]

// ─── Safety ─────────────────────────────────────────────────────────────────

export interface SafetyEntry {
  label: string
  value: string
  hint: string
}

/**
 * Ordered by strength. 1 to 5 leads because it is tighter than the 1 to 8
 * published on Base Camp Kids and tighter than most school trips run.
 */
export const SAFETY: SafetyEntry[] = [
  { label: 'Marshal to child', value: '1 to 5', hint: `${MARSHALS} marshals for ${CHILDREN_ATTENDED} children, all day` },
  { label: 'Adults on the trail', value: `${MARSHALS + ADULTS_ATTENDED} to ${CHILDREN_ATTENDED}`, hint: `${ADULTS_ATTENDED} parents and guardians walked the whole route as well` },
  { label: 'On site', value: 'First aider', hint: 'present for the full day' },
]

export const SAFETY_DETAILS: readonly string[] = [
  'Marshals in hi-vis at the front and the back of the line. Nobody walked ahead of the lead marshal or behind the sweep.',
  'Every child wore a name tag and team lanyard all day, colour-coded by group.',
  'Children were released only to the adult named on their tag.',
  'A signed consent form for every child, collected at registration.',
] as const

export const SAFETY_CREDENTIAL =
  'Camping Nigeria has delivered programmes at Vivian Fowler, Regent Primary, Springhall Secondary, and Doveland. Same team, same standards, scaled for a family day out.'

export const TRUST_LINE =
  'Run by Camping Nigeria, the team behind programmes at Vivian Fowler, Regent Primary and Springhall Secondary.'

// ─── Cost ───────────────────────────────────────────────────────────────────

export const COST_INCLUSIONS: readonly string[] = [
  'No registration fee and no charge on the day',
  'Trail hunt booklet, name tag, face painting and bag painting all included',
  'Lunch was a potluck. Every family brought a dish to share, so the table was built by everybody',
] as const

export const COST_NOTE =
  'We ran the 21 August edition free so that cost was never the reason a child stayed home. Registration was still required, because the trail only works with a number we can count.'

export const COST_FORWARD_LOOKING =
  'Pricing for the next edition has not been set. If you would like us to run a day like this for your school or community group, tell us what you have in mind.'

// ─── FAQs ───────────────────────────────────────────────────────────────────

export interface FaqEntry {
  question: string
  answer: string
}

export const FAQS: FaqEntry[] = [
  {
    question: 'Was it a hard climb for a four year old?',
    answer:
      'It is a real climb, not a flat walk, and the youngest children did it hand in hand with an adult. The group moved at the pace of the slowest walker, with a marshal sweeping the back so nobody was ever left behind.',
  },
  {
    question: 'Did parents walk with their children?',
    answer:
      'Yes. This is a family hike, not a drop-off. Thirty five parents and guardians walked the whole route with the children.',
  },
  {
    question: 'How were the children supervised?',
    answer:
      'Marshals in hi-vis led the front and swept the back of the line for the entire route. Every child wore a name tag and a team lanyard, colour-coded to their group.',
  },
  {
    question: 'What if a child got tired?',
    answer:
      'The group rested together at the top, on mats, for the best part of an hour. Nobody was pushed to keep up.',
  },
  {
    question: 'What did the children actually do up there?',
    answer:
      'They worked through a Little Explorers Trail Hunt booklet on the way up, finding and naming things along the route. At the summit there was face painting, family photos, and team games on the rock. In the afternoon they painted their own bags.',
  },
  {
    question: 'What was the food?',
    answer:
      'A potluck picnic. Every family brought a dish or a snack to share, which is half the point of the day. Children ate together rather than out of separate lunchboxes.',
  },
  {
    question: 'What about allergies?',
    answer:
      'Because the meal was a potluck, we asked families to flag allergies at registration and to tell us what was in the dish they brought. If your child has an allergy, tell us in advance and we plan around it.',
  },
  {
    question: 'Was there a first aider on site?',
    answer: 'Yes, for the full day, with a stocked kit that travelled with the group.',
  },
  {
    question: 'Did you need a consent form?',
    answer: 'Yes. A signed consent form for every child, collected before the day.',
  },
  {
    question: 'Will my child appear on social media?',
    answer:
      'Photo consent was confirmed at registration. If a parent declined, that child was kept out of anything we published. You can ask us to remove a photo at any time.',
  },
  {
    // The deck's answer also names the painted bag, flagged
    // [CONFIRM THEY KEPT THE BAGS]. Add it back once confirmed.
    question: 'What did my child take home?',
    answer: 'Their trail hunt booklet and their explorer name tag.',
  },
  {
    question: 'When is the next one?',
    answer: 'Not dated yet. Tell us you want in and we will let you know first.',
  },
]
