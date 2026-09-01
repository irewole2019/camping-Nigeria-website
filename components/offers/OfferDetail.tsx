import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { OfferPackage } from '@/lib/offers-data'

/**
 * The pieces that make up a package's full detail view. Shared by the
 * /offers group pages (rendered inline) and the OfferShowcase modal on the
 * marketing sections, so the two presentations can't drift apart.
 *
 * No hooks here — safe to import from server and client components alike.
 */

/**
 * The four-column data strip. The last fact is the price and gets the
 * emphasis treatment — it is the number people scan for.
 */
export function FactsStrip({ facts }: { facts: OfferPackage['facts'] }) {
  const lastIndex = facts.length - 1

  return (
    // Container carries only the top rule; each cell carries its own bottom
    // rule, so the closing line falls out naturally at every breakpoint
    // without double borders. Vertical dividers appear only at lg, where the
    // strip is a single row and the math is unambiguous.
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-brand-dark/10 lg:border-b">
      {facts.map((fact, index) => {
        const isPrice = index === lastIndex
        const dividers = [
          'border-b border-brand-dark/10 lg:border-b-0',
          index < lastIndex ? 'lg:border-r lg:border-brand-dark/10' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={fact.label} className={`px-6 md:px-8 py-4 ${dividers}`}>
            <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45 mb-1.5">
              {fact.label}
            </dt>
            <dd
              className={
                isPrice
                  ? 'font-sans text-base font-bold text-brand-dark tabular-nums'
                  : 'font-sans text-[15px] font-semibold text-brand-dark/85'
              }
            >
              {fact.value}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

/** Gold chip above the package name. */
export function OfferChip({ label }: { label: string }) {
  return (
    <span className="inline-block bg-brand-accent text-brand-dark font-sans text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5">
      {label}
    </span>
  )
}

/** "Everything in X, plus:" bar, the inclusions list, and the notes block. */
export function OfferBody({ pkg }: { pkg: OfferPackage }) {
  return (
    <>
      {pkg.buildsOn && (
        <p className="font-sans text-sm font-semibold text-brand-dark bg-brand-dark-tint border-l-[3px] border-brand-accent px-4 py-2.5 mb-6">
          {pkg.buildsOn}
        </p>
      )}

      <h4 className="inline-block font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark pb-2 mb-4 border-b-2 border-brand-accent">
        What is included
      </h4>

      <ul className="sm:columns-2 sm:gap-x-10 space-y-2.5">
        {pkg.includes.map((item) => (
          <li
            key={item}
            className="relative pl-5 font-sans text-[15px] text-brand-dark/75 leading-relaxed break-inside-avoid"
          >
            <span
              className="absolute left-0 top-[0.55em] w-[7px] h-[7px] bg-brand-accent"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      {pkg.notes.length > 0 && (
        <div className="mt-7 pt-5 border-t border-brand-dark/10 space-y-2">
          {pkg.notes.map((note) => (
            <p
              key={note.label}
              className="font-sans text-sm text-brand-dark/60 leading-relaxed"
            >
              <span className="font-semibold text-brand-dark/85">{note.label}:</span>{' '}
              {note.body}
            </p>
          ))}
        </div>
      )}
    </>
  )
}

/** The package's primary action. External hrefs open in a new tab. */
export function OfferCta({ cta }: { cta: OfferPackage['cta'] }) {
  const className =
    'inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-sans font-semibold text-sm rounded-lg tracking-wide hover:bg-brand-dark/90 active:scale-[0.98] transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark'

  if (cta.href.startsWith('http')) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {cta.label}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </a>
    )
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
  )
}
