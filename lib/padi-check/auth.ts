import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, verifySession, type PadiSession } from './session'

/** The caller's Padi Check session, or null. */
export function readSession(request: NextRequest): PadiSession | null {
  const secret = process.env.PADI_CHECK_SESSION_SECRET
  if (!secret) return null
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
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
