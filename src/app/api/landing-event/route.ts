import { NextRequest, NextResponse } from 'next/server'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

// Strict allowlist -- arbitrary event names are rejected outright, and
// this is the only vocabulary this route will ever record.
const ALLOWED_EVENTS = new Set([
  'help_center_viewed',
  'help_search',
  'help_article_opened',
  'help_answer_helpful',
  'help_answer_not_helpful',
  'help_escalation_clicked',
  'customer_care_viewed',
  'feedback_submitted',
  'care_request_submitted',
  'qualification_started',
  'qualification_completed',
  'referral_interest_submitted',
  'partner_interest_submitted',
])

const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{1,64}$/

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit('landing-event', ip, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const d = body as Record<string, unknown>

  if (typeof d.eventName !== 'string' || !ALLOWED_EVENTS.has(d.eventName)) {
    return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
  }
  if (typeof d.visitorId !== 'string' || !VISITOR_ID_RE.test(d.visitorId)) {
    return NextResponse.json({ error: 'Invalid visitor id' }, { status: 400 })
  }
  if (typeof d.sessionId !== 'string' || !VISITOR_ID_RE.test(d.sessionId)) {
    return NextResponse.json({ error: 'Invalid session id' }, { status: 400 })
  }
  if (typeof d.route !== 'string' || d.route.length === 0 || d.route.length > 300) {
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 })
  }

  // Strict metadata allowlist -- only short, non-sensitive scalar values.
  const rawMetadata = (typeof d.metadata === 'object' && d.metadata) ? (d.metadata as Record<string, unknown>) : {}
  const metadata: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(rawMetadata)) {
    if (Object.keys(metadata).length >= 5) break
    if (typeof key !== 'string' || key.length > 40) continue
    if (typeof value === 'string' && value.length <= 200) metadata[key] = value
    else if (typeof value === 'number' && Number.isFinite(value)) metadata[key] = value
    else if (typeof value === 'boolean') metadata[key] = value
  }

  try {
    const supabase = createMccLeadsAdminClient()
    const { error } = await supabase.from('landing_events').insert({
      event_name: d.eventName,
      visitor_id: d.visitorId,
      session_id: d.sessionId,
      route: d.route.slice(0, 300),
      related_id: typeof d.relatedId === 'string' ? d.relatedId : null,
      metadata,
      consent_analytics: d.consentAnalytics === true,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    })

    if (error) {
      // Never let analytics failures surface to the user experience.
      console.error('[landing-event] DB error:', error.message)
    }
  } catch (err) {
    console.error('[landing-event] Error:', err)
  }

  return NextResponse.json({ success: true })
}
