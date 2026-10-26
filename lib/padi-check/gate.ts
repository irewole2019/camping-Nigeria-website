import type { Redis } from '@upstash/redis'
import { isValidSignupCode } from '@/lib/events/mad-settings-records'
import { getRedis } from '@/lib/redis'
import { sheet as liveSheet, type Counts, type GateResult, type SheetClient } from './sheet'

/**
 * The gate's fast memory (decision 2026-10-23, usl-build/8-build-sequence.md
 * Section 9).
 *
 * Session 1.2 measured the Apps Script at a median of 4.8 s per check-in, with
 * a third of calls past 15 s, so the gate cannot wait on it. Instead:
 *
 *   1. The paid guest list is copied from the sheet into Upstash (`refreshRoster`,
 *      run in the background on sign-in and whenever the copy is 5 minutes old).
 *   2. A scan of a known guest is answered from Upstash in well under a second.
 *      HSETNX makes the first scan of a code the only `welcome`, however many
 *      scans arrive together.
 *   3. The arrival is then written to the sheet in the background, with the
 *      gate's own time. Until the sheet confirms it, the code sits in a pending
 *      list that every later request retries, so a slow or failing Google
 *      delays the record but never the guest.
 *   4. A code the memory does not know (not paid, mistyped, or signed up since
 *      the last copy) is asked of the sheet directly. That is the slow path,
 *      and it is the only place `not-found` and `not-paid` come from.
 *
 * The sheet stays the system of record: every arrival ends up in Checked In?,
 * and every non-welcome scan in the Scan log (the script logs them when the
 * scan is replayed to it).
 */

export interface Guest {
  name: string
  ticket: string
  usesTent: boolean
  /** The tribe's display name; absent until the sheet has one for the row. */
  tribe?: string
}

export interface GateStore {
  getGuest(code: string): Promise<Guest | null>
  addGuest(code: string, guest: Guest): Promise<void>
  /** Records the arrival unless there is one. Returns the earlier time, or null if this was the first. */
  markArrived(code: string, at: string): Promise<string | null>
  counts(): Promise<Counts>
  /** Replaces the guest list; adds the sheet's arrivals and forgets the ones `arrivalsToForget` names. */
  replaceRoster(guests: Map<string, Guest>, arrivals: Map<string, string>, now: number): Promise<void>
  /** When the list was last copied from the sheet, in ms, or null if never. */
  loadedAt(): Promise<number | null>
  addPending(code: string, at: string): Promise<void>
  pending(limit: number): Promise<Array<[code: string, at: string]>>
  clearPending(code: string): Promise<void>
  /** A short exclusive claim, so only one request refreshes or retries at a time. */
  claim(name: string, seconds: number): Promise<boolean>
  release(name: string): Promise<void>
}

export const ROSTER_MAX_AGE_MS = 5 * 60 * 1000
/** Retries per request. Each can take up to the 8 s script timeout. */
const PENDING_PER_PASS = 3

/** Trimmed, upper-cased, and shaped like MAD-XXXXXX, or null. */
export function normaliseCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const code = raw.trim().toUpperCase()
  return isValidSignupCode(code) ? code : null
}

/** yyyy-MM-ddTHH:mm:ss in Lagos, the shape the sheet stores. WAT is UTC+1 all year. */
export function lagosTime(now = Date.now()): string {
  return new Date(now + 60 * 60 * 1000).toISOString().slice(0, 19)
}

export interface CheckOutcome {
  result: GateResult
  /** Sheet writes to run after the response has gone (`after()` in the route). */
  background: Array<() => Promise<void>>
}

async function countsOr(store: GateStore, fallback: Partial<Counts> = {}): Promise<Partial<Counts>> {
  if (await store.loadedAt()) return store.counts()
  return { checkedIn: fallback.checkedIn, total: fallback.total }
}

/** Writes a pending arrival to the sheet, and clears it once the sheet has answered. */
async function writeArrival(store: GateStore, sheet: SheetClient, code: string, at: string) {
  const r = await sheet.checkIn(code, at)
  // welcome or already: the sheet has the arrival. not-found or not-paid: the
  // row was deleted or unmarked since the list was copied, so there is
  // nothing to write. Only offline is worth retrying.
  if (r.status !== 'offline') await store.clearPending(code)
}

