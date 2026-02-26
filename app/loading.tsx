export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-light">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
      <p className="mt-4 text-lg font-medium text-brand-dark">Loading...</p>
    </main>
  )
}
