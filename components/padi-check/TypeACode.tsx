'use client'

import { useEffect, useRef } from 'react'
import { ArrowRight, ScanBarcode } from 'lucide-react'
import { SCANNER_COPY } from '@/lib/padi-check/copy'
import { CODE_CHARS, CODE_PREFIX, cleanTypedCode } from '@/lib/padi-check/extract-code'

interface TypeACodeProps {
  /** The six characters after MAD-, as typed so far. */
  value: string
  onChange: (chars: string) => void
  onSubmit: () => void
  busy: boolean
  /** `dark` sits on the dark camera-off screen. */
  tone?: 'light' | 'dark'
  /** Visible label. Left out when a heading above already says it (`labelledBy`). */
  label?: string
  labelledBy?: string
  /** Element id; the camera-off screen and the code screen each need their own. */
  id?: string
  /**
   * Set, and changed, when the box should take focus. Left undefined while
   * the camera is in use, because focusing the box raises the phone keyboard
   * over the camera.
   */
  focusKey?: number
}

/** MAD- is printed; the volunteer types the six characters after it. */
export default function TypeACode({
  value,
  onChange,
  onSubmit,
  busy,
  tone = 'light',
  label,
  labelledBy,
  id = 'padi-code',
  focusKey,
}: TypeACodeProps) {
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusKey !== undefined) input.current?.focus()
  }, [focusKey])

  const ready = value.length === CODE_CHARS && !busy
  const dark = tone === 'dark'

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onSubmit()
      }}
    >
      {label && (
        <label htmlFor={id} className={`block font-sans text-lg font-semibold ${dark ? 'text-white' : 'text-brand-dark'}`}>
          {label}
        </label>
      )}
      <div className="flex h-16 items-center gap-1 rounded-2xl border-2 border-brand-accent/70 bg-white px-5 shadow-sm focus-within:border-brand-accent focus-within:ring-4 focus-within:ring-brand-accent/30">
        <span className="font-sans text-2xl font-bold text-brand-dark" aria-hidden="true">
          {CODE_PREFIX}
        </span>
        <input
          ref={input}
          id={id}
          value={value}
          onChange={(e) => onChange(cleanTypedCode(e.target.value))}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-labelledby={label ? undefined : labelledBy}
          aria-describedby={`${id}-prefix`}
          className="h-full min-w-0 flex-1 bg-transparent font-sans text-2xl font-bold tracking-[0.12em] text-brand-dark outline-none"
        />
        <ScanBarcode className="h-7 w-7 shrink-0 text-brand-dark/70" aria-hidden="true" />
        <span id={`${id}-prefix`} className="sr-only">
          after {CODE_PREFIX}
        </span>
      </div>
      <button
        type="submit"
        disabled={!ready}
        aria-busy={busy}
        className={`flex h-16 w-full items-center justify-center gap-3 rounded-full font-sans text-xl font-bold shadow-lg disabled:opacity-60 focus:outline-none focus-visible:ring-4 ${
          dark
            ? 'bg-[#4ade80] text-brand-dark focus-visible:ring-white/60'
            : 'bg-gradient-to-b from-[#14563f] to-brand-dark text-white focus-visible:ring-brand-accent/50'
        }`}
      >
        {busy ? SCANNER_COPY.checking : SCANNER_COPY.check}
        {!busy && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
      </button>
    </form>
  )
}
