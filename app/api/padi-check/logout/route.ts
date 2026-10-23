import { NextResponse } from 'next/server'
import { sessionCookie } from '@/lib/padi-check/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ ...sessionCookie(''), maxAge: 0 })
  return res
}
