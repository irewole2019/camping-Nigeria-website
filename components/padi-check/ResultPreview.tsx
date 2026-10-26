'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Camera } from 'lucide-react'
import PadiCheckShell from './PadiCheckShell'
import ResultScreen from './ResultScreen'
import TypeACode from './TypeACode'
import { DETAIL_COPY, RESULTS, SCANNER_COPY, type ResultState } from '@/lib/padi-check/copy'
import { toScreen, type ScreenContent } from '@/lib/padi-check/screen'

/** Made-up guests only. */
const FIXTURES: Record<ResultState, ScreenContent> = {
  welcome: toScreen(
    // A couple, so the preview shows both tribe tiles.
    { status: 'welcome', name: 'Ada Obi', ticket: 'Sleepover couple (2 in a tent)', usesTent: true, tribe: 'Kutinga', partnerName: 'Tunde Bello', partnerTribe: 'Mandi', checkedInAt: '2026-10-31T19:05:00' },
    'MAD-B8K2MQ',
  ),
  already: toScreen({ status: 'already', name: 'Ada Obi', tribe: 'Kutinga', checkedInAt: '2026-10-31T19:05:00' }, 'MAD-B8K2MQ'),
  'not-found': toScreen({ status: 'not-found' }, 'MAD-B8K2MQ'),
  'not-paid': toScreen({ status: 'not-paid', name: 'Bayo Adeyemi' }, 'MAD-B8K2MQ'),
  offline: toScreen(null, 'MAD-B8K2MQ'),
  'camera-off': { state: 'camera-off', detail: DETAIL_COPY.cameraOff },
}

export default function ResultPreview({
  state,
  states,
  callHref,
}: {
  state: ResultState
  states: ResultState[]
  callHref: string | null
}) {
  const [chars, setChars] = useState('')
  return (
    <PadiCheckShell>
      <ResultScreen
        content={FIXTURES[state]}
        resultId={states.indexOf(state) + 1}
        counts={{ checkedIn: 12, total: 80 }}
        fast={state !== 'offline'}
        callHref={callHref}
        onNext={() => {}}
        onRetry={() => {}}
        onBack={state === 'camera-off' ? undefined : () => {}}
      >
        {state === 'camera-off' && (
          <>
            <div className="pt-2">
              <TypeACode value={chars} onChange={setChars} onSubmit={() => {}} busy={false} tone="dark" id="padi-code-off" label={SCANNER_COPY.typeACode} />
            </div>
            <div className="flex w-full items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                <Camera className="h-7 w-7" />
              </span>
              <span>
                <span className="block font-sans text-lg font-bold">{DETAIL_COPY.turnOnCamera}</span>
                <span className="block font-sans text-sm">{DETAIL_COPY.turnOnCameraHint}</span>
              </span>
            </div>
          </>
        )}
      </ResultScreen>
      <nav className="mx-auto grid max-w-[480px] grid-cols-2 gap-2 px-5 py-6 font-sans text-sm">
        {states.map((s) => (
          <Link
            key={s}
            href={`/padi-check/preview?state=${s}`}
            className={`rounded-lg border border-brand-dark/15 px-3 py-3 text-center ${s === state ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark'}`}
          >
            {RESULTS[s].word}
          </Link>
        ))}
      </nav>
    </PadiCheckShell>
  )
}
