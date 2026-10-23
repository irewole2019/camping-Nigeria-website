import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Padi Check sessions (usl-build/7-prd.md, R-003).
 *
 * A session is a cookie holding `role.expiry.signature`: the role, a Unix
 * expiry in seconds, and an HMAC-SHA256 of the first two signed with
 * PADI_CHECK_SESSION_SECRET. Nothing is stored server-side, so:
 *   - rotating a password does NOT end live sessions (they last 12 hours);
 *   - rotating PADI_CHECK_SESSION_SECRET ends every session at once.
 *
 * Pure functions with the secret passed in, so they can be unit-tested.
 * `lib/padi-check/auth.ts` wires them to the environment and the request.
 */

export type PadiRole = 'volunteer' | 'admin'

export const SESSION_COOKIE = 'padi_session'
export const SESSION_TTL_SECONDS = 12 * 60 * 60

export function isPadiRole(v: unknown): v is PadiRole {
  return v === 'volunteer' || v === 'admin'
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

/** Equal-length digests, so timingSafeEqual never throws and leaks no length. */
function safeEqual(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}

export function signSession(role: PadiRole, secret: string, now = Date.now()): string {
  const expiry = Math.floor(now / 1000) + SESSION_TTL_SECONDS
  const payload = `${role}.${expiry}`
  return `${payload}.${sign(payload, secret)}`
}

export interface PadiSession {
  role: PadiRole
  /** Unix seconds. */
  expiry: number
  /** The signature, unique per sign-in; used to key the per-session rate limit. */
  id: string
}

/** Returns the session, or null if the token is missing, tampered with or expired. */
export function verifySession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): PadiSession | null {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [role, expiryRaw, signature] = parts
  if (!isPadiRole(role) || !/^\d+$/.test(expiryRaw)) return null
  if (!safeEqual(signature, sign(`${role}.${expiryRaw}`, secret))) return null
  const expiry = Number(expiryRaw)
  if (expiry <= Math.floor(now / 1000)) return null
  return { role, expiry, id: signature }
}

/** Constant-time password check. An unset expected password never matches. */
export function passwordMatches(given: unknown, expected: string | undefined): boolean {
  if (typeof given !== 'string' || !expected) return false
  return safeEqual(given, expected)
}

/** Admin can do everything a volunteer can. */
export function hasRole(session: PadiSession | null, needed: PadiRole): boolean {
  if (!session) return false
  return needed === 'volunteer' || session.role === 'admin'
}
