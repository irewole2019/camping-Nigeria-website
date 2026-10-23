import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, verifySession, type PadiSession } from './session'

/** The caller's Padi Check session, or null. For route handlers. */
export function readSession(request: NextRequest): PadiSession | null {
  const secret = process.env.PADI_CHECK_SESSION_SECRET
  if (!secret) return null
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
}

/** The same, for server components (pages). */
export async function getPageSession(): Promise<PadiSession | null> {
  const secret = process.env.PADI_CHECK_SESSION_SECRET
  if (!secret) return null
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value, secret)
}

/**
 * The `tel:` link behind "Call Toyosi", built from PADI_CHECK_CALL_PHONE.
 * Only ever rendered into a page for a signed-in session; the number is
 * never committed. Null if unset, and the button is then left out.
 */
export function callHref(): string | null {
  const phone = process.env.PADI_CHECK_CALL_PHONE?.replace(/[^\d+]/g, '')
  return phone ? `tel:${phone}` : null
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  }
}

/** Per-session budget for the gate: 120 requests in 10 minutes (R-002). */
export const GATE_RATE_LIMIT = { max: 120, windowSeconds: 10 * 60, prefix: 'camping-ng:padi' }

/** Five wrong passwords per IP in 15 minutes, then locked for 15 (R-003). */
export const LOGIN_RATE_LIMIT = { max: 5, windowSeconds: 15 * 60, prefix: 'camping-ng:padi-login' }
