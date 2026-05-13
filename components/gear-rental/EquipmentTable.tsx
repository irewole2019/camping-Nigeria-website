'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package, X } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote-config'

// Thumbnail with three-tier fallback:
//   1. sheet `image_url` (already normalised in parser)
//   2. `/images/gear-rental/items/<id>.webp` static convention
//   3. neutral Package icon if both 404
// `unoptimized` on remote URLs skips next/image's optimiser so we don't have
// to maintain a remotePatterns allowlist as the sheet evolves.
//
// Clicking the thumbnail (when an image is available) calls onOpen so the
// parent can render a single lightbox at the table level.
function ItemThumb({
  item,
  onOpen,
}: {
  item: QuoteItem
  onOpen: (item: QuoteItem, src: string) => void
}) {
  const initial = item.image_url || `/images/gear-rental/items/${item.id}.webp`
  const [src, setSrc] = useState<string | null>(initial)
  const [triedFallback, setTriedFallback] = useState(false)

  function handleError() {
    if (item.image_url && !triedFallback) {
      setTriedFallback(true)
      setSrc(`/images/gear-rental/items/${item.id}.webp`)
    } else {
      setSrc(null)
    }
  }

  if (!src) {
    return (
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-md bg-brand-dark/5 border border-brand-dark/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <Package className="w-5 h-5 text-brand-dark/30" />
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        // Stop the click from toggling the parent category accordion.
        e.stopPropagation()
        onOpen(item, src)
      }}
      aria-label={`View larger image of ${item.name}`}
      className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-md bg-white border border-brand-dark/10 overflow-hidden cursor-zoom-in transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
    >
      <Image
        src={src}
        alt=""
        width={56}
        height={56}
        className="w-full h-full object-contain pointer-events-none"
        onError={handleError}
        unoptimized={src.startsWith('http')}
      />
    </button>
  )
}

// Full-screen lightbox. Renders only when `item` is set. Closes on backdrop
// click, the close button, or the Escape key. Locks body scroll while open.
function Lightbox({
  item,
  src,
  onClose,
}: {
  item: QuoteItem | null
  src: string | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!item) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && src && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} — full-size image`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-4 sm:p-8"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close image preview"
              className="absolute -top-2 -right-2 sm:top-2 sm:right-2 z-10 w-10 h-10 rounded-full bg-white text-brand-dark hover:bg-brand-accent-tint flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={src}
                alt={item.name}
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[80vh] object-contain"
                unoptimized={src.startsWith('http')}
                priority
              />
            </div>
            <p className="mt-3 font-sans text-sm font-medium text-white text-center">
              {item.name}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface Props {
  items: QuoteItem[]
  quantities: Record<string, number>
  onChange: (id: string, qty: number) => void
  error?: string
}

export default function EquipmentTable({ items, quantities, onChange, error }: Props) {
  const [preview, setPreview] = useState<{ item: QuoteItem; src: string } | null>(null)
  const grouped = items.reduce<Record<string, QuoteItem[]>>((acc, item) => {
    const list = acc[item.category] || (acc[item.category] = [])
    list.push(item)
    return acc
  }, {})
  // Tents lead (primary product), mattresses right below (premium sleep
  // option), then the rest of the sleep accessories (pads, mats, pillows,
  // blankets), then everything else alphabetical.
  const SLEEP_CATEGORIES = new Set(['pads', 'mats', 'pillows', 'blankets'])
  const tier = (c: string) => {
    const lc = c.toLowerCase().trim()
    if (lc.startsWith('tent')) return 0
    if (lc.startsWith('mattress')) return 1
    if (SLEEP_CATEGORIES.has(lc)) return 2
    return 3
  }
  const categories = Object.keys(grouped).sort((a, b) => {
    const ta = tier(a)
    const tb = tier(b)
    if (ta !== tb) return ta - tb
    return a.localeCompare(b)
  })

  // Tents start expanded (primary product). Other categories start collapsed
  // so the form isn't bulky. Track explicit toggles in state — anything not
  // explicitly toggled falls back to the default rule.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const isOpen = (cat: string): boolean => {
    if (cat in overrides) return overrides[cat]
    return cat.toLowerCase().startsWith('tent')
  }
  const toggle = (cat: string) => {
    setOverrides((prev) => ({ ...prev, [cat]: !isOpen(cat) }))
  }
  const selectedCount = (cat: string): number =>
    grouped[cat].filter((item) => (quantities[item.id] || 0) > 0).length

  return (
    <div>
      <p className="block font-sans text-sm font-semibold text-brand-dark mb-1.5">
        Equipment <span className="text-brand-accent">*</span>
        <span className="ml-2 text-brand-dark/40 font-normal">
          (Tap a category to set quantities)
        </span>
      </p>
      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const open = isOpen(cat)
          const count = selectedCount(cat)
          const sectionId = `equipment-${cat.replace(/\s+/g, '-').toLowerCase()}`
          return (
            <section key={cat} className="rounded-lg border border-brand-dark/15 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(cat)}
                aria-expanded={open}
                aria-controls={sectionId}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-brand-light/40 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-accent-readable capitalize">
                    {cat}
                  </span>
                  {count > 0 && (
                    <span className="font-sans text-[11px] font-semibold text-brand-dark bg-brand-accent-tint border border-brand-accent rounded-full px-2 py-0.5 leading-tight">
                      {count} selected
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-dark/60 transition-transform duration-200 ${
                    open ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={sectionId}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <ul className="border-t border-brand-dark/10 divide-y divide-brand-dark/10">
                      {grouped[cat].map((item) => {
                        const qty = quantities[item.id] || 0
                        const active = qty > 0
                        return (
                          <li
                            key={item.id}
                            className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors ${
                              active ? 'bg-brand-accent-tint/50' : ''
                            }`}
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <ItemThumb
                                item={item}
                                onOpen={(it, src) => setPreview({ item: it, src })}
                              />
                              <span
                                className={`font-sans text-sm truncate ${
                                  active
                                    ? 'text-brand-dark font-medium'
                                    : 'text-brand-dark/55'
                                }`}
                              >
                                {item.name}
                              </span>
                            </span>
                            <input
                              type="number"
                              min={0}
                              inputMode="numeric"
                              value={qty === 0 ? '' : qty}
                              placeholder="0"
                              onChange={(e) => {
                                const raw = e.target.value
                                if (raw === '') {
                                  onChange(item.id, 0)
                                  return
                                }
                                const n = parseInt(raw, 10)
                                onChange(item.id, Number.isFinite(n) && n >= 0 ? n : 0)
                              }}
                              aria-label={`Quantity for ${item.name}`}
                              className="w-20 rounded-md border border-brand-dark/15 bg-white px-3 py-2 font-sans text-base sm:text-sm text-brand-dark text-right outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                            />
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Lightbox
        item={preview?.item ?? null}
        src={preview?.src ?? null}
        onClose={() => setPreview(null)}
      />
    </div>
  )
}

export function EquipmentTableSkeleton() {
  return (
    <div>
      <div className="h-4 w-32 bg-brand-dark/10 rounded mb-3" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className="rounded-lg border border-brand-dark/15 bg-white px-4 py-3 flex items-center justify-between"
          >
            <div className="h-3 w-24 bg-brand-dark/10 rounded" />
            <div className="h-4 w-4 bg-brand-dark/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
