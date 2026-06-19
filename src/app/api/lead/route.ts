import { NextRequest, NextResponse } from 'next/server'
import { validateLeadForm } from '@/lib/validation/lead'

const RATE_LIMIT_MAP = new Map<string, number>()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  const now = Date.now()
  const lastRequest = RATE_LIMIT_MAP.get(ip) || 0
  if (now - lastRequest < 10_000) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }
  RATE_LIMIT_MAP.set(ip, now)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = validateLeadForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // In production, store in Supabase lead_signups table
  // and trigger email provider adapter for double-opt-in
  if (process.env.NODE_ENV === 'development') {
    console.log('[lead-signup]', result.data)
  }

  return NextResponse.json({ success: true })
}
