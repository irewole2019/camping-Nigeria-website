import { ChartNoAxesColumn, Zap } from 'lucide-react'
import { SCANNER_COPY } from '@/lib/padi-check/copy'

/**
 * "4 of 80 · FAST": the live count and whether the gate memory is answering.
 * `glass` sits on a coloured result screen; `light` on the cream code screen.
 */
export default function StatusPill({
  counts,
  fast,
  tone,
}: {
  counts: { checkedIn: number; total: number } | null
  fast: boolean | null
  tone: 'glass' | 'light'
}) {
  if (!counts && fast === null) return <span className="h-11" aria-hidden="true" />
  const shell = tone === 'glass' ? 'bg-black/40 text-white' : 'bg-brand-dark text-white'
  return (
    <span className={`inline-flex h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 font-sans ${shell}`}>
      {counts && (
        <span className="text-base font-semibold" aria-live="polite" aria-label={SCANNER_COPY.countLabel(counts.checkedIn, counts.total)}>
          {SCANNER_COPY.count(counts.checkedIn, counts.total)}
        </span>
      )}
      {/* Brand colours (2026-10-26): Fast is calm, cream with a gold bolt;
          Slow is the one that should catch the eye, a solid gold label. */}
      {fast === true && (
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-light">
          <Zap className="h-4 w-4 fill-brand-accent text-brand-accent" aria-hidden="true" />
          {SCANNER_COPY.fast}
        </span>
      )}
      {fast === false && (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-dark">
          <ChartNoAxesColumn className="h-4 w-4" aria-hidden="true" />
          {SCANNER_COPY.slow}
        </span>
      )}
    </span>
  )
}
