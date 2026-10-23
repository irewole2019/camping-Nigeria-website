import { after, NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { GATE_RATE_LIMIT, readSession } from '@/lib/padi-check/auth'
import { checkCode, getGateStore, maintainGate, normaliseCode } from '@/lib/padi-check/gate'
import { sheet } from '@/lib/padi-check/sheet'

/**
 * POST { code } → { status, name?, ticket?, usesTent?, checkedInAt?, checkedIn?, total? }
 * (R-002). Volunteer or admin session. Logs status and code only, never names.
 */
export async function POST(request: NextRequest) {
  const session = readSession(request)
  if (!session) return NextResponse.json({ error: 'Sign in again.' }, { status: 401 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const limit = await checkRateLimit(request, 'check', { ...GATE_RATE_LIMIT, identifier: session.id })
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many scans. Wait a minute.' }, { status: 429 })
  }

  // A wrong shape cannot be in the sheet, so it is answered without asking it.
  const code = normaliseCode((raw as Record<string, unknown>).code)
  if (!code) {
    console.info('[padi-check] not-found (bad shape)')
    return NextResponse.json({ status: 'not-found' })
  }

  const { result, background } = await checkCode(code, { store: getGateStore(), sheet })
  console.info(`[padi-check] ${result.status} ${code}`)
  for (const task of background) after(task)
  after(maintainGate)
  return NextResponse.json(result)
}
