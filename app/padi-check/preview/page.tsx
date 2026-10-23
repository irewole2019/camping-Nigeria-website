import { notFound, redirect } from 'next/navigation'
import ResultPreview from '@/components/padi-check/ResultPreview'
import { callHref, getPageSession } from '@/lib/padi-check/auth'
import type { ResultState } from '@/lib/padi-check/copy'

export const dynamic = 'force-dynamic'

const STATES: ResultState[] = ['welcome', 'already', 'not-found', 'not-paid', 'offline', 'camera-off']

/**
 * Every result screen with made-up guests, for checking them on a real phone
 * outdoors at night before the event (build sequence step 1). Signed-in only,
 * and never on the production site.
 */
export default async function PadiCheckPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  if (!(await getPageSession())) redirect('/padi-check')
  const { state } = await searchParams
  const current = STATES.includes(state as ResultState) ? (state as ResultState) : 'welcome'
  return <ResultPreview state={current} states={STATES} callHref={callHref()} />
}
