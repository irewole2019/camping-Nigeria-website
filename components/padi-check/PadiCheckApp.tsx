'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Lightbulb } from 'lucide-react'
import PadiCheckShell from './PadiCheckShell'
import PadiLogo from './PadiLogo'
import ResultScreen from './ResultScreen'
import Scanner from './Scanner'
import StatusPill from './StatusPill'
import TypeACode from './TypeACode'
import { DETAIL_COPY, RESULTS, SCANNER_COPY } from '@/lib/padi-check/copy'
import { CODE_PREFIX, extractCode } from '@/lib/padi-check/extract-code'
import { countsFrom, toScreen, type CheckReply, type ScreenContent } from '@/lib/padi-check/screen'

/** Server 8 s script timeout plus headroom; past this the gate shows offline. */
const CHECK_TIMEOUT_MS = 12_000
const STATS_EVERY_MS = 15_000

interface Shown extends ScreenContent {
  id: number
  /** The six characters checked, so Try again can repeat or correct them. */
  chars: string
}

/** The signed-in scanner: camera, typed entry, the result screens, the live count. */
export default function PadiCheckApp({ callHref }: { callHref: string | null }) {
  const router = useRouter()
  const [chars, setChars] = useState('')
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState<Shown | null>(null)
  const [counts, setCounts] = useState<{ checkedIn: number; total: number } | null>(null)
  const [fast, setFast] = useState<boolean | null>(null)
  // Undefined until typing is what is happening (see TypeACode).
  const [focusKey, setFocusKey] = useState<number | undefined>(undefined)
  // Assumed on until the camera says otherwise.
  const [camera, setCamera] = useState<'on' | 'off' | 'unsupported'>('on')
  // Bumped by "Turn on camera" to ask the scanner to try again.
  const [cameraRetry, setCameraRetry] = useState(0)
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

  /** A QR the camera read. No MAD code in it: not-found, without asking anyone. */
  const onScan = (text: string) => {
    const code = extractCode(text)
    if (code) {
      check(code.slice(CODE_PREFIX.length))
      return
    }
    setShown({ state: 'not-found', code: text.trim().slice(0, 24), detail: DETAIL_COPY.notFound, id: nextId.current++, chars: '' })
  }

  const onCameraOff = (unsupported: boolean) => setCamera(unsupported ? 'unsupported' : 'off')

  const nextGuest = () => {
    setShown(null)
    setChars('')
    // Typing only: with the camera on, focusing the box would raise the
    // keyboard over the camera.
    if (camera !== 'on') setFocusKey((k) => (k ?? 0) + 1)
  }

  const retry = () => {
    if (!shown) return
    // Back to the box with the code still in it: to correct it after Not
    // found, or (offline) to send it again while the button says Checking.
    setChars(shown.chars)
    setShown(null)
    if (shown.chars) setFocusKey((k) => (k ?? 0) + 1)
    if (shown.state === 'offline' && shown.chars) check(shown.chars)
  }

  const cameraOff = camera !== 'on'
  const onIphone = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)

  return (
    <PadiCheckShell>
      <p className="sr-only" aria-live="assertive">
        {shown ? RESULTS[shown.state].word : ''}
      </p>

      {shown && (
        <ResultScreen
          content={shown}
          resultId={shown.id}
          counts={counts}
          fast={fast}
          callHref={callHref}
          onNext={nextGuest}
          onRetry={retry}
          onBack={nextGuest}
        />
      )}

      {!shown && cameraOff && (
        <ResultScreen
          content={{ state: 'camera-off', detail: DETAIL_COPY.cameraOff }}
          resultId={0}
          counts={counts}
          fast={fast}
          callHref={callHref}
        >
          {camera === 'unsupported' && onIphone && (
            <p className="text-center font-sans text-lg font-semibold">{DETAIL_COPY.openInSafari}</p>
          )}
          <div className="pt-2">
            <TypeACode
              value={chars}
              onChange={setChars}
              onSubmit={() => check(chars)}
              busy={busy}
              tone="dark"
              id="padi-code-off"
              label={SCANNER_COPY.typeACode}
              focusKey={focusKey ?? 0}
            />
          </div>
          {camera === 'off' && (
            <button
              type="button"
              onClick={() => setCameraRetry((n) => n + 1)}
              className="flex w-full items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                <Camera className="h-7 w-7" />
              </span>
              <span>
                <span className="block font-sans text-lg font-bold">{DETAIL_COPY.turnOnCamera}</span>
                <span className="block font-sans text-sm">{DETAIL_COPY.turnOnCameraHint}</span>
              </span>
            </button>
          )}
        </ResultScreen>
      )}

      {/* Kept mounted under the results, so the camera is not restarted for every guest. */}
      <div className={`mx-auto w-full max-w-[480px] px-5 pb-10 pt-4 ${shown || cameraOff ? 'hidden' : ''}`}>
        {/* Name on the left, pill on the right: a centred title and the pill do not both fit on a phone. */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 font-sans text-2xl font-bold text-brand-dark">
            <PadiLogo className="h-8 w-auto" />
            {SCANNER_COPY.wordmark}
          </h1>
          <StatusPill counts={counts} fast={fast} tone="light" />
        </div>

        <div className="mt-6">
          <Scanner
            active={!shown && !busy && !cameraOff}
            retryKey={cameraRetry}
            onScan={onScan}
            onCameraOff={onCameraOff}
            onCameraOn={() => setCamera('on')}
          />
        </div>

        <div className="my-7 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-brand-dark/15" />
          <span className="font-sans text-lg text-brand-dark/60">{SCANNER_COPY.or}</span>
          <span className="h-px flex-1 bg-brand-dark/15" />
        </div>

        <h2 id="padi-enter-code" className="font-sans text-[1.75rem] font-bold leading-tight text-brand-dark">
          {SCANNER_COPY.enterCode}
        </h2>
        <p className="mb-5 mt-1 font-sans text-lg text-brand-dark/65">{SCANNER_COPY.enterCodeHint}</p>
        <TypeACode
          value={chars}
          onChange={setChars}
          onSubmit={() => check(chars)}
          busy={busy}
          labelledBy="padi-enter-code"
          focusKey={focusKey}
        />

        <div className="mt-7 flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-50" aria-hidden="true">
            <Lightbulb className="h-7 w-7 fill-amber-300 text-amber-500" />
          </span>
          <span>
            <span className="block font-sans text-lg font-bold text-brand-dark">{SCANNER_COPY.tipTitle}</span>
            <span className="block font-sans text-base text-brand-dark/70">{SCANNER_COPY.tipText}</span>
          </span>
        </div>
      </div>
    </PadiCheckShell>
  )
}
