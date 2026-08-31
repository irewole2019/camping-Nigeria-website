/**
 * Published offer packages, grouped by market.
 *
 * Single source of truth for /offers and its three sub-routes. Feeds the
 * page render, the metadata, the OG cards' copy, the Service + AggregateOffer
 * JSON-LD, and the sitemap. Edit prices and inclusions here only.
 *
 * Pricing convention: `priceFrom` is the indicative minimum shown in the
 * facts strip, and `priceFromValue` is the same number for schema.org. Keep
 * them in step — the AggregateOffer low/high price is derived from the
 * numeric field, so a mismatch would publish a price Google disagrees with.
 */

import {
  INDIVIDUALS_HERO,
  ORGANIZATIONS_HERO,
  SCHOOLS_HERO,
  SCHOOLS_MEDIA_FEATURE,
} from '@/lib/media'
import { BOOKING_FORM_URL } from '@/lib/constants'

export type OfferGroupSlug = 'schools' | 'organizations' | 'individuals'

export interface OfferFact {
  /** Short column label, e.g. 'Group size' */
  label: string
  value: string
}

export interface OfferNote {
  /** Bolded lead-in, e.g. 'School provides' */
  label: string
  body: string
}

export interface OfferPackage {
  /** Stable anchor id within its group page */
  slug: string
  /** Small gold chip above the name, e.g. 'Core' / 'Premium' */
  chip: string
  name: string
  summary: string
  /** Exactly the four columns of the facts strip */
  facts: [OfferFact, OfferFact, OfferFact, OfferFact]
  /** Rendered as the "Everything in X, plus:" bar above the inclusions */
  buildsOn?: string
  includes: string[]
  notes: OfferNote[]
  /** Indicative minimum in NGN — drives AggregateOffer low/high price */
  priceFromValue: number
  cta: { label: string; href: string }
}

export interface OfferGroup {
  slug: OfferGroupSlug
  /** Heading used in nav, cards and breadcrumbs */
  name: string
  eyebrow: string
  /** Hub-card one-liner */
  teaser: string
  /** Hero subheadline on the group page */
  intro: string
  /** Lead paragraph above the package list — must not repeat `intro` */
  packagesIntro: string
  hero: { src: string; alt: string }
  metaTitle: string
  metaDescription: string
  /** schema.org Service.serviceType */
  serviceType: string
  packages: OfferPackage[]
}

// ─── Shared terms (rendered under every group's packages) ───────────────────

export const OFFER_TERMS: OfferNote[] = [
  {
    label: 'Every programme includes',
    body: 'Trained facilitators, full equipment and setup, a written safety pack and risk assessment, medical cover appropriate to the format, and a named Programme Manager from signing to delivery.',
  },
  {
    label: 'Booking and payment',
    body: '50% deposit on signing, balance two weeks before delivery, with 5% off for full payment on signing. Termly and annual invoicing available for schools. Purchase orders accepted.',
  },
  {
    label: 'Pricing',
    body: 'Prices are indicative and subject to confirmation on group size, dates and location. Quotes are issued within 72 hours of a planning call.',
  },
]

// ─── Schools ────────────────────────────────────────────────────────────────

