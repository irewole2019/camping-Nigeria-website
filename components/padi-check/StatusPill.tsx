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
  const shell = tone === 'glass' ? 'bg-black/25 text-white' : 'bg-brand-dark text-white'
  return (
    <span className={`inline-flex h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 font-sans ${shell}`}>
      {counts && (
        <span className="text-base font-semibold" aria-live="polite" aria-label={SCANNER_COPY.countLabel(counts.checkedIn, counts.total)}>
          {SCANNER_COPY.count(counts.checkedIn, counts.total)}
        </span>
      )}
      {fast !== null && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${fast ? 'text-[#4ade80]' : 'text-brand-accent'}`}
        >
          {fast ? (
            <Zap className="h-4 w-4 fill-current" aria-hidden="true" />
          ) : (
            <ChartNoAxesColumn className="h-4 w-4" aria-hidden="true" />
          )}
          {fast ? SCANNER_COPY.fast : SCANNER_COPY.slow}
        </span>
      )}
    </span>
  )
}
