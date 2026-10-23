'use client'

import { useEffect, useRef } from 'react'
import { SCANNER_COPY } from '@/lib/padi-check/copy'
import { CODE_CHARS, CODE_PREFIX, cleanTypedCode } from '@/lib/padi-check/extract-code'

interface TypeACodeProps {
  /** The six characters after MAD-, as typed so far. */
  value: string
  onChange: (chars: string) => void
  onSubmit: () => void
  busy: boolean
  /** `dark` sits on a coloured result field (the camera-off state). */
  tone?: 'light' | 'dark'
  /** Changes when the box should take focus again (after Next guest or Try again). */
  focusKey?: number
}

/** "Type a code", always available: MAD- is printed, the volunteer types the six after it. */
export default function TypeACode({ value, onChange, onSubmit, busy, tone = 'light', focusKey }: TypeACodeProps) {
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input.current?.focus()
  }, [focusKey])

  const ready = value.length === CODE_CHARS && !busy
  const dark = tone === 'dark'

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onSubmit()
      }}
    >
      <label
        htmlFor="padi-code"
        className={`block font-sans text-lg font-semibold ${dark ? 'text-white' : 'text-brand-dark'}`}
      >
        {SCANNER_COPY.typeACode}
      </label>
      <div className="flex h-14 items-center rounded-lg border border-brand-dark/15 bg-white px-4 focus-within:ring-4 focus-within:ring-brand-accent/60">
        <span className="font-sans text-2xl font-semibold text-brand-dark/60" aria-hidden="true">
          {CODE_PREFIX}
        </span>
        <input
          ref={input}
          id="padi-code"
          value={value}
          onChange={(e) => onChange(cleanTypedCode(e.target.value))}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-describedby="padi-code-prefix"
          className="h-full w-full bg-transparent font-sans text-2xl font-semibold tracking-[0.15em] text-brand-dark outline-none"
        />
        <span id="padi-code-prefix" className="sr-only">
          after {CODE_PREFIX}
        </span>
      </div>
      <button
        type="submit"
        disabled={!ready}
        aria-busy={busy}
        className={`flex h-14 w-full items-center justify-center rounded-lg font-sans text-lg font-semibold disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/60 ${
          dark ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'
        }`}
      >
        {busy ? SCANNER_COPY.checking : SCANNER_COPY.check}
      </button>
    </form>
  )
}