const SCHOOLS: OfferGroup = {
  slug: 'schools',
  name: 'Schools',
  eyebrow: 'Offers for Schools',
  teaser:
    'Outdoor development programmes delivered on your own campus, from a single facilitated day to a full outdoor year.',
  intro:
    'Outdoor development programmes delivered on your own campus. Your teachers supervise. Nothing lands on one member of staff.',
  packagesIntro:
    'Three ways in, in order of depth. Field Day is where most schools start; The Campus Expedition adds the overnight; The Outdoor Year books the whole calendar in advance. Each one builds on the one before it.',
  hero: SCHOOLS_HERO,
  metaTitle: 'School Offers & Pricing | Camping Nigeria',
  metaDescription:
    'Published pricing for Camping Nigeria school programmes — Field Day from ₦3,000,000, The Campus Expedition from ₦6,000,000, and The Outdoor Year annual partnership.',
  serviceType: 'Outdoor education programme',
  packages: [
    {
      slug: 'field-day',
      chip: 'Core',
      name: 'Field Day',
      summary: 'A single facilitated day on campus. The way most schools start.',
      facts: [
        { label: 'Format', value: '1 day, on campus' },
        { label: 'Group size', value: 'Up to 150 students' },
        { label: 'Lead time', value: '3 to 4 weeks' },
        { label: 'From', value: '₦3,000,000' },
      ],
      includes: [
        'Age-banded programme: Nature and Craft, or Leadership Development',
        'Facilitators on site throughout, at a published ratio',
        'Students pitch and strike their own camp',
        'Equipment, delivery, setup and collection',
        'Safety pack and risk assessment',
        'Parent pack, written and ready to send',
        'Photo documentation',
        'Written impact report',
        'Named Programme Manager from signing to report',
      ],
      notes: [
        {
          label: 'School provides',
          body: 'Venue, catering, teacher supervision, first aid presence.',
        },
        {
          label: 'Price',
          body: '₦1,200,000 mobilisation plus ₦18,000 per student. ₦3,000,000 at 100 students.',
        },
      ],
      priceFromValue: 3_000_000,
      cta: { label: 'Request a Field Day proposal', href: '/schools/proposal' },
    },
    {
      slug: 'campus-expedition',
      chip: 'Premium',
      name: 'The Campus Expedition',
      summary:
        'Two days and a night on campus. A real expedition without leaving the school gates.',
      facts: [
        { label: 'Format', value: '2 days, 1 night' },
        { label: 'Group size', value: 'Up to 150 students' },
        { label: 'Lead time', value: '6 weeks' },
        { label: 'From', value: '₦6,000,000' },
      ],
      buildsOn: 'Everything in Field Day, plus:',
      includes: [
        'Overnight camp with house system, evening circle and campfire',
        'Pre-camp student briefing assembly',
        'Site assessment with written access and security plan',
        'Overnight supervision plan with published night ratio',
        'First aid trained staff on site',
        'Equipment maintenance presence on site',
        'Teacher role cards and pre-start briefing',
        'Equipment inspection photographs before delivery',
        'Certificates and house awards',
        'Photo and video, highlight cut within 48 hours',
        'Impact report with student self-ratings before and after',
        'Debrief session with school leadership',
      ],
      notes: [
        {
          label: 'School provides',
          body: 'Campus access, catering, teacher presence throughout, permission slips on our template.',
        },
        {
          label: 'Price',
          body: '₦2,500,000 mobilisation plus ₦35,000 per student. ₦6,000,000 at 100 students.',
        },
      ],
      priceFromValue: 6_000_000,
      cta: { label: 'Request a Campus Expedition proposal', href: '/schools/proposal' },
    },
    {
      slug: 'outdoor-year',
      chip: 'Annual',
      name: 'The Outdoor Year',
      summary:
        "An outdoor programme for the whole school year, with your dates locked before the calendar fills.",
      facts: [
        { label: 'Format', value: '2 to 3 programmes a year' },
        { label: 'Group size', value: 'Whole school, by year group' },
        { label: 'Lead time', value: 'Before the school year opens' },
        { label: 'From', value: '₦12,750,000' },
      ],
      buildsOn: 'Everything above, across the year, plus:',
      includes: [
        'Dates locked in an annual planning call before the year starts',
        "Programme built around your school's development goals",
        'Priority calendar rights before general booking opens',
        'Progressive design, so each year group builds on the last',
        'Licence to use programme photography in admissions marketing',
        'Annual outcomes summary for the board',
        'Partner rate on any additional equipment hire',
        'One outdoor session for teaching staff',
      ],
      notes: [
        {
          label: 'Price',
          body: 'Annual agreement, quoted on student numbers and programme mix. Two Campus Expeditions and one Field Day at 100 students is ₦12,750,000.',
        },
      ],
      priceFromValue: 12_750_000,
      cta: { label: 'Start an Outdoor Year conversation', href: '/schools/proposal' },
    },
  ],
}

// ─── Organizations ──────────────────────────────────────────────────────────

