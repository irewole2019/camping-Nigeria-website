/**
 * Source of truth for `/community` — the African Dream Community page, which
 * replaced `/individuals` on 14/10/2026.
 *
 * Copy comes verbatim (bar house punctuation) from the team's
 * `African_Dream_Community_Page.md`. Two things in that document were
 * deliberately not carried over:
 *
 * - "join our community channel" was flagged in the document as a
 *   placeholder. The founders chose Instagram as the join route, so every
 *   "Join the Community" CTA points at `COMMUNITY_LINKS.instagram`.
 * - The "Facebook: African Dream Community" line has no URL, so it renders as
 *   text, not a guessed link.
 */

/** Instagram, TikTok and X all use this handle (per the page document). */
export const COMMUNITY_HANDLE = '@africandream_ng'

export const COMMUNITY_NAME = 'The African Dream Community'
export const COMMUNITY_STRAPLINE = 'Camp. Connect. Celebrate.'

/**
 * The page document lists this number as the community's WhatsApp. It is the
 * same line as the Camp Night and MAD Settings enquiries number, and — like
 * those — deliberately NOT `lib/constants.ts#CONTACT`, which is Camping
 * Nigeria's own line. The document confirms it is on WhatsApp, which is what
 * makes a number-derived `wa.me` link safe here (the event pages publish it
 * as `tel:` only because nobody had confirmed that yet).
 */
export const COMMUNITY_WHATSAPP_DISPLAY = '0704 053 8528'
export const COMMUNITY_WHATSAPP_URL = 'https://wa.me/2347040538528'

export const COMMUNITY_LINKS = {
  instagram: 'https://www.instagram.com/africandream_ng/',
  tiktok: 'https://www.tiktok.com/@africandream_ng',
  x: 'https://x.com/africandream_ng',
} as const

/** No URL was given for Facebook — rendered as a name only. */
export const COMMUNITY_FACEBOOK_NAME = 'African Dream Community'

export const JOIN_URL = COMMUNITY_LINKS.instagram

export const HERO_INTRO =
  'The African Dream Community is a home for people who want more from their weekends. It’s a place to meet new people, make real friends and step outside the city together. Joining the community costs nothing. All you need is curiosity and a willingness to say yes to something new.'

export const WHO_WE_ARE: readonly string[] = [
  'The African Dream Community started with a simple belief: there is unity in shared experience. When strangers sit around the same fire, share a meal and swap stories, something changes. They leave as friends.',
  'We’re a community first. Members connect, socialise and build friendships all year round, online and in person. Throughout the year, we also host ticketed outdoor and tourism experiences that bring the community together in some of the most beautiful places in and around Abuja.',
]

export const WHAT_WE_DO: readonly { title: string; body: string }[] = [
  {
    title: 'Connect people',
    body: 'A welcoming space to meet new people, network and build lasting friendships. Joining costs nothing.',
  },
  {
    title: 'Camp Nights',
    body: 'Ticketed evenings under the stars with music, a bonfire, karaoke, movies and games.',
  },
  {
    title: 'Weekend Camping Trips',
    body: 'Paid getaways a short drive from Abuja, with tents, bedding and meals arranged for you.',
  },
  {
    title: 'Hike to Camp',
    body: 'For members who want more adventure: we hike in together and spend the night outdoors.',
  },
  {
    title: 'Wellness Retreats',
    body: 'Weekends built around rest, yoga and reconnecting with yourself.',
  },
  {
    title: 'City Tours and Trips Beyond Abuja',
    body: 'Rediscover Abuja’s landmarks, galleries and museums, or travel further with the community to new destinations.',
  },
]

export const EQUIPPED_BY: readonly string[] = [
  'Every African Dream Community event is equipped by Camping Nigeria, Nigeria’s end-to-end outdoor experience provider. That means good-quality tents, bedding and gear at every camp, and a team that knows how to run outdoor experiences properly.',
  'The community brings the people. Camping Nigeria makes sure you’re well equipped.',
]

export const WHY_PEOPLE_RETURN: readonly { title: string; body: string }[] = [
  {
    title: 'Come as you are',
    body: 'Solo, couple or group, first timer or regular. Nobody is an outsider here.',
  },
  {
    title: 'Real connection',
    body: 'People arrive as strangers and leave with friends.',
  },
  {
    title: 'Well equipped',
    body: 'Event gear and setup are handled by Camping Nigeria, so you can just enjoy the experience.',
  },
  {
    title: 'Something new every time',
    body: 'From camp nights to hikes to city tours, there’s always another way to explore.',
  },
]

