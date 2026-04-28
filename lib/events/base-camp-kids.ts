/**
 * Source of truth for the Base Camp Kids 2026 event.
 * Read by the page render, the registration API, the email templates,
 * and the Event JSON-LD. Update here, not in component literals.
 */

export const EVENT_TITLE = 'Base Camp Kids'
export const EVENT_TAGLINE = "A Camping-Themed Children's Day Adventure"
export const EVENT_DESCRIPTION =
  "A one-day camping-themed Children's Day camp in Abuja for kids ages 4 to 12. Tents, house teams, creative stations, outdoor games, kid-friendly food, and keepsake souvenirs."

// 30 May 2026, Saturday — Africa/Lagos is UTC+1, no DST
export const EVENT_START_ISO = '2026-05-30T09:00:00+01:00'
export const EVENT_END_ISO = '2026-05-30T17:00:00+01:00'
export const EVENT_DATE_LABEL = 'Saturday, 30 May 2026'
export const EVENT_TIME_LABEL = '9:00 AM – 5:00 PM'

export const VENUE_CITY = 'Abuja'
export const VENUE_REGION = 'FCT'
export const VENUE_COUNTRY = 'NG'
export const VENUE_LABEL = 'Abuja — exact location shared with confirmed registrants'

export const SEAT_CAP = 30
export const EARLY_BIRD_PRICE = 100_000
export const WALK_IN_PRICE = 150_000
export const SIBLING_DISCOUNT_RATE = 0.1
export const MIN_AGE = 4
export const MAX_AGE = 12
export const MAX_CHILDREN_PER_REGISTRATION = 6

export const EVENT_PATH = '/events/base-camp-kids'
export const REGISTERED_PATH = '/events/base-camp-kids/registered'

/**
 * Image registry — generated via openai/gpt-image-2 on inference.sh.
 * Source prompts live in scripts/generate-base-camp-kids-images.mjs;
 * re-run with `node scripts/generate-base-camp-kids-images.mjs --only=<name>`
 * to iterate on any single asset. Swap the paths below to roll in real
 * event photography after 30 May 2026.
 */
export const HERO_IMAGE = '/images/events/base-camp-kids/hero-v2.webp'
export const HERO_IMAGE_ALT =
  'Children running between forest-green tents at a Children\'s Day camp in the Abuja savanna at golden hour'

export const POSITIONING_IMAGE = '/images/events/base-camp-kids/positioning.webp'
export const POSITIONING_IMAGE_ALT =
  'Top-down view of hands tie-dyeing an indigo and gold Adire bandana on a wooden trestle table'

export const HOMEPAGE_BANNER_IMAGE = '/images/events/base-camp-kids/homepage-banner-v2.webp'
export const HOMEPAGE_BANNER_IMAGE_ALT =
  'Forest-green camp tents with cream and gold flags beside a wooden welcome arch and mocktail bar in the Abuja savanna'

/**
 * Early-bird total for N children. First child full price, each additional
 * child gets 10% off (per user spec — applied to every sibling, not just #2).
 *
 * 1 → ₦100,000
 * 2 → ₦190,000
 * 3 → ₦280,000
 * 4 → ₦370,000
 */
export function computeRegistrationTotal(numChildren: number): number {
  if (!Number.isInteger(numChildren) || numChildren <= 0) return 0
  const additional = numChildren - 1
  const additionalPrice = Math.round(EARLY_BIRD_PRICE * (1 - SIBLING_DISCOUNT_RATE))
  return EARLY_BIRD_PRICE + additional * additionalPrice
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}

export interface ScheduleEntry {
  time: string
  block: string
}

export const SCHEDULE: ScheduleEntry[] = [
  { time: '9:00 AM',         block: 'Gates open — early drop-off welcomed' },
  { time: '10:00 AM',        block: 'Arrival, check-in, wristbands, photo consent confirmed, house assignment' },
  { time: '10:30 AM',        block: 'Opening circle, camp rules, house chants and slogan making' },
  { time: '10:45 AM',        block: 'Rotation 1 — tent pitch race and camp skills' },
  { time: '11:45 AM',        block: 'Rest in tents — small chops and mocktail bar' },
  { time: '12:45 PM',        block: 'Rotation 2 — Ngozi Akande arts and craft circuit' },
  { time: '1:45 PM',         block: 'Main meal service by house' },
  { time: '2:30 PM',         block: 'Rotation 3 — outdoor games (relay races and tug of war)' },
  { time: '3:30 PM',         block: 'Campfire circle storytelling and house awards' },
  { time: '3:40 PM',         block: 'T-shirt reveal, certificate ceremony, group photo' },
  { time: '3:55 PM',         block: 'Closing circle and goodie bags' },
  { time: '4:00 – 5:00 PM',  block: 'Parent pickup window' },
]

