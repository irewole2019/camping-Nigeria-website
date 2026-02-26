/**
 * Centralized media registry — single source of truth for all images and videos.
 *
 * To update a media asset on the site, replace the corresponding file in /public.
 * Every component imports from this file instead of hardcoding paths.
 *
 * IMAGE GUIDE — drop your files into the folders below:
 *
 *   public/images/shared/logo.png
 *   public/videos/hero-bg.mp4
 *
 *   public/images/home/poster.jpg              (video poster / fallback)
 *
 *   public/images/schools/hero.jpg
 *   public/images/schools/why-outdoor-learning.jpg
 *   public/images/schools/program-campus-camps.jpg
 *   public/images/schools/program-eco-awareness.jpg
 *   public/images/schools/program-leadership.jpg
 *   public/images/schools/media-feature.jpg
 *   public/images/schools/audience-individuals.jpg
 *   public/images/schools/audience-organizations.jpg
 *   public/images/schools/audience-gear-rental.jpg
 *   public/images/schools/final-cta.jpg
 *
 *   public/images/individuals/hero.jpg
 *   public/images/individuals/expect-guided-trails.jpg
 *   public/images/individuals/expect-verified-campsites.jpg
 *   public/images/individuals/expect-quality-equipment.jpg
 *   public/images/individuals/expect-structured-itinerary.jpg
 *   public/images/individuals/expect-community.jpg
 *   public/images/individuals/gallery-1.jpg
 *   public/images/individuals/gallery-2.jpg
 *   public/images/individuals/gallery-3.jpg
 *   public/images/individuals/gallery-4.jpg
 *   public/images/individuals/gallery-5.jpg
 *   public/images/individuals/gallery-6.jpg
 *   public/images/individuals/gallery-7.jpg
 *   public/images/individuals/cta.jpg
 *
 *   public/images/organizations/hero.jpg
 *   public/images/organizations/offering-team-building.jpg
 *   public/images/organizations/offering-leadership.jpg
 *   public/images/organizations/offering-luxury-camp.jpg
 *
 *   public/images/gear-rental/hero.jpg
 */

// ─── Branding ────────────────────────────────────────────────────────────────

export const MEDIA_LOGO = '/images/shared/logo.png'

export const MEDIA_VIDEO = '/videos/hero-bg.mp4'

// ─── Schools Page ────────────────────────────────────────────────────────────

export const SCHOOLS_HERO = {
  src: '/images/schools/hero.jpg',
  alt: 'Students gathered around a campfire during an outdoor learning expedition',
}

export const SCHOOLS_WHY_OUTDOOR_LEARNING = {
  src: '/images/schools/why-outdoor-learning.jpg',
  alt: 'Students engaged in focused outdoor learning and nature reflection',
}

export const SCHOOLS_PROGRAMS = [
  {
    src: '/images/schools/program-campus-camps.jpg',
    alt: '2-Day On-Campus Camps',
  },
  {
    src: '/images/schools/program-eco-awareness.jpg',
    alt: 'Eco-Awareness Modules',
  },
  {
    src: '/images/schools/program-leadership.jpg',
    alt: 'Leadership Development',
  },
]

export const SCHOOLS_MEDIA_FEATURE = {
  src: '/images/schools/media-feature.jpg',
  alt: 'A wide camping landscape at dusk',
}

export const SCHOOLS_SECONDARY_AUDIENCES = [
  {
    src: '/images/schools/audience-individuals.jpg',
    alt: 'Young adults on a camping trip',
  },
  {
    src: '/images/schools/audience-organizations.jpg',
    alt: 'Team bonding outdoors',
  },
  {
    src: '/images/schools/audience-gear-rental.jpg',
    alt: 'Premium camping gear laid out',
  },
]

export const SCHOOLS_FINAL_CTA = {
  src: '/images/schools/final-cta.jpg',
  alt: '',
}

// ─── Individuals Page ────────────────────────────────────────────────────────

export const INDIVIDUALS_HERO = {
  src: '/images/individuals/hero.jpg',
  alt: 'Young adults gathered around a campfire in warm evening light',
}

export const INDIVIDUALS_EXPECTATIONS = [
  {
    src: '/images/individuals/expect-guided-trails.jpg',
    alt: 'Guide leading a group through a forest trail',
  },
  {
    src: '/images/individuals/expect-verified-campsites.jpg',
    alt: 'Verified campsite with tents at dusk',
  },
  {
    src: '/images/individuals/expect-quality-equipment.jpg',
    alt: 'Quality camping equipment laid out',
  },
  {
    src: '/images/individuals/expect-structured-itinerary.jpg',
    alt: 'Group following a structured hiking itinerary',
  },
  {
    src: '/images/individuals/expect-community.jpg',
    alt: 'Community of friends gathered outdoors',
  },
]

export const INDIVIDUALS_GALLERY = [
  {
    src: '/images/individuals/gallery-1.jpg',
    alt: 'Friends gathered around a glowing campfire at night',
    className: 'row-span-2',
  },
  {
    src: '/images/individuals/gallery-2.jpg',
    alt: 'Young adults hiking through a forest trail',
    className: '',
  },
  {
    src: '/images/individuals/gallery-3.jpg',
    alt: 'Tent pitched at sunrise in a clearing',
    className: '',
  },
  {
    src: '/images/individuals/gallery-4.jpg',
    alt: 'Group of campers laughing and connecting outdoors',
    className: 'row-span-2',
  },
  {
    src: '/images/individuals/gallery-5.jpg',
    alt: 'Hiker standing on a ridge overlooking a valley',
    className: '',
  },
  {
    src: '/images/individuals/gallery-6.jpg',
    alt: 'Camping gear neatly arranged on a wooden surface',
    className: '',
  },
  {
    src: '/images/individuals/gallery-7.jpg',
    alt: 'Stars over a campsite in the wilderness',
    className: '',
  },
]

export const INDIVIDUALS_CTA = {
  src: '/images/individuals/cta.jpg',
  alt: '',
}

// ─── Organizations Page ──────────────────────────────────────────────────────

export const ORGANIZATIONS_HERO = {
  src: '/images/organizations/hero.jpg',
  alt: 'Professional team collaborating outdoors in a lush natural setting',
}

export const ORGANIZATIONS_OFFERINGS = [
  {
    src: '/images/organizations/offering-team-building.jpg',
    alt: 'Group of colleagues completing an outdoor challenge together',
  },
  {
    src: '/images/organizations/offering-leadership.jpg',
    alt: 'Team leaders collaborating in a nature setting',
  },
  {
    src: '/images/organizations/offering-luxury-camp.jpg',
    alt: 'Well-organised luxury camp setup in a forest clearing',
  },
]

// ─── Gear Rental Page ────────────────────────────────────────────────────────

export const GEAR_RENTAL_HERO = {
  src: '/images/gear-rental/hero.jpg',
  alt: 'Premium camping gear and tent setup in a forest clearing',
}
