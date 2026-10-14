/**
 * Centralized media registry — single source of truth for all images and videos.
 *
 * To update a media asset on the site, replace the corresponding file in /public.
 * Every component imports from this file instead of hardcoding paths.
 *
 * IMAGE GUIDE — drop your files into the folders below:
 *
 *   public/images/shared/logo.webp
 *   public/videos/hero-bg.mp4
 *
 *   public/images/home/poster.webp             (video poster / fallback)
 *
 *   public/images/schools/hero.webp
 *   public/images/schools/why-outdoor-learning.webp
 *   public/images/schools/program-campus-camps.webp
 *   public/images/schools/program-eco-awareness.webp
 *   public/images/schools/program-leadership.webp
 *   public/images/schools/media-feature.webp
 *   public/images/schools/audience-community.webp
 *   public/images/schools/audience-organizations.webp
 *   public/images/schools/audience-gear-rental.webp
 *   public/images/schools/final-cta.webp
 *
 *   public/images/community/*.webp            (photos: see lib/community.ts)
 *   public/videos/community-hero.{mp4,webm}
 *
 *   public/images/organizations/hero.webp
 *   public/images/organizations/offering-team-building.webp
 *   public/images/organizations/offering-leadership.webp
 *   public/images/organizations/offering-luxury-camp.webp
 *
 *   public/images/gear-rental/hero.webp
 *
 *   public/images/about/hero.webp
 *   public/images/about/our-story.webp
 *   public/images/about/what-we-do.webp
 *   public/images/about/value-intentional.webp
 *   public/images/about/value-community.webp
 *   public/images/about/value-trust.webp
 *   public/images/about/manifesto.webp
 *   public/images/about/cta.webp
 */

// ─── Branding ────────────────────────────────────────────────────────────────

export const MEDIA_LOGO = '/images/shared/logo.webp'

export const MEDIA_VIDEO = '/videos/hero-bg.mp4'

// ─── Schools Page ────────────────────────────────────────────────────────────

export const SCHOOLS_HERO = {
  src: '/images/schools/hero.webp',
  alt: 'Students gathered around a campfire during an outdoor learning expedition',
}

export const SCHOOLS_WHY_OUTDOOR_LEARNING = {
  src: '/images/schools/why-outdoor-learning.webp',
  alt: 'Students gathered at an outdoor school event',
}

export const SCHOOLS_PROGRAMS = [
  {
    src: '/images/schools/program-campus-camps.webp',
    alt: 'Multi-day On-Campus Camps',
  },
  {
    src: '/images/schools/program-eco-awareness.webp',
    alt: 'Eco-Awareness Modules',
  },
  {
    src: '/images/schools/program-leadership.webp',
    alt: 'Leadership Development',
  },
]

export const SCHOOLS_MEDIA_FEATURE = {
  src: '/images/schools/media-feature.webp',
  alt: 'A wide camping landscape at dusk',
}

export const SCHOOLS_SECONDARY_AUDIENCES = [
  {
    src: '/images/schools/audience-community.webp',
    alt: 'Young adults on a camping trip',
  },
  {
    src: '/images/schools/audience-organizations.webp',
    alt: 'Team bonding outdoors',
  },
  {
    src: '/images/schools/audience-gear-rental.webp',
    alt: 'Premium camping gear laid out',
  },
]

export const SCHOOLS_FINAL_CTA = {
  src: '/images/schools/final-cta.webp',
  alt: '',
}

export const SCHOOLS_DOE_CALLOUT = {
  src: '/images/schools/doe-award.webp',
  alt: 'Students participating in the Duke of Edinburgh Award expedition',
}

// ─── Community ───────────────────────────────────────────────────────────────
// The /community page's own photos live in lib/community.ts; this is only the
// hero the /offers/community group and its cards borrow.

export const COMMUNITY_OFFERS_HERO = {
  src: '/images/community/081a0122.webp',
  alt: 'Community members sitting in a wide circle of chairs on the grass, with colourful tents pitched behind them',
}

// ─── Organizations Page ──────────────────────────────────────────────────────

export const ORGANIZATIONS_HERO = {
  src: '/images/organizations/hero.webp',
  alt: 'Professional team collaborating outdoors in a lush natural setting',
}

export const ORGANIZATIONS_OFFERINGS = [
  {
    src: '/images/organizations/offering-team-building.webp',
    alt: 'Group of colleagues completing an outdoor challenge together',
  },
  {
    src: '/images/organizations/offering-leadership.webp',
    alt: 'Team leaders collaborating in a nature setting',
  },
  {
    src: '/images/organizations/offering-luxury-camp.webp',
    alt: 'Well-organised luxury camp setup in a forest clearing',
  },
]

// ─── Gear Rental Page ────────────────────────────────────────────────────────

export const GEAR_RENTAL_HERO = {
  src: '/images/gear-rental/hero.webp',
  alt: 'Premium camping gear and tent setup in a forest clearing',
}

// ─── About Page ─────────────────────────────────────────────────────────────

export const ABOUT_HERO = {
  src: '/images/about/hero.webp',
  alt: 'Explorer sitting on a cliff edge overlooking a lush Nigerian valley',
}

export const ABOUT_OUR_STORY = {
  src: '/images/about/our-story.webp',
  alt: 'The Camping Nigeria community gathered together in a tropical setting',
}

export const ABOUT_WHAT_WE_DO = {
  src: '/images/about/what-we-do.webp',
  alt: 'Colorful tents spread across a green hillside at a Camping Nigeria event',
}

export const ABOUT_VALUES = [
  {
    src: '/images/about/value-intentional.webp',
    alt: 'Two explorers sitting on a rock overlooking Nigerian mountains',
  },
  {
    src: '/images/about/value-community.webp',
    alt: 'A large group gathered in a circle during an outdoor activity',
  },
  {
    src: '/images/about/value-trust.webp',
    alt: 'Smiling cyclist in proper safety gear ready for adventure',
  },
]

export const ABOUT_MANIFESTO = {
  src: '/images/about/manifesto.webp',
  alt: 'Tents pitched by a waterfront at night with city lights reflecting on the water',
}

export const ABOUT_CTA = {
  src: '/images/about/cta.webp',
  alt: 'Group of adventurers on ATVs with arms raised against a mountain backdrop',
}
