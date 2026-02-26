import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-[10rem] font-bold leading-none tracking-tight sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/70">
          Sorry, we could not find the page you are looking for. It may have been moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-accent px-6 py-3 font-semibold text-brand-dark transition hover:opacity-90"
          >
            Go back home
          </Link>
          <Link
            href="/schools"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explore school programmes
          </Link>
        </div>
      </div>
    </main>
  )
}