const ORGANIZATIONS: OfferGroup = {
  slug: 'organizations',
  name: 'Organizations',
  eyebrow: 'Offers for Organizations',
  teaser:
    'Company days and leadership offsites where the team builds and lives in a real camp.',
  intro:
    'Company days and leadership offsites where the team builds and lives in a real camp, not a conference room with a view.',
  packagesIntro:
    'Two formats. The Company Field Day is a reward day for the whole team, catering and bonfire included. The Leadership Expedition is a working offsite for a smaller group, designed around issues you name in advance and closed with a written debrief.',
  hero: ORGANIZATIONS_HERO,
  metaTitle: 'Organization Offers & Pricing | Camping Nigeria',
  metaDescription:
    'Published pricing for Camping Nigeria corporate programmes — The Company Field Day from ₦3,550,000 and The Leadership Expedition from ₦5,450,000, catering and facilitation included.',
  serviceType: 'Corporate outdoor programme',
  packages: [
    {
      slug: 'company-field-day',
      chip: 'Core',
      name: 'The Company Field Day',
      summary:
        'A full day and evening for the whole team. Reward, bonding and a story people repeat on Monday.',
      facts: [
        { label: 'Format', value: '1 day and evening' },
        { label: 'Group size', value: '30 to 120 people' },
        { label: 'Lead time', value: '4 weeks' },
        { label: 'From', value: '₦3,550,000' },
      ],
      includes: [
        'Camp build: the team pitches and strikes its own camp',
        'Full camping equipment, shade, seating, lighting',
        'Facilitators throughout, at a published ratio',
        'Structured team challenge programme',
        'Catering: main meal, suya station, small chops, bar',
        'Sound system, DJ and MC',
        'Bonfire evening with a structured close',
        'Medical personnel on ground',
        'Site assessment, safety and emergency plan',
        'Photo and video, highlight cut within 48 hours',
        'Named Programme Manager',
      ],
      notes: [
        {
          label: 'Add on',
          body: "Movie night, branded team merchandise, family day format with a supervised children's zone.",
        },
        {
          label: 'Company provides',
          body: 'Confirmed headcount 14 days out, dietary requirements, one contact on the day, venue if using own grounds.',
        },
        {
          label: 'Price',
          body: '₦2,200,000 mobilisation plus ₦45,000 per head. ₦4,450,000 at 50 people.',
        },
      ],
      priceFromValue: 3_550_000,
      cta: { label: 'Plan a Company Field Day', href: '/contact' },
    },
    {
      slug: 'leadership-expedition',
      chip: 'Premium',
      name: 'The Leadership Expedition',
      summary:
        'Two days and a night for a leadership team, built around the issues you name, with a written debrief afterwards.',
      facts: [
        { label: 'Format', value: '2 days, 1 night' },
        { label: 'Group size', value: '15 to 45 people' },
        { label: 'Lead time', value: '6 weeks' },
        { label: 'From', value: '₦5,450,000' },
      ],
      buildsOn: 'Everything in The Company Field Day, plus:',
      includes: [
        'Overnight camp: the team sleeps in what it built',
        'Discovery call with the sponsor before we design anything',
        'Programme built around your two or three real issues',
        'Rotating command: every participant leads a task',
        'Facilitated reflection after each challenge',
        'Confidential peer feedback round',
        'Commitment circle: everyone leaves with a written commitment',
        'Overnight supervision and security plan',
        'Team Debrief Report within 10 days',
        'Follow-up call with the sponsor after 90 days',
      ],
      notes: [
        {
          label: 'Not included',
          body: 'Psychometric testing or individual performance ratings. Facilitator observations go to the sponsor as input, not evaluation.',
        },
        {
          label: 'Price',
          body: '₦3,200,000 mobilisation plus ₦75,000 per head. ₦6,950,000 at 50 people.',
        },
      ],
      priceFromValue: 5_450_000,
      cta: { label: 'Plan a Leadership Expedition', href: '/contact' },
    },
  ],
}

// ─── Individuals ────────────────────────────────────────────────────────────