export async function checkCode(
  code: string,
  deps: { store: GateStore | null; sheet: SheetClient; now?: number },
): Promise<CheckOutcome> {
  const { store, sheet } = deps
  const background: CheckOutcome['background'] = []

  if (store) {
    try {
      const guest = await store.getGuest(code)
      if (guest) {
        const at = lagosTime(deps.now)
        const earlier = await store.markArrived(code, at)
        if (earlier === null) {
          await store.addPending(code, at)
          background.push(() => writeArrival(store, sheet, code, at))
          const counts = await countsOr(store)
          return { result: { status: 'welcome', ...guest, checkedInAt: at, ...counts }, background }
        }
        // Replayed so the script adds the repeat to the Scan log. It carries
        // the first arrival's time, so if the welcome has not reached the
        // sheet yet, this lands it with the right time.
        background.push(async () => {
          await sheet.checkIn(code, earlier)
        })
        const counts = await countsOr(store)
        return { result: { status: 'already', ...guest, checkedInAt: earlier, ...counts }, background }
      }
    } catch (err) {
      // Upstash down: carry on with the slow path rather than fail the gate.
      console.error('[padi-check] gate memory failed; asking the sheet:', err)
    }
  }

  const r = await sheet.checkIn(code)
  if (store && r.status !== 'offline') {
    try {
      if (r.status === 'welcome' || r.status === 'already') {
        await store.addGuest(code, {
          name: r.name ?? '',
          ticket: r.ticket ?? '',
          usesTent: r.usesTent === true,
          ...(r.tribe ? { tribe: r.tribe } : {}),
        })
        await store.markArrived(code, r.checkedInAt ?? lagosTime(deps.now))
      }
      // One source for the count: once the list is in memory, the memory's,
      // so the number on screen does not jump between memory and sheet.
      return { result: { ...r, ...(await countsOr(store, r)) }, background }
    } catch (err) {
      console.error('[padi-check] could not remember a sheet answer:', err)
    }
  }
  return { result: r, background }
}

/**
 * An arrival younger than this is kept even when the sheet does not show it
 * yet: its write may still be on the way (pending, or confirmed after the
 * roster was read).
 */
export const RESET_GRACE_MS = 10 * 60 * 1000

/** "2026-10-31T19:05:00" (Lagos) → ms, or NaN. */
function lagosMs(at: string): number {
  return Date.parse(`${at}+01:00`)
}

/**
 * Which remembered arrivals a refresh should forget. The sheet is the record,
 * so the memory follows it: a guest no longer on the paid list goes, and so
 * does an arrival the sheet no longer shows, once it is old enough that the
 * sheet must have had it (someone set Checked In? back to No by hand, to fix
 * a mistake or to rerun a test). Pending arrivals are never forgotten.
 */
export function arrivalsToForget(
  remembered: Record<string, string>,
  guests: Map<string, Guest>,
  sheetArrivals: Map<string, string>,
  pending: Set<string>,
  now: number,
): string[] {
  return Object.entries(remembered)
    .filter(([code, at]) => {
      if (!guests.has(code)) return true
      if (sheetArrivals.has(code) || pending.has(code)) return false
      const t = lagosMs(at)
      return Number.isFinite(t) && now - t > RESET_GRACE_MS
    })
    .map(([code]) => code)
}

/** Copies the paid list from the sheet. False if the sheet did not answer. */
export async function refreshRoster(store: GateStore, sheet: SheetClient, now = Date.now()): Promise<boolean> {
  const roster = await sheet.roster()
  if (!roster) return false
  const guests = new Map<string, Guest>()
  const arrivals = new Map<string, string>()
  for (const r of roster) {
    guests.set(r.code, {
      name: r.name,
      ticket: r.ticketLabel,
      usesTent: r.usesTent,
      ...(r.tribe ? { tribe: r.tribe } : {}),
    })
    if (r.checkedInAt) arrivals.set(r.code, r.checkedInAt)
  }
  await store.replaceRoster(guests, arrivals, now)
  return true
}

/** Retries unconfirmed sheet writes, then refreshes the list if it is stale. Never throws. */
export async function maintain(store: GateStore, sheet: SheetClient, now = Date.now()): Promise<void> {
  try {
    const pending = await store.pending(PENDING_PER_PASS)
    if (pending.length && (await store.claim('flush', 30))) {
      try {
        for (const [code, at] of pending) await writeArrival(store, sheet, code, at)
      } finally {
        await store.release('flush')
      }
    }
    const loaded = await store.loadedAt()
    if ((!loaded || now - loaded > ROSTER_MAX_AGE_MS) && (await store.claim('refresh', 60))) {
      try {
        await refreshRoster(store, sheet, now)
      } finally {
        await store.release('refresh')
      }
    }
  } catch (err) {
    console.error('[padi-check] gate maintenance failed:', err)
  }
}

export interface GateCounts extends Counts {
  /**
   * True when the count came from the gate's memory, which means known guests
   * are being answered fast. False means every check is going to the sheet;
   * the scanner shows it so a slow gate is never a surprise.
   */
  fast: boolean
}

/** Counts for the live tally: from memory once the list is loaded, else from the sheet. */
export async function gateCounts(store: GateStore | null, sheet: SheetClient): Promise<GateCounts | null> {
  if (store) {
    try {
      if (await store.loadedAt()) return { ...(await store.counts()), fast: true }
    } catch (err) {
      console.error('[padi-check] gate memory failed; asking the sheet:', err)
    }
  }
  const counts = await sheet.stats()
  return counts && { ...counts, fast: false }
}

// ─── Stores ─────────────────────────────────────────────────────────────────

