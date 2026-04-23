import { CONTACT, LOGO_URL } from '@/lib/constants'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface FaqEntry {
  question: string
  answer: string
}

export interface ServiceOffer {
  name: string
  description?: string
  /** Fixed minimum price in NGN. Omit when pricing is quote-based. */
  price?: number
  /** URL to the page where the offer is redeemed. */
  url?: string
}

export interface ServiceJsonLdInput {
  name: string
  description: string
  /** Page path that hosts the service, e.g. '/schools/programs/nature-craft' */
  path: string
  /** What kind of service this is — appears in rich results */
  serviceType: string
  /** Optional list of purchasable tiers. Omit for quote-based services. */
  offers?: ServiceOffer[]
}

const ORG_ID = `${SITE_URL}/#organization`

function toAbsoluteUrl(path: string): string {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path}`
}

// ─── Organization / LocalBusiness ───────────────────────────────────────────

/**
 * Organization + LocalBusiness hybrid — Google accepts the combined `@type`
 * array and surfaces richer results for local-intent queries (camping
 * Lagos, outdoor programmes Nigeria) without losing the generic
 * Organization treatment. `priceRange` uses `₦₦₦` to indicate premium
 * positioning without committing to a specific number; real prices live on
 * the DoE page via Offer schema.
 */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@id': ORG_ID,
    '@type': ['Organization', 'LocalBusiness'],
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteUrl(LOGO_URL),
    image: toAbsoluteUrl(LOGO_URL),
    email: CONTACT.email,
    telephone: CONTACT.phone,
    priceRange: '₦₦₦',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.streetAddress,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      addressCountry: CONTACT.address.country,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    sameAs: [CONTACT.instagram, CONTACT.facebook],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT.email,
        telephone: CONTACT.phone,
        areaServed: 'NG',
        availableLanguage: ['English'],
      },
    ],
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-NG',
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
    },
  }
}

// ─── Breadcrumbs / FAQ ──────────────────────────────────────────────────────

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  }
}

export function buildFaqJsonLd(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}

// ─── Service / Offer ────────────────────────────────────────────────────────

/**
 * Service schema with optional AggregateOffer. Each program page (school
 * programs, DoE) can emit one of these describing what's on offer.
 *
 * When `offers` are provided and all have prices, an `AggregateOffer` is
 * built with `lowPrice`/`highPrice` so Google can surface price ranges
 * directly in search results. When offers have no prices, the Service is
 * still valid but no AggregateOffer is attached.
 */
export function buildServiceJsonLd(input: ServiceJsonLdInput) {
  const serviceUrl = toAbsoluteUrl(input.path)

  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: serviceUrl,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Nigeria' },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  }

  if (input.offers && input.offers.length > 0) {
    const pricedOffers = input.offers.filter(
      (o): o is ServiceOffer & { price: number } => typeof o.price === 'number',
    )

    if (pricedOffers.length === input.offers.length && pricedOffers.length > 0) {
      const prices = pricedOffers.map((o) => o.price)
      base.offers = {
        '@type': 'AggregateOffer',
        priceCurrency: 'NGN',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: pricedOffers.length,
        offers: pricedOffers.map((o) => ({
          '@type': 'Offer',
          name: o.name,
          description: o.description,
          price: o.price,
          priceCurrency: 'NGN',
          url: o.url ? toAbsoluteUrl(o.url) : serviceUrl,
          availability: 'https://schema.org/InStock',
        })),
      }
    } else {
      // No prices — just list the tiers as named sub-services
      base.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: `${input.name} packages`,
        itemListElement: input.offers.map((o) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: o.name,
            description: o.description,
          },
        })),
      }
    }
  }

  return base
}
