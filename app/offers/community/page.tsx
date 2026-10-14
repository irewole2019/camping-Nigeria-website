import OfferGroupPage from '@/components/offers/OfferGroupPage'
import { getOfferGroup } from '@/lib/offers-data'
import { buildPageMetadata } from '@/lib/seo'

const group = getOfferGroup('community')

export const metadata = buildPageMetadata({
  title: group.metaTitle,
  description: group.metaDescription,
  path: '/offers/community',
  keywords: [
    'open camp Nigeria',
    'private camping trip Abuja',
    'beginner camping Nigeria',
    'group camping booking Nigeria',
  ],
})

export default function CommunityOffersPage() {
  return <OfferGroupPage group={group} />
}
