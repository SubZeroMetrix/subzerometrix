import { NextRequest, NextResponse } from 'next/server'
import { validateContactForm } from '@/lib/validation/contact'

const RATE_LIMIT_MAP = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_REQUESTS = 3

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  const now = Date.now()
  const lastRequest = RATE_LIMIT_MAP.get(ip) || 0
  if (now - lastRequest < RATE_LIMIT_WINDOW_MS / MAX_REQUESTS) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }
  RATE_LIMIT_MAP.set(ip, now)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = validateContactForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // In production, store in Supabase contact_submissions table
  if (process.env.NODE_ENV === 'development') {
    console.log('[contact-submission]', result.data)
  }

  return NextResponse.json({ success: true })
}
