import { NextRequest, NextResponse } from 'next/server'
import { validateMccLeadForm } from '@/lib/validation/mcc-lead'
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

  // Honeypot -- a hidden field real users never fill in. Silently accept
  // (fake success) so bots don't learn their submission was rejected.
  if (typeof d.website === 'string' && d.website.length > 0) {
    return NextResponse.json({ success: true })
  }

  // Time-trap -- forms submitted faster than a human can plausibly fill
  // them out are almost always bots.
  if (typeof d.formRenderedAt === 'number' && Date.now() - d.formRenderedAt < 1500) {
    return NextResponse.json({ error: 'Please try again.' }, { status: 400 })
  }

  const source = typeof d.source === 'string' ? d.source : 'landing_page'

  const result = validateMccLeadForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('mcc_leads')
      .select('id')
      .eq('email', result.data.email)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from('mcc_leads').insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      company: result.data.company,
      message: result.data.message,
      source,
      consent_given: result.data.consent,
      consent_text: 'I agree to be contacted about Metrix Command Center and have read the Privacy Policy and Terms.',
      consent_timestamp: new Date().toISOString(),
      ip_address: ip,
    })

    if (error) {
      console.error('[mcc-lead] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
  } catch (err) {
    console.error('[mcc-lead] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
