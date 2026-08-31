import OfferGroupPage from '@/components/offers/OfferGroupPage'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'

const group = getOfferGroup('schools')

export const metadata = buildPageMetadata({
  title: group.metaTitle,
  description: group.metaDescription,
  path: '/offers/schools',
  keywords: [
    'school camp packages Nigeria',
    'school field day Nigeria',
    'on-campus expedition pricing',
    'school outdoor programme cost',
  ],
})

export default function SchoolOffersPage() {
  return <OfferGroupPage group={group} />
}