export const ATTEND_STEPS: readonly string[] = [
  'Pick an upcoming event from our pages.',
  'Send us a DM or a WhatsApp message to book.',
  'Secure your place with payment. Spaces are limited.',
  'Show up and enjoy it.',
]

// ─── Imagery ────────────────────────────────────────────────────────────────

export const HERO_VIDEO = '/videos/community-hero.mp4'
export const HERO_VIDEO_WEBM = '/videos/community-hero.webm'
/**
 * The clip's first frame, so the still shown before playback matches what
 * plays. The source opened on 0.7s of black and cut between shots at its end;
 * the encoded file drops the black and cross-fades its last 0.5s into its
 * first, so the loop has no black frame and no seam.
 */
export const HERO_POSTER = '/images/community/hero-poster.webp'

export interface CommunityPhoto {
  src: string
  alt: string
}

const photo = (name: string, alt: string): CommunityPhoto => ({
  src: `/images/community/${name}.webp`,
  alt,
})

/**
 * The team's community photos, placed where the page document's photo
 * placeholders asked. Which event each was taken at is not recorded, so the
 * alt text describes the scene and claims no event.
 */
export const PHOTOS = {
  whoWeAre: photo(
    '081a0122',
    'Community members sitting in a wide circle of chairs on the grass, with colourful tents pitched behind them',
  ),
  whatWeDo: photo(
    'img_9491',
    'Friends laughing together around a fire at night, lit by the flames',
  ),
  equipped: photo(
    '081a3634',
    'A row of pitched dome tents in green, orange and blue on a lawn in late-afternoon light',
  ),
  group: photo(
    'img_1828',
    'A large group of community members gathered on a lawn beside thatched huts, joining in a group activity',
  ),
} as const

/**
 * The "life in the community" mosaic — the rest of the set. `ddc-191` is
 * left out: it is almost entirely black at web size.
 */
export const MOMENTS: readonly CommunityPhoto[] = [
  photo('081a3769', 'A man in a black jacket laughing with friends beside the tents'),
  photo('081a3643', 'A woman sitting in the doorway of a green tent'),
  photo('ddc-39', 'Two people sitting on a mat beside their tent, talking'),
  photo('081a3863', 'Three friends laughing and pointing during a group session outdoors'),
  photo('ddc-81', 'Members stretching in an outdoor workout, tents pitched behind them'),
  photo('081a3819', 'A woman resting in the doorway of a blue tent'),
  photo('ddc-130', 'A member smiling and pointing at the African Dream Community logo backdrop'),
  photo('img_1821', 'Community members chatting in small groups on a lawn by thatched huts'),
  photo('081a3617', 'Members seated on wooden chairs in a circle under the trees'),
  photo('ddc-85', 'Members dancing in a group workout wearing wireless headphones'),
  photo('081a3902', 'Green and blue tents pitched under tall palm trees'),
  photo('ddc-184', 'A silent disco at night, dancers in glowing headphones lit red'),
  photo('img_1829', 'Members on the lawn following a leader in a group activity'),
]

// ─── Past events gallery ────────────────────────────────────────────────────

export interface CommunityEventSlot {
  /** Stable key; also the dialog id. */
  id: string
  title: string
  /** Null for a placeholder slot. */
  dateLabel: string | null
  cover: CommunityPhoto | null
  /** Empty means "gallery coming soon" — the slot still opens, honestly. */
  photos: readonly CommunityPhoto[]
  /** The event's own page, when it has one. */
  href: string | null
}

/**
 * Three slots of events the community has hosted. September Camp Night is
 * the first; the other two are placeholders until there is a named event and
 * photos to put in them.
 *
 * September Camp Night's `photos` is empty on purpose: the founders have not
 * yet said which photos are from that night, and the alt text and gallery
 * would be making that claim. Add them here when they do.
 */
export const EVENT_SLOTS: readonly CommunityEventSlot[] = [
  {
    id: 'september-camp-night',
    title: 'September Camp Night',
    dateLabel: '26 September 2026',
    cover: {
      src: '/images/events/camp-night/hero.webp',
      alt: 'September Camp Night: tents lit from within on a hillside at night, with a bonfire and friends gathered around it',
    },
    photos: [],
    href: '/events/camp-night',
  },
  {
    id: 'coming-soon-1',
    title: 'Next gallery',
    dateLabel: null,
    cover: null,
    photos: [],
    href: null,
  },
  {
    id: 'coming-soon-2',
    title: 'Next gallery',
    dateLabel: null,
    cover: null,
    photos: [],
    href: null,
  },
]
