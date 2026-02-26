'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center text-white">
      <h1 className="text-4xl font-bold sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-lg text-white/70">
        An unexpected error occurred. Please try again, or return to the home page.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-brand-accent px-6 py-3 font-semibold text-brand-dark transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