function parseGuest(v: unknown): Guest | null {
  const o = typeof v === 'string' ? safeJson(v) : v
  if (!o || typeof o !== 'object') return null
  const g = o as Record<string, unknown>
  return {
    name: typeof g.name === 'string' ? g.name : '',
    ticket: typeof g.ticket === 'string' ? g.ticket : '',
    usesTent: g.usesTent === true,
    ...(typeof g.tribe === 'string' && g.tribe ? { tribe: g.tribe } : {}),
  }
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

/**
 * Upstash-backed store. Keys are split by environment, so local dev and
 * Vercel previews never touch the production gate's memory.
 */
export function createRedisGateStore(redis: Redis, event = 'mad-settings'): GateStore {
  const env = process.env.VERCEL_ENV || 'local'
  const k = (name: string) => `camping-ng:padi:${env}:${event}:${name}`
  const GUESTS = k('guests')
  const ARRIVED = k('arrived')
  const PENDING = k('pending')
  const LOADED = k('loaded-at')

  return {
    async getGuest(code) {
      return parseGuest(await redis.hget(GUESTS, code))
    },
    async addGuest(code, guest) {
      await redis.hset(GUESTS, { [code]: JSON.stringify(guest) })
    },
    async markArrived(code, at) {
      if (await redis.hsetnx(ARRIVED, code, at)) return null
      const earlier = await redis.hget<string>(ARRIVED, code)
      return earlier == null ? at : String(earlier)
    },
    async counts() {
      const [checkedIn, total] = await Promise.all([redis.hlen(ARRIVED), redis.hlen(GUESTS)])
      return { checkedIn, total }
    },
    async replaceRoster(guests, arrivals, now) {
      const [remembered, pendingCodes] = await Promise.all([
        redis.hgetall<Record<string, unknown>>(ARRIVED),
        redis.hkeys(PENDING),
      ])
      const asText = Object.fromEntries(Object.entries(remembered ?? {}).map(([c, at]) => [c, String(at)]))
      const gone = arrivalsToForget(asText, guests, arrivals, new Set(pendingCodes as string[]), now)
      const tx = redis.multi()
      tx.del(GUESTS)
      if (guests.size) {
        const fields: Record<string, string> = {}
        for (const [code, g] of guests) fields[code] = JSON.stringify(g)
        tx.hset(GUESTS, fields)
      }
      for (const [code, at] of arrivals) tx.hsetnx(ARRIVED, code, at)
      if (gone.length) tx.hdel(ARRIVED, ...gone)
      tx.set(LOADED, String(now))
      await tx.exec()
    },
    async loadedAt() {
      const v = await redis.get(LOADED)
      const n = Number(v)
      return v != null && Number.isFinite(n) ? n : null
    },
    async addPending(code, at) {
      await redis.hset(PENDING, { [code]: at })
    },
    async pending(limit) {
      const all = (await redis.hgetall<Record<string, unknown>>(PENDING)) ?? {}
      return Object.entries(all)
        .slice(0, limit)
        .map(([code, at]) => [code, String(at)] as [string, string])
    },
    async clearPending(code) {
      await redis.hdel(PENDING, code)
    },
    async claim(name, seconds) {
      return (await redis.set(k(`claim:${name}`), '1', { nx: true, ex: seconds })) === 'OK'
    },
    async release(name) {
      await redis.del(k(`claim:${name}`))
    },
  }
}

/** In-memory store with the same behaviour, for tests. */
export function createMemoryGateStore(): GateStore {
  const guests = new Map<string, Guest>()
  const arrived = new Map<string, string>()
  const pending = new Map<string, string>()
  const claims = new Map<string, number>()
  let loaded: number | null = null

  return {
    async getGuest(code) {
      return guests.get(code) ?? null
    },
    async addGuest(code, guest) {
      guests.set(code, guest)
    },
    async markArrived(code, at) {
      const earlier = arrived.get(code)
      if (earlier !== undefined) return earlier
      arrived.set(code, at)
      return null
    },
    async counts() {
      return { checkedIn: arrived.size, total: guests.size }
    },
    async replaceRoster(next, arrivals, now) {
      const gone = arrivalsToForget(Object.fromEntries(arrived), next, arrivals, new Set(pending.keys()), now)
      guests.clear()
      for (const [code, g] of next) guests.set(code, g)
      for (const code of gone) arrived.delete(code)
      for (const [code, at] of arrivals) if (!arrived.has(code)) arrived.set(code, at)
      loaded = now
    },
    async loadedAt() {
      return loaded
    },
    async addPending(code, at) {
      pending.set(code, at)
    },
    async pending(limit) {
      return [...pending.entries()].slice(0, limit)
    },
    async clearPending(code) {
      pending.delete(code)
    },
    async claim(name, seconds) {
      const now = Date.now()
      if ((claims.get(name) ?? 0) > now) return false
      claims.set(name, now + seconds * 1000)
      return true
    },
    async release(name) {
      claims.delete(name)
    },
  }
}

/** The production store, or null without Upstash (then every check asks the sheet). */
export function getGateStore(): GateStore | null {
  const redis = getRedis()
  return redis ? createRedisGateStore(redis) : null
}

/** For `after()`: keep the memory fresh and the sheet caught up. */
export async function maintainGate(): Promise<void> {
  const store = getGateStore()
  if (store) await maintain(store, liveSheet)
}
