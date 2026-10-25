import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { GATE_RATE_LIMIT, readSession } from '@/lib/padi-check/auth'
import { toPrintedList } from '@/lib/padi-check/roster'
import { hasRole } from '@/lib/padi-check/session'
import { sheet } from '@/lib/padi-check/sheet'

export const dynamic = 'force-dynamic'

/**
 * GET → { guests: [{ name, code, ticket, tent }] }, sorted by name (R-011).
 * Admin only: a volunteer session gets 403 (AC-R003-01). Never email or phone.
 */
export async function GET(request: NextRequest) {
  const session = readSession(request)
  if (!session) return NextResponse.json({ error: 'Sign in again.' }, { status: 401 })
  if (!hasRole(session, 'admin')) return NextResponse.json({ error: 'Admin only.' }, { status: 403 })

  const limit = await checkRateLimit(request, 'roster', { ...GATE_RATE_LIMIT, identifier: session.id })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Wait a minute.' }, { status: 429 })
  }

  const roster = await sheet.roster()
  if (!roster) return NextResponse.json({ status: 'offline' }, { status: 503 })
  return NextResponse.json({ guests: toPrintedList(roster) }, { headers: { 'Cache-Control': 'no-store' } })
}
