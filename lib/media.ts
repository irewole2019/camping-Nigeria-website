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
 *   public/images/home/poster.jpg              (video poster / fallback)
 *
 *   public/images/schools/hero.webp
 *   public/images/schools/why-outdoor-learning.webp
 *   public/images/schools/program-campus-camps.webp
 *   public/images/schools/program-eco-awareness.webp
 *   public/images/schools/program-leadership.webp
 *   public/images/schools/media-feature.webp
 *   public/images/schools/audience-individuals.webp
 *   public/images/schools/audience-organizations.webp
 *   public/images/schools/audience-gear-rental.webp
 *   public/images/schools/final-cta.webp
 *
 *   public/images/individuals/hero.webp
 *   public/images/individuals/expect-guided-trails.webp
 *   public/images/individuals/expect-verified-campsites.webp
 *   public/images/individuals/expect-quality-equipment.webp
 *   public/images/individuals/expect-structured-itinerary.webp
 *   public/images/individuals/expect-community.webp
 *   public/images/individuals/gallery-1.webp
 *   public/images/individuals/gallery-2.webp
 *   public/images/individuals/gallery-3.webp
 *   public/images/individuals/gallery-4.webp
 *   public/images/individuals/gallery-5.webp
 *   public/images/individuals/gallery-6.webp
 *   public/images/individuals/gallery-7.webp
 *   public/images/individuals/cta.webp
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
    alt: '2-Day On-Campus Camps',
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
    src: '/images/schools/audience-individuals.webp',
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

// ─── Individuals Page ────────────────────────────────────────────────────────

export const INDIVIDUALS_HERO = {
  src: '/images/individuals/hero.webp',
  alt: 'Young adults gathered around a campfire in warm evening light',
}

export const INDIVIDUALS_EXPECTATIONS = [
  {
    src: '/images/individuals/expect-guided-trails.webp',
    alt: 'Beautiful resort grounds with palm trees and a serene poolside setting',
  },
  {
    src: '/images/individuals/expect-verified-campsites.webp',
    alt: 'Lush palm garden with outdoor seating areas on manicured grounds',
  },
  {
    src: '/images/individuals/expect-quality-equipment.webp',
    alt: 'Colorful tents arranged on a wide green field under clear skies',
  },
  {
    src: '/images/individuals/expect-structured-itinerary.webp',
    alt: 'Group following a structured hiking itinerary',
  },
  {
    src: '/images/individuals/expect-community.webp',
    alt: 'Community of friends gathered outdoors',
  },
]

export const INDIVIDUALS_GALLERY = [
  {
    src: '/images/individuals/gallery-1.webp',
    alt: 'Friends gathered around a glowing campfire at night',
    className: 'row-span-2',
  },
  {
    src: '/images/individuals/gallery-2.webp',
    alt: 'Young adults hiking through a forest trail',
    className: '',
  },
  {
    src: '/images/individuals/gallery-3.webp',
    alt: 'Tent pitched at sunrise in a clearing',
    className: '',
  },
  {
    src: '/images/individuals/gallery-4.webp',
    alt: 'Group of campers laughing and connecting outdoors',
    className: 'row-span-2',
  },
  {
    src: '/images/individuals/gallery-5.webp',
    alt: 'Hiker standing on a ridge overlooking a valley',
    className: '',
  },
  {
    src: '/images/individuals/gallery-6.webp',
    alt: 'Camping gear neatly arranged on a wooden surface',
    className: '',
  },
  {
    src: '/images/individuals/gallery-7.webp',
    alt: 'Stars over a campsite in the wilderness',
    className: '',
  },
]

export const INDIVIDUALS_CTA = {
  src: '/images/individuals/cta.webp',
  alt: '',
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
