'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import PadiLogo from './PadiLogo'
import { DETAIL_COPY, LOGIN_COPY, RESULTS } from '@/lib/padi-check/copy'

/** Surface 4 in the founder's design (2026-10-25): the volunteer's password, nothing else. */
export default function PadiLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/padi-check/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: 'volunteer' }),
      })
      if (res.ok) {
        router.refresh()
        return
      }
      if (res.status === 401) {
        setError(LOGIN_COPY.wrongPassword)
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? `${RESULTS.offline.word}. ${DETAIL_COPY.offline}`)
      }
    } catch {
      setError(`${RESULTS.offline.word}. ${DETAIL_COPY.offline}`)
    }
    setSending(false)
  }

  return (
    <main id="main-content" className="relative min-h-dvh overflow-hidden bg-[#0a2a1f] text-white">
      {/* A community photo under a dark green wash, as in the design. */}
      <Image
        src="/images/community/hero-poster.webp"
        alt=""
        fill
        priority
        sizes="480px"
        className="object-cover object-center opacity-80 blur-[1.5px]"
      />
      {/* Solid behind the logo and the card; the photo shows through below them. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(to bottom, #0a2a1f 0%, rgba(10,42,31,0.96) 40%, rgba(10,42,31,0.6) 68%, rgba(10,42,31,0.35) 85%, rgba(10,42,31,0.75) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pb-8 pt-14">
        <div className="flex flex-col items-center text-center">
          <PadiLogo tone="bright" className="h-20 w-auto" />
          <h1 className="mt-5 font-sans text-[3.25rem] leading-none">
            <span className="font-bold">{LOGIN_COPY.wordmarkBold}</span>{' '}
            <span className="font-normal">{LOGIN_COPY.wordmarkLight}</span>
          </h1>
          <p className="mt-4 max-w-[18rem] font-sans text-lg leading-snug text-white/85">{LOGIN_COPY.tagline}</p>
        </div>

        <form
          onSubmit={submit}
          className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md"
        >
          <label htmlFor="padi-password" className="block font-sans text-lg font-semibold">
            {LOGIN_COPY.passwordLabel}
          </label>
          <div className="flex h-16 items-center rounded-2xl bg-[#eef2f7] pr-2 focus-within:ring-4 focus-within:ring-[#4ade80]/50">
            <input
              id="padi-password"
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'padi-login-error' : undefined}
              className="h-full min-w-0 flex-1 bg-transparent px-5 font-sans text-xl text-slate-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4ade80]/60"
              aria-label={visible ? LOGIN_COPY.hidePassword : LOGIN_COPY.showPassword}
              aria-pressed={visible}
            >
              {visible ? <EyeOff className="h-6 w-6" aria-hidden="true" /> : <Eye className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
          {error && (
            <p id="padi-login-error" role="alert" className="font-sans text-base font-semibold text-[#fde68a]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!password || sending}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#6ee7a0] to-[#4ade80] font-sans text-xl font-bold text-brand-dark shadow-lg disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            {LOGIN_COPY.submit}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>

        <p className="mx-auto mt-auto inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-3 font-sans text-base backdrop-blur-sm">
          <ShieldCheck className="h-5 w-5 text-[#4ade80]" aria-hidden="true" />
          {LOGIN_COPY.volunteerOnly}
        </p>
      </div>
    </main>
  )
}
