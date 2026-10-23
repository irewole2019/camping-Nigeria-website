import { Redis } from '@upstash/redis'

/**
 * The one Upstash client, shared by the rate limiter and Padi Check's gate
 * memory. Null when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are
 * missing; each caller decides what that means for it.
 *
 * Each request gets 1.5 s and no retries. The library default is five
 * retries with backoff and no timeout, so a dead or unreachable database cost
 * about 9 s per call before the caller's fallback ran (found 23/10/2026, when
 * the database in .env.local turned out to have been deleted). A healthy
 * Upstash answers in tens of milliseconds, and every caller already has a
 * fallback for a throw: the rate limiter fails open, the gate asks the sheet.
 */

const REQUEST_TIMEOUT_MS = 1500

let cached: Redis | null = null

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  if (!cached) {
    cached = new Redis({
      url,
      token,
      retry: { retries: 0 },
      signal: () => AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  }
  return cached
}
