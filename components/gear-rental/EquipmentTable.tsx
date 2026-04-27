'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { QuoteItem } from '@/lib/quote-config'

interface Props {
  items: QuoteItem[]
  quantities: Record<string, number>
  onChange: (id: string, qty: number) => void
  error?: string
}

export default function EquipmentTable({ items, quantities, onChange, error }: Props) {
  const grouped = items.reduce<Record<string, QuoteItem[]>>((acc, item) => {
    const list = acc[item.category] || (acc[item.category] = [])
    list.push(item)
    return acc
  }, {})
  // Tents lead (primary product), then sleep accessories (pads, pillows,
  // blankets) directly below them. Everything else alphabetical after.
  const SLEEP_CATEGORIES = new Set(['pads', 'mats', 'pillows', 'blankets'])
  const tier = (c: string) => {
    const lc = c.toLowerCase().trim()
    if (lc.startsWith('tent')) return 0
    if (SLEEP_CATEGORIES.has(lc)) return 1
    return 2
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
                            <span
                              className={`font-sans text-sm ${
                                active
                                  ? 'text-brand-dark font-medium'
                                  : 'text-brand-dark/55'
                              }`}
                            >
                              {item.name}
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
