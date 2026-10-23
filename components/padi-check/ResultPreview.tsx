'use client'

import Link from 'next/link'
import { useState } from 'react'
import PadiCheckShell from './PadiCheckShell'
import ResultScreen from './ResultScreen'
import TypeACode from './TypeACode'
import { DETAIL_COPY, RESULTS, type ResultState } from '@/lib/padi-check/copy'
import { toScreen } from '@/lib/padi-check/screen'

/** Made-up guests only. */
const FIXTURES: Record<ResultState, ReturnType<typeof toScreen>> = {
  welcome: toScreen({ status: 'welcome', name: 'Ada Obi', ticket: 'Sleepover single (1 person)', usesTent: true }, 'MAD-B8K2MQ'),
  already: toScreen({ status: 'already', name: 'Ada Obi', checkedInAt: '2026-10-31T19:05:00' }, 'MAD-B8K2MQ'),
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
  const shown = FIXTURES[state]
  return (
    <PadiCheckShell counts={{ checkedIn: 12, total: 80 }} fast={state !== 'offline'}>
      <ResultScreen
        state={state}
        resultId={states.indexOf(state)}
        name={shown.name}
        detail={shown.detail}
        callHref={callHref}
        onNext={() => {}}
        onRetry={() => {}}
      >
        {state === 'camera-off' && (
          <TypeACode value={chars} onChange={setChars} onSubmit={() => {}} busy={false} tone="dark" />
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
