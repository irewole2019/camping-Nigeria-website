import { after, NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { GATE_RATE_LIMIT, readSession } from '@/lib/padi-check/auth'
import { gateCounts, getGateStore, maintainGate } from '@/lib/padi-check/gate'
import { sheet } from '@/lib/padi-check/sheet'

export const dynamic = 'force-dynamic'

/**
 * GET → { checkedIn, total }, or { status: 'offline' } with 503. Volunteer or
 * admin session. The scanner polls this, so it is also what keeps the gate's
 * memory fresh and retries sheet writes between scans.
 */
export async function GET(request: NextRequest) {
  const session = readSession(request)
  if (!session) return NextResponse.json({ error: 'Sign in again.' }, { status: 401 })

  const limit = await checkRateLimit(request, 'stats', { ...GATE_RATE_LIMIT, identifier: session.id })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Wait a minute.' }, { status: 429 })
  }

  const counts = await gateCounts(getGateStore(), sheet)
  after(maintainGate)
  if (!counts) return NextResponse.json({ status: 'offline' }, { status: 503 })
  return NextResponse.json(counts, { headers: { 'Cache-Control': 'no-store' } })
}
