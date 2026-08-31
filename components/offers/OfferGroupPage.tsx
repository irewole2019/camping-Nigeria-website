import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import PageHero from '@/components/shared/PageHero'
import OfferGroupNav from '@/components/offers/OfferGroupNav'
import OfferPackages from '@/components/offers/OfferPackages'
import OfferTerms from '@/components/offers/OfferTerms'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/structured-data'
import type { OfferGroup } from '@/lib/offers-data'

/**
 * Shared shell for the three /offers/<group> routes. Everything that varies
 * lives in lib/offers-data.ts, so adding a fourth market is a data edit plus
 * a four-line page file.
 */
export default function OfferGroupPage({ group }: { group: OfferGroup }) {
  const path = `/offers/${group.slug}`

  return (
    <main id="main-content">
      <JsonLd
        id={`offers-${group.slug}-breadcrumb-jsonld`}
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Offers', path: '/offers' },
          { name: group.name, path },
        ])}
      />
      <JsonLd
        id={`offers-${group.slug}-service-jsonld`}
        data={buildServiceJsonLd({
          name: `Camping Nigeria offers for ${group.name.toLowerCase()}`,
          description: group.intro,
          path,
          serviceType: group.serviceType,
          // Every package carries a numeric floor price, so this emits an
          // AggregateOffer and is eligible for price-range rich results.
          offers: group.packages.map((pkg) => ({
            name: pkg.name,
            description: pkg.summary,
            price: pkg.priceFromValue,
            url: path,
          })),
        })}
      />

      <Navbar />
      <PageHero
        image={group.hero.src}
        imageAlt={group.hero.alt}
        eyebrow={group.eyebrow}
        headline={group.name}
        subheadline={group.intro}
        height="h-[70dvh]"
        minHeight="min-h-[480px]"
      />
      <OfferGroupNav current={group.slug} />
      <OfferPackages packages={group.packages} intro={group.packagesIntro} />
      <OfferTerms />
      <Footer />
    </main>
  )
}
