import OfferGroupPage from '@/components/offers/OfferGroupPage'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'

const group = getOfferGroup('organizations')

export const metadata = buildPageMetadata({
  title: group.metaTitle,
  description: group.metaDescription,
  path: '/offers/organizations',
  keywords: [
    'corporate team building Abuja',
    'company retreat packages Nigeria',
    'leadership offsite Nigeria',
    'company family day Nigeria',
  ],
})

export default function OrganizationOffersPage() {
  return <OfferGroupPage group={group} />
}
