import { NextRequest, NextResponse } from 'next/server'
import { validateContactForm } from '@/lib/validation/contact'
import { createAdminClient } from '@/lib/supabase/admin'

const RATE_LIMIT_MAP = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_REQUESTS = 3

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = RATE_LIMIT_MAP.get(ip) || []
  const recent = requests.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= MAX_REQUESTS) return false
  recent.push(now)
  RATE_LIMIT_MAP.set(ip, recent)
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

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

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('contact_submissions').insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    })

    if (error) {
      console.error('[contact-submission] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }
  } catch (err) {
    console.error('[contact-submission] Error:', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
