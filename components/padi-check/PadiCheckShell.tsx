import type { ReactNode } from 'react'
import { SCANNER_COPY } from '@/lib/padi-check/copy'

interface PadiCheckShellProps {
  /** Null until the first count arrives. */
  counts: { checkedIn: number; total: number } | null
  /** Null until known. False means every check is going to the slow sheet. */
  fast: boolean | null
  children: ReactNode
}

/** The forest-green bar the volunteer always sees: name, count, and Fast or Slow. */
export default function PadiCheckShell({ counts, fast, children }: PadiCheckShellProps) {
  return (
    <div className="min-h-dvh bg-brand-light">
      <header className="flex h-14 items-center justify-between gap-4 bg-brand-dark px-5 text-white">
        <span className="font-serif text-xl">{SCANNER_COPY.wordmark}</span>
        <span className="flex items-baseline gap-3 font-sans">
          {counts && (
            <span className="text-lg font-semibold" aria-live="polite">
              {SCANNER_COPY.count(counts.checkedIn, counts.total)}
            </span>
          )}
          {fast !== null && (
            <span className={`text-sm font-semibold ${fast ? 'text-white/70' : 'text-brand-accent'}`}>
              {fast ? SCANNER_COPY.fast : SCANNER_COPY.slow}
            </span>
          )}
        </span>
      </header>
      <main id="main-content">{children}</main>
    </div>
  )
}
