'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { BUTTON_COPY, RESULTS, type ResultButton, type ResultState } from '@/lib/padi-check/copy'

/**
 * One answer per screen (usl-build/6-landing-page-build-sequence.md, P1):
 * a full colour field, one big word, the detail lines, then full-width 56px
 * buttons. The word carries the meaning, so each state reads in greyscale.
 * No icons, cards, gradients, animation or sound.
 */

interface ResultScreenProps {
  state: ResultState
  /** Changes once per result. The buzz and the focus move follow it, not re-renders. */
  resultId: number
  /** The guest's name, or the code that was not found. At least 24px. */
  name?: string
  /** Ticket and tent, arrival time, or advice. */
  detail?: string
  /** Null leaves "Call Toyosi" out (number not configured). */
  callHref: string | null
  onNext?: () => void
  onRetry?: () => void
  /** Shown below the detail; the camera-off state puts the type box here. */
  children?: ReactNode
}

export default function ResultScreen({
  state,
  resultId,
  name,
  detail,
  callHref,
  onNext,
  onRetry,
  children,
}: ResultScreenProps) {
  const spec = RESULTS[state]
  const primary = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // One buzz per result, where the phone supports it (Android; not iPhone).
    // The camera-off screen is a standing state, not a scan result: no buzz.
    if (state !== 'camera-off' && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(200)
    primary.current?.focus()
  }, [resultId, state])

  const buttons = spec.buttons.filter((b) => b !== 'call' || callHref)
  const last = buttons[buttons.length - 1]

  const renderButton = (b: ResultButton) => {
    const base =
      'flex h-14 w-full items-center justify-center rounded-lg px-4 font-sans text-lg font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70'
    if (b === 'call') {
      return (
        <a key={b} href={callHref ?? undefined} className={`${base} border-2 border-white text-white`}>
          {BUTTON_COPY.call}
        </a>
      )
    }
    return (
      <button
        key={b}
        ref={b === last ? primary : undefined}
        type="button"
        onClick={b === 'next' ? onNext : onRetry}
        className={`${base} bg-white text-brand-dark`}
      >
        {BUTTON_COPY[b]}
      </button>
    )
  }

  return (
    <section
      className="flex min-h-[calc(100dvh-3.5rem)] flex-col text-white"
      style={{ backgroundColor: spec.colour }}
      aria-labelledby="padi-result-word"
    >
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between gap-10 px-5 py-8">
        <div>
          <h2 id="padi-result-word" className="font-serif text-[2.75rem] leading-[1.05] sm:text-5xl">
            {spec.word}
          </h2>
          {(name || detail) && (
            <div className="mt-6 space-y-2">
              {name && <p className="break-words font-sans text-2xl font-semibold">{name}</p>}
              {detail && <p className="font-sans text-lg">{detail}</p>}
            </div>
          )}
          {children}
        </div>
        {buttons.length > 0 && <div className="space-y-3">{buttons.map(renderButton)}</div>}
      </div>
    </section>
  )
}
