'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DETAIL_COPY, LOGIN_COPY, RESULTS } from '@/lib/padi-check/copy'

/** Surface 4: the volunteer's password, nothing else. */
export default function PadiLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
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
        setError(data?.error ?? `${RESULTS.offline.word}. ${DETAIL_COPY.offline}.`)
      }
    } catch {
      setError(`${RESULTS.offline.word}. ${DETAIL_COPY.offline}.`)
    }
    setSending(false)
  }

  return (
    <main id="main-content" className="min-h-dvh bg-brand-dark text-white">
      <div className="mx-auto flex w-full max-w-[480px] flex-col px-5 py-16">
        <h1 className="font-serif text-5xl">{LOGIN_COPY.title}</h1>
        <p className="mt-2 font-sans text-lg text-white/80">{LOGIN_COPY.subtitle}</p>

        <form onSubmit={submit} className="mt-12 space-y-3">
          <label htmlFor="padi-password" className="block font-sans text-lg font-semibold">
            {LOGIN_COPY.passwordLabel}
          </label>
          <input
            id="padi-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'padi-login-error' : undefined}
            className="h-14 w-full rounded-lg border border-white/20 bg-white px-4 font-sans text-lg text-brand-dark outline-none focus:ring-4 focus:ring-brand-accent/60"
          />
          {error && (
            <p id="padi-login-error" role="alert" className="font-sans text-base text-brand-accent">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!password || sending}
            className="flex h-14 w-full items-center justify-center rounded-lg bg-white font-sans text-lg font-semibold text-brand-dark disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/60"
          >
            {LOGIN_COPY.submit}
          </button>
        </form>
      </div>
    </main>
  )
}
