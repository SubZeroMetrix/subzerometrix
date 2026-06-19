import { NextRequest, NextResponse } from 'next/server'
import { validateLeadForm } from '@/lib/validation/lead'
import { createAdminClient } from '@/lib/supabase/admin'

const RATE_LIMIT_MAP = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = RATE_LIMIT_MAP.get(ip) || []
  const recent = requests.filter((t) => now - t < 60_000)
  if (recent.length >= 5) return false
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

  const d = body as Record<string, unknown>
  const source = typeof d.source === 'string' ? d.source : null

  const result = validateLeadForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('lead_signups')
      .select('id')
      .eq('email', result.data.email)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from('lead_signups').insert({
      email: result.data.email,
      use_case: result.data.use_case,
      source,
      consent_given: result.data.consent,
      consent_text: 'I agree to receive emails from SubZero Metrix. Unsubscribe anytime.',
      consent_timestamp: new Date().toISOString(),
    })

    if (error) {
      console.error('[lead-signup] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
  } catch (err) {
    console.error('[lead-signup] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
