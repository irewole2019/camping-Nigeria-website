'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera, Images, X } from 'lucide-react'
import Section from '@/components/ui/Section'
import { EVENT_SLOTS, type CommunityEventSlot } from '@/lib/community'

/**
 * "Events we've hosted" — three slots, each a button that reveals
 * "Explore Gallery" on hover or keyboard focus and opens its gallery in a
 * native <dialog> (which gives focus trapping and Escape for free).
 *
 * A slot with no photos still opens, and says plainly that photos are on the
 * way, rather than being a dead card. On touch screens, where there is no
 * hover, the label sits permanently at the foot of the card.
 */
export default function EventGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<CommunityEventSlot | null>(null)

  function open(slot: CommunityEventSlot) {
    setActive(slot)
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  return (
    <Section id="past-events" className="bg-brand-light">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent-readable">
          Past events
        </p>
        <h2 className="font-serif text-3xl font-bold text-brand-dark text-balance md:text-4xl">
          Events we&apos;ve hosted
        </h2>
        <div className="mt-4 h-1 w-12 rounded-full bg-brand-accent" aria-hidden="true" />
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {EVENT_SLOTS.map((slot) => (
          <li key={slot.id}>
            <button
              type="button"
              onClick={() => open(slot)}
              aria-haspopup="dialog"
              aria-label={`Explore gallery: ${slot.title}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-dark text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
            >
              {slot.cover ? (
                <Image
                  src={slot.cover.src}
                  alt={slot.cover.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(230,179,37,0.18),transparent_60%)]"
                  aria-hidden="true"
                >
                  <Camera className="h-12 w-12 text-white/20" strokeWidth={1.5} />
                </div>
              )}

              {/* Legibility gradient for the caption */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent">
                  {slot.dateLabel ?? 'Coming soon'}
                </p>
                <p className="mt-1 font-serif text-2xl font-bold text-white">{slot.title}</p>
                {/* Touch screens: always visible, since there is no hover. */}
                <span className="mt-3 inline-flex items-center gap-2 font-sans text-sm font-semibold text-white/90 [@media(hover:hover)]:hidden">
                  <Images className="h-4 w-4" aria-hidden="true" />
                  Explore Gallery
                </span>
              </div>

              {/* Hover / focus overlay */}
              <div
                className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-brand-dark/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:flex"
                aria-hidden="true"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-white">
                  <Images className="h-4 w-4" />
                  Explore Gallery
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === dialogRef.current) close()
        }}
        aria-labelledby="community-gallery-title"
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/70"
      >
        {active && (
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable">
                  {active.dateLabel ?? 'Coming soon'}
                </p>
                <h3
                  id="community-gallery-title"
                  className="mt-1 font-serif text-2xl font-bold text-brand-dark md:text-3xl"
                >
                  {active.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="rounded-full p-2 text-brand-dark/60 transition-colors hover:bg-brand-dark/5 hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {active.photos.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {active.photos.map((p) => (
                  <li key={p.src} className="relative aspect-[3/2] overflow-hidden rounded-lg">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-brand-dark/20 bg-brand-light px-6 py-12 text-center">
                <Camera
                  className="mx-auto h-10 w-10 text-brand-accent-readable"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="mt-4 font-serif text-xl font-bold text-brand-dark">
                  Gallery coming soon
                </p>
                <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-brand-dark/65">
                  {active.href
                    ? 'Photos from this event are being added. Check back shortly.'
                    : 'Our next gallery will go up here after the event.'}
                </p>
                {active.href ? (
                  <Link
                    href={active.href}
                    className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark underline-offset-4 hover:underline"
                  >
                    See the event page
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/events"
                    className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-dark underline-offset-4 hover:underline"
                  >
                    See upcoming events
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </dialog>
    </Section>
  )
}
