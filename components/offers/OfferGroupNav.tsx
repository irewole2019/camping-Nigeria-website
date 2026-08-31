import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OFFER_GROUPS, type OfferGroupSlug } from '@/lib/offers-data'

/**
 * Lets a visitor move between the three offer groups without going back to
 * the hub. Server component — the active state comes from the page, not the
 * router, so there is no client bundle cost.
 */
export default function OfferGroupNav({ current }: { current: OfferGroupSlug }) {
  return (
    <nav
      aria-label="Offer groups"
      className="bg-white border-b border-brand-dark/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3">
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 pr-3 mr-1 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark/50 hover:text-brand-dark transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            All offers
          </Link>

          {OFFER_GROUPS.map((group) => {
            const isCurrent = group.slug === current
            return (
              <Link
                key={group.slug}
                href={`/offers/${group.slug}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] border-b-2 transition-colors duration-200',
                  isCurrent
                    ? 'text-brand-dark border-brand-accent'
                    : 'text-brand-dark/50 border-transparent hover:text-brand-dark hover:border-brand-dark/20',
                )}
              >
                {group.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