export interface FaqEntry {
  question: string
  answer: string
}

export const FAQS: FaqEntry[] = [
  {
    question: 'Is the event supervised the whole time?',
    answer:
      'Yes. Every house group has a dedicated house leader who stays with the group all day. Our staff-to-child ratios are 1 to 8 for under 8s and 1 to 10 for 8 to 12.',
  },
  {
    question: 'What happens if my child has an allergy?',
    answer:
      'Tell us at registration. We compile a full allergy list and share it with our food team before service. Nut-free trail mix and alternative snacks are always available.',
  },
  {
    question: 'What if it rains?',
    answer:
      'We have a covered fallback plan. If heavy rain is forecast 24 hours before, we move to the backup venue and notify all parents by WhatsApp. If rain comes on the day, we move activities under our tents and keep the meal and quiet zones operating.',
  },
  {
    question: 'Can my child come with friends from school?',
    answer:
      'Absolutely. Register them both and note that they would like to be in the same house in the registration notes field.',
  },
  {
    question: 'Who hands my child over at pickup?',
    answer:
      "Only an adult with a matching pickup code (the other half of your child's wristband). If someone different will collect your child, message us in advance so we can update the record.",
  },
  {
    question: 'Is there a first aider on site?',
    answer:
      'Yes. A trained first aider is on site the entire time in a clearly marked vest. We maintain a stocked first aid kit and a clear emergency protocol.',
  },
  {
    question: 'What food will be served?',
    answer:
      'A small chops spread (samosa, spring roll, puff puff, meat pie, and more) plus a main meal of jollof rice, grilled chicken, and plantain. A mocktail bar operates all day. Vegetarian and allergy-safe options are prepared when flagged.',
  },
  {
    question: 'Can parents stay?',
    answer:
      'You are welcome in the parent viewing area. Activity stations themselves are child-only, which is what keeps the camp feel intact and lets children fully immerse.',
  },
  {
    question: 'Will my child appear on social media?',
    answer:
      'Only if you tick yes on the consent form. Children whose parents tick no will wear a visible blue wristband, and our photographer will not include them in posted content.',
  },
  {
    question: 'What does my child take home?',
    answer:
      'A camping-themed T-shirt that they decorate, a Junior Camper certificate, a mini nature journal, an Adire bandana they tie-dye themselves, a goodie bag, and in many cases, new friends.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Full refund if cancelled more than 7 days out. 50% refund if cancelled within 7 days. No refund within 48 hours of the event.',
  },
  {
    question: 'What if my child is anxious about the camp idea?',
    answer:
      'This is a daytime event with parents able to stay nearby. Our house leaders are trained to welcome shy children gently. We have a Quiet Zone with books and cushions for children who need a break.',
  },
]

export interface SouvenirEntry {
  name: string
  description: string
  /** Path under public/. Placeholder pulled from the existing library — swap once event-specific photos are shot. */
  image: string
  imageAlt: string
}

export const SOUVENIRS: SouvenirEntry[] = [
  {
    name: 'Camp Certificates',
    description:
      'Printed Junior Camper certificates on branded paper, signed by the Program Director, personalised with each child’s first name and house.',
    image: '/images/events/base-camp-kids/souvenir-certificate.webp',
    imageAlt: 'Junior Camper certificate with a forest-green border and gold foil seal beside dried savanna grass and a wooden name tag',
  },
  {
    name: 'Branded Water Bottles',
    description:
      'Reusable Camping Nigeria water bottles in the goodie bag, with a name sticker for each child so nothing gets mixed up on the day.',
    image: '/images/events/base-camp-kids/souvenir-water-bottle.webp',
    imageAlt: 'Matte forest-green stainless-steel water bottle with a brushed gold cap on a weathered wooden picnic table',
  },
  {
    name: 'Branded Goodie Bags',
    description:
      'Each child leaves with a Camping Nigeria goodie bag carrying their decorated T-shirt, certificate, mini journal, and house pin.',
    image: '/images/events/base-camp-kids/souvenir-goodie-bag.webp',
    imageAlt: 'Three cotton drawstring goodie bags in cream, forest green, and warm gold lined up under dappled tree shade',
  },
]
