'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Phone,
  QrCode,
  RefreshCw,
  Tent,
  WifiOff,
  X,
} from 'lucide-react'
import StatusPill from './StatusPill'
import { BUTTON_COPY, DETAIL_COPY, RESULTS, SCANNER_COPY, type ResultButton } from '@/lib/padi-check/copy'
import { initials, type ScreenContent } from '@/lib/padi-check/screen'

/**
 * One answer per screen, in the founder's design (2026-10-25): a full-height
 * gradient in the state's colour, a picture (the guest's initials, or an icon
 * in a ring), the big word, the details in soft tiles, and pill buttons.
 * The word carries the meaning, so every state still reads in greyscale.
 */

interface ResultScreenProps {
  content: ScreenContent
  /** Changes once per result. The buzz and the focus move follow it, not re-renders. */
  resultId: number
  counts: { checkedIn: number; total: number } | null
  fast: boolean | null
  /** Null leaves "Call Toyosi" out (number not configured). */
  callHref: string | null
  onNext?: () => void
  onRetry?: () => void
  /** The back arrow: back to scanning. Left out on the camera-off screen. */
  onBack?: () => void
  /** Extra content under the detail: the camera-off screen puts the type box here. */
  children?: ReactNode
}

const ring = 'flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/35 bg-white/10'

function Picture({ content }: { content: ScreenContent }) {
  const { state, name } = content
  if (state === 'welcome' || state === 'already') {
    const welcome = state === 'welcome'
    return (
      <div className="relative">
        {welcome && <Confetti />}
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/40 bg-white/20 font-sans text-5xl font-bold text-white">
          {initials(name) || '?'}
        </div>
        <span
          className={`absolute -bottom-1 -right-1 flex h-12 w-12 items-center justify-center rounded-full border-4 ${
            welcome ? 'border-[#0f6a34] bg-[#4ade80] text-[#0b5a2b]' : 'border-[#a8360a] bg-[#fdba74] text-[#8a2c07]'
          }`}
          aria-hidden="true"
        >
          {welcome ? <Check className="h-6 w-6" strokeWidth={3} /> : <Clock className="h-6 w-6" strokeWidth={2.5} />}
        </span>
      </div>
    )
  }
  if (state === 'camera-off') {
    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/10" aria-hidden="true">
        <QrCode className="h-16 w-16 text-white" />
      </div>
    )
  }
  return (
    <div className={ring} aria-hidden="true">
      {state === 'not-found' && <X className="h-14 w-14 text-white" strokeWidth={2.5} />}
      {state === 'not-paid' && <span className="font-sans text-6xl font-bold leading-none text-white">!</span>}
      {state === 'offline' && <WifiOff className="h-14 w-14 text-white" strokeWidth={2.25} />}
    </div>
  )
}

/** Static flecks around the welcome picture, as drawn. No animation. */
function Confetti() {
  const bits = [
    { c: '#86efac', s: '-left-14 top-2 rotate-45' },
    { c: '#fde047', s: '-left-10 top-12 rotate-12' },
    { c: '#bef264', s: '-left-14 top-24 -rotate-12' },
    { c: '#5eead4', s: '-right-14 top-2 -rotate-45' },
    { c: '#fde047', s: '-right-10 top-14 -rotate-12' },
    { c: '#bef264', s: '-right-14 top-24 rotate-12' },
  ]
  return (
    <span aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} className={`absolute h-1.5 w-6 rounded-full ${b.s}`} style={{ backgroundColor: b.c }} />
      ))}
    </span>
  )
}

function Tile({ icon, title, sub, className = '' }: { icon: ReactNode; title: string; sub?: string; className?: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-black/15 px-3.5 py-3.5 text-left ${className}`}>
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[15px] font-semibold leading-snug">{title}</span>
        {sub && <span className="block font-sans text-sm leading-snug">{sub}</span>}
      </span>
    </div>
  )
}

function CodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/20 px-5 py-4">
      <span className="font-sans text-2xl font-semibold tracking-[0.08em]">{code}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => setCopied(true), () => {})
        }}
        className="flex h-11 w-11 items-center justify-center rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        aria-label={copied ? DETAIL_COPY.copied : DETAIL_COPY.copyCode}
      >
        {copied ? <Check className="h-6 w-6" aria-hidden="true" /> : <Copy className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default function ResultScreen({
  content,
  resultId,
  counts,
  fast,
  callHref,
  onNext,
  onRetry,
  onBack,
  children,
}: ResultScreenProps) {
  const { state } = content
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
      'flex h-16 w-full items-center justify-center gap-3 rounded-full px-5 font-sans text-xl font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70'
    if (b === 'call') {
      return (
        <a key={b} href={callHref ?? undefined} className={`${base} border-2 border-white/70 text-white`}>
          <Phone className="h-5 w-5 fill-current" aria-hidden="true" />
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
        className={`${base} bg-white text-slate-900 shadow-lg`}
      >
        {b === 'retry' && <RefreshCw className="h-5 w-5" aria-hidden="true" />}
        {BUTTON_COPY[b]}
        {b === 'next' && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
      </button>
    )
  }

  return (
    <section
      className="flex min-h-dvh flex-col text-white"
      style={{ backgroundImage: `radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.05), transparent 60%), linear-gradient(to bottom, ${spec.from}, ${spec.to})` }}
      aria-labelledby="padi-result-word"
    >
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pb-8 pt-4">
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              aria-label={SCANNER_COPY.back}
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </button>
          ) : (
            <span className="h-11 w-11" aria-hidden="true" />
          )}
          <StatusPill counts={counts} fast={fast} tone="glass" />
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <Picture content={content} />
          <h2 id="padi-result-word" className="mt-6 font-sans text-[2.6rem] font-bold leading-[1.08] text-balance">
            {spec.word}
          </h2>
          {content.name && <p className="mt-3 break-words font-sans text-[1.75rem] font-semibold leading-tight">{content.name}</p>}
        </div>

        <div className="mt-6 space-y-4">
          {state === 'welcome' && (
            // The ticket tile takes the room it needs; the time tile is short.
            <div className="flex gap-3">
              <Tile
                className="flex-[1.6]"
                icon={<Tent className="h-7 w-7" />}
                title={content.ticket ?? content.tent ?? ''}
                sub={content.ticket ? content.tent : undefined}
              />
              {content.time && (
                <Tile className="flex-1" icon={<Clock className="h-7 w-7" />} title={content.time} sub={DETAIL_COPY.checkInTime} />
              )}
            </div>
          )}
          {state === 'already' && content.time && (
            <Tile icon={<Clock className="h-8 w-8" />} title={DETAIL_COPY.checkedInAt(content.time)} />
          )}
          {state === 'not-found' && content.code && <CodeBox code={content.code} />}
          {content.detail && (
            <p className={`font-sans text-lg leading-snug ${state === 'not-found' ? 'text-left' : 'text-center'}`}>{content.detail}</p>
          )}
          {children}
        </div>

        {buttons.length > 0 && <div className="mt-auto space-y-3 pt-8">{buttons.map(renderButton)}</div>}
      </div>
    </section>
  )
}