const INDIVIDUALS: OfferGroup = {
  slug: 'individuals',
  name: 'Individuals',
  eyebrow: 'Offers for Individuals',
  teaser:
    'Camping without owning any of it. Join a scheduled camp, or bring your own group.',
  intro:
    'Camping without owning any of it. Bring clothes and a toothbrush. We handle the rest.',
  packagesIntro:
    'Buy a single seat on a camp we have already scheduled, or take a date for your own group. Both include every piece of gear, all meals, and supervision through the night.',
  hero: INDIVIDUALS_HERO,
  metaTitle: 'Individual Camping Offers & Prices | Camping Nigeria',
  metaDescription:
    'Join an Open Camp from ₦95,000 per person, or book a Private Camp for your own group from ₦1,550,000. All gear, meals and supervision included.',
  serviceType: 'Guided camping experience',
  packages: [
    {
      slug: 'open-camp',
      chip: 'Buy a seat',
      name: 'Open Camp',
      summary:
        'A scheduled overnight camp you join on your own or with a friend. Built for people who have never camped.',
      facts: [
        { label: 'Format', value: '1 night, set dates' },
        { label: 'Minimum to run', value: '18 people' },
        { label: 'Booking closes', value: '10 days before' },
        { label: 'Per person', value: '₦95,000' },
      ],
      includes: [
        'All gear: tent, sleeping mat, sleeping bag, lighting',
        'Guided pitch, so you put up your own tent with help',
        'All meals: dinner, bonfire suya, breakfast',
        'Facilitated activities, so nobody stands alone',
        'Bonfire evening with music, stories and games',
        'Morning activity: nature walk or sunrise session',
        'Medical personnel on ground and an emergency protocol',
        'Site security and overnight supervision',
        'Photo record shared with everyone afterwards',
        'First-timer briefing sent when you book',
      ],
      notes: [
        {
          label: 'Runs or refunds',
          body: 'If we do not reach 18 people, the camp does not run and every ticket is refunded in full within five working days.',
        },
        {
          label: 'Add on',
          body: 'Return transport from a single Abuja pickup point, ₦15,000 per person.',
        },
        {
          label: 'Payment',
          body: 'In full on booking. Solo bookings and tent sharing available.',
        },
      ],
      priceFromValue: 95_000,
      cta: { label: 'Book Your Spot', href: BOOKING_FORM_URL },
    },
    {
      slug: 'private-camp',
      chip: 'Bring your group',
      name: 'Private Camp',
      summary:
        'Your group, your date, no strangers. For birthdays, families, church groups, societies and small teams.',
      facts: [
        { label: 'Format', value: '1 night, your date' },
        { label: 'Group size', value: 'From 10 people' },
        { label: 'Lead time', value: '3 weeks' },
        { label: 'From', value: '₦1,550,000' },
      ],
      buildsOn: 'Everything in Open Camp, plus:',
      includes: [
        'Your own date and your own group',
        'Choice of location from our vetted sites',
        'Programme shaped to the occasion',
        'Catering tailored to the group, including dietary and faith requirements',
        'Option to run on private grounds, subject to a site visit',
        'Named Programme Manager and one point of contact',
        'Full photo and video record',
      ],
      notes: [
        {
          label: 'Add on',
          body: "Bonfire and music setup, DJ, movie night, celebration setup, children's zone with dedicated supervision, craft session.",
        },
        {
          label: 'Price',
          body: '₦900,000 plus ₦65,000 per person. ₦2,200,000 at 20 people.',
        },
        { label: 'Payment', body: '50% deposit, balance one week before.' },
      ],
      priceFromValue: 1_550_000,
      cta: { label: 'Plan a Private Camp', href: '/contact' },
    },
  ],
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const OFFER_GROUPS: OfferGroup[] = [SCHOOLS, ORGANIZATIONS, INDIVIDUALS]

/** Hero for the /offers hub itself — a wide landscape, not one market's photo. */
export const OFFERS_HUB_HERO = SCHOOLS_MEDIA_FEATURE

export function getOfferGroup(slug: OfferGroupSlug): OfferGroup {
  const group = OFFER_GROUPS.find((g) => g.slug === slug)
  if (!group) throw new Error(`Unknown offer group: ${slug}`)
  return group
}
