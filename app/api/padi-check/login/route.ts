import { after, NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { LOGIN_RATE_LIMIT, sessionCookie } from '@/lib/padi-check/auth'
import { maintainGate } from '@/lib/padi-check/gate'
import { isPadiRole, passwordMatches, signSession } from '@/lib/padi-check/session'

/**
 * POST { password, role: 'volunteer' | 'admin' } → sets the padi_session
 * cookie. Only wrong passwords spend the lockout budget, so a volunteer who
 * signs in several times while testing is never locked out.
 */
export async function POST(request: NextRequest) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const { password, role } = raw as Record<string, unknown>
  if (!isPadiRole(role) || typeof password !== 'string' || password.length > 200) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const secret = process.env.PADI_CHECK_SESSION_SECRET
  const expected =
    role === 'admin' ? process.env.PADI_CHECK_ADMIN_PASSWORD : process.env.PADI_CHECK_PASSWORD
  if (!secret || !expected) {
    console.error('[padi-check] login refused: session secret or password not set')
    return NextResponse.json({ error: 'Padi Check is not set up yet.' }, { status: 503 })
  }

  const budget = await checkRateLimit(request, 'login', { ...LOGIN_RATE_LIMIT, mode: 'peek' })
  if (!budget.allowed) {
    return NextResponse.json(
      { error: 'Too many wrong passwords. Wait 15 minutes, then try again.' },
      { status: 429 },
    )
  }

  if (!passwordMatches(password, expected)) {
    await checkRateLimit(request, 'login', LOGIN_RATE_LIMIT)
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true, role })
  res.cookies.set(sessionCookie(signSession(role, secret)))
  // Load the guest list into the gate's memory while the volunteer gets ready.
  after(maintainGate)
  return res
}
