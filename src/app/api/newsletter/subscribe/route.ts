import { NextRequest, NextResponse } from 'next/server'
import { validateNewsletterSignup } from '@/lib/validation/newsletter'
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

  const result = validateNewsletterSignup(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const attribution = (body as Record<string, unknown>).attribution as Record<string, unknown> | undefined
  const column = result.data.publication === 'pinellas-field-notes' ? 'pinellas_field_notes' : 'growth_systems_brief'

  try {
    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', result.data.email)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          [column]: true,
          unsubscribed_at: null,
          first_name: result.data.firstName ?? undefined,
          last_name: result.data.lastName ?? undefined,
          trade: result.data.trade ?? undefined,
          geography: result.data.geography ?? undefined,
          interests: result.data.interests ?? undefined,
          email_consent: result.data.emailConsent,
          sms_consent: result.data.smsConsent,
        })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: result.data.email,
        [column]: true,
        first_name: result.data.firstName ?? null,
        last_name: result.data.lastName ?? null,
        trade: result.data.trade ?? null,
        geography: result.data.geography ?? null,
        interests: result.data.interests ?? null,
        email_consent: result.data.emailConsent,
        sms_consent: result.data.smsConsent,
        source_domain: typeof attribution?.original_domain === 'string' ? attribution.original_domain : null,
        source_landing_page: typeof attribution?.original_landing_page === 'string' ? attribution.original_landing_page : null,
        source_tool: typeof attribution?.source_tool === 'string' ? attribution.source_tool : null,
        utm_source: typeof attribution?.utm_source === 'string' ? attribution.utm_source : null,
        utm_medium: typeof attribution?.utm_medium === 'string' ? attribution.utm_medium : null,
        utm_campaign: typeof attribution?.utm_campaign === 'string' ? attribution.utm_campaign : null,
        consent_source: `newsletter-signup:${result.data.publication}`,
      })
      if (error) throw error
    }
  } catch (err) {
    // 42P01 = undefined_table: migration 0009_newsletter_subscribers.sql has not
    // been applied yet. Surface a distinct, honest error rather than a generic 500.
    // Checked both `.code` (PostgrestError shape) and the message text as a
    // fallback -- found via live testing 2026-08-26 that the `.code`-only
    // check was NOT reliably firing in production (returned a generic 500
    // instead of the intended 503), root cause not fully isolated without
    // server log access; this widens detection without changing behavior
    // when the table really is missing.
    const code = (err as { code?: string })?.code
    const message = (err as { message?: string })?.message || (err instanceof Error ? err.message : String(err))
    // PGRST205 is PostgREST's own "table not in schema cache" code -- what
    // actually fires here (found via live 2026-08-26 testing), not raw
    // Postgres 42P01. Checking both, plus the message text, for robustness.
    if (
      code === '42P01' || code === 'PGRST205' ||
      message.includes('42P01') || message.includes('PGRST205') ||
      /relation .* does not exist/i.test(message) ||
      /could not find the table/i.test(message)
    ) {
      console.error('[newsletter-subscribe] newsletter_subscribers table does not exist yet -- migration 0009 not applied')
      return NextResponse.json({ error: 'Newsletter signup is not yet available. Please try again later.' }, { status: 503 })
    }
    console.error('[newsletter-subscribe] Error:', err)
    // TEMPORARY diagnostic (2026-08-26): expose the error shape to isolate
    // why the 503 branch above isn't matching in production. Remove once
    // the real cause is found -- not meant to ship long-term.
    return NextResponse.json({ error: 'Failed to save subscription', _debug: { code, message } }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
