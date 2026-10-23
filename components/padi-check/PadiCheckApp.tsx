'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PadiCheckShell from './PadiCheckShell'
import ResultScreen from './ResultScreen'
import TypeACode from './TypeACode'
import { RESULTS } from '@/lib/padi-check/copy'
import { CODE_PREFIX } from '@/lib/padi-check/extract-code'
import { countsFrom, toScreen, type CheckReply, type ScreenContent } from '@/lib/padi-check/screen'

/** Server 8 s script timeout plus headroom; past this the gate shows offline. */
const CHECK_TIMEOUT_MS = 12_000
const STATS_EVERY_MS = 15_000

interface Shown extends ScreenContent {
  id: number
  /** The six characters checked, so Try again can repeat or correct them. */
  chars: string
}

/** The signed-in scanner: typed entry, the six result screens, the live count. */
export default function PadiCheckApp({ callHref }: { callHref: string | null }) {
  const router = useRouter()
  const [chars, setChars] = useState('')
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState<Shown | null>(null)
  const [counts, setCounts] = useState<{ checkedIn: number; total: number } | null>(null)
  const [fast, setFast] = useState<boolean | null>(null)
  const [focusKey, setFocusKey] = useState(0)
  const nextId = useRef(1)

  const signedOut = useCallback(() => router.refresh(), [router])

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/padi-check/stats', { cache: 'no-store' })
      if (res.status === 401) return signedOut()
      if (!res.ok) return
      const data = (await res.json()) as CheckReply & { fast?: unknown }
      const c = countsFrom(data)
      if (c) setCounts(c)
      if (typeof data.fast === 'boolean') setFast(data.fast)
    } catch {
      // A missed poll changes nothing on screen; the next one catches up.
    }
  }, [signedOut])

  useEffect(() => {
    // The count on load (and after a reload, AC-R006-01), then every 15 s and
    // whenever the phone wakes the page.
    const first = setTimeout(loadStats, 0)
    const timer = setInterval(loadStats, STATS_EVERY_MS)
    const onVisible = () => document.visibilityState === 'visible' && loadStats()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [loadStats])

  const check = useCallback(
    async (toCheck: string) => {
      if (busy) return
      setBusy(true)
      const code = CODE_PREFIX + toCheck
      let reply: CheckReply | null = null
      try {
        const res = await fetch('/api/padi-check/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
          cache: 'no-store',
        })
        if (res.status === 401) {
          setBusy(false)
          return signedOut()
        }
        reply = res.ok ? ((await res.json()) as CheckReply) : null
      } catch {
        reply = null
      }
      const c = countsFrom(reply)
      if (c) setCounts(c)
      setShown({ ...toScreen(reply, code), id: nextId.current++, chars: toCheck })
      setBusy(false)
    },
    [busy, signedOut],
  )

  const nextGuest = () => {
    setShown(null)
    setChars('')
    setFocusKey((k) => k + 1)
  }

  const retry = () => {
    if (!shown) return
    // Back to the box with the code still in it: to correct it after Not
    // found, or (offline) to send it again while the button says Checking.
    setChars(shown.chars)
    setShown(null)
    setFocusKey((k) => k + 1)
    if (shown.state === 'offline') check(shown.chars)
  }

  return (
    <PadiCheckShell counts={counts} fast={fast}>
      <p className="sr-only" aria-live="assertive">
        {shown ? RESULTS[shown.state].word : ''}
      </p>
      {shown ? (
        <ResultScreen
          state={shown.state}
          resultId={shown.id}
          name={shown.name}
          detail={shown.detail}
          callHref={callHref}
          onNext={nextGuest}
          onRetry={retry}
        >
          {shown.state === 'camera-off' && (
            <TypeACode value={chars} onChange={setChars} onSubmit={() => check(chars)} busy={busy} tone="dark" />
          )}
        </ResultScreen>
      ) : (
        <div className="mx-auto w-full max-w-[480px] px-5 py-8">
          <TypeACode
            value={chars}
            onChange={setChars}
            onSubmit={() => check(chars)}
            busy={busy}
            focusKey={focusKey}
          />
        </div>
      )}
    </PadiCheckShell>
  )
}
