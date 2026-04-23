import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import AwardHero from '@/components/schools/AwardHero'
import AwardExplainer from '@/components/schools/AwardExplainer'
import ExpeditionOverview from '@/components/schools/ExpeditionOverview'
import OurRole from '@/components/schools/OurRole'
import ExpeditionTiers from '@/components/schools/ExpeditionTiers'
import ExpeditionAssessment from '@/components/schools/international-award/ExpeditionAssessment'
import ExpeditionFaq from '@/components/schools/ExpeditionFaq'
import { AWARD_FAQS } from '@/lib/award-faq'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Duke of Edinburgh Expedition Support | Camping Nigeria',
  description:
    'Camping Nigeria supports schools running the Duke of Edinburgh Award in Nigeria. Equipment, facilitators, and structured outdoor programming for school expeditions.',
  path: '/schools/international-award',
})

export default function InternationalAwardPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="international-award-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          {
            name: 'Duke of Edinburgh Expedition Support',
            path: '/schools/international-award',
          },
        ])}
      />
      <JsonLd id="international-award-faq-jsonld" data={buildFaqJsonLd(AWARD_FAQS)} />
      <JsonLd
        id="international-award-service-jsonld"
        data={buildServiceJsonLd({
          name: 'Duke of Edinburgh Expedition Support',
          description:
            'Expedition equipment, facilitation, and end-to-end programme delivery for Nigerian schools running the Duke of Edinburgh Award. Base Camp, Trail Ready, and Summit Partner tiers scale from equipment-only to fully managed.',
          path: '/schools/international-award',
          serviceType: 'Duke of Edinburgh expedition support',
          offers: [
            {
              name: 'Base Camp — equipment only',
              description:
                'Tent rental, sleeping bags, mats, camping lights, delivery/collection, setup guidance, and safety checklist. For up to 60 students; additional students from ₦50,000 each up to 100.',
              price: 3000000,
              url: '/schools/international-award',
            },
            {
              name: 'Trail Ready — equipment + facilitators',
              description:
                'Everything in Base Camp plus on-site Camping Nigeria facilitators, structured programme delivery, parent communication pack, post-event summary, and photo documentation. For up to 60 students.',
              price: 5000000,
              url: '/schools/international-award',
            },
            {
              name: 'Summit Partner — fully managed',
              description:
                'Everything in Trail Ready plus custom programme design, catering coordination, on-site first aid, branded certificates, pro photo/video recap, leadership debrief, and priority annual slot. For up to 60 students.',
              price: 8000000,
              url: '/schools/international-award',
            },
          ],
        })}
      />
      <Navbar />

      <AwardHero />
      <AwardExplainer />
      <ExpeditionOverview />
      <OurRole />
      <ExpeditionTiers />

      <ExpeditionAssessment />

      <ExpeditionFaq />

      <Footer />
    </main>
  )
}
