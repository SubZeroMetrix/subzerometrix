// ─────────────────────────────────────────────────────────────────────────────
// GET /api/postback/[vendor]
// Server-to-Server postback endpoint for affiliate conversion tracking.
// Partners fire this when a user completes a signup, account open, or purchase.
//
// SECURITY LAYERS:
// 1. Partner IP allowlist verification
// 2. HMAC-SHA256 signature verification (where partner supports it)
// 3. Regulated data sanitization — any sensitive fields are redacted before storage
// 4. Subid matching to original click record
//
// COMPLIANCE:
// We are a publisher. We do not process, store, or act on any regulated financial
// data. Postbacks should only contain: subid, event type, order reference, commission.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { sanitizePostbackPayload, containsRegulatedData } from '@/lib/tracking'

// ── Partner IP allowlists ─────────────────────────────────────────────────────
// Get these from each partner's postback documentation.
// Empty array = skip IP check for that partner (not recommended for production)
const PARTNER_IPS: Record<string, string[]> = {
  'simply-business': [],   // add IPs from Simply Business docs
  'next-insurance':  [],   // add IPs from NEXT Insurance docs
  'relay':           [],   // add IPs from Relay docs
  'jobber':          [],   // add IPs from Jobber partner docs
  'housecall-pro':   [],
  'quickbooks':      [],
  'zenbusiness':     [],
  'nav':             [],
  'angi':            [],
}

// ── Commission rates per vendor ───────────────────────────────────────────────
// Update with actual rates from your affiliate agreements
const COMMISSION_RATES: Record<string, Record<string, number>> = {
  'jobber':          { signup: 150, trial: 50 },
  'housecall-pro':   { signup: 150, trial: 50 },
  'quickbooks':      { signup: 100 },
  'relay':           { account_open: 30 },
  'simply-business': { policy_bound: 75, quote_completed: 10 },
  'next-insurance':  { policy_bound: 75, quote_completed: 10 },
  'zenbusiness':     { formation: 50 },
  'nav':             { signup: 25 },
  'angi':            { signup: 20 },
}

function getCommission(vendor: string, eventType: string): number {
  const rates = COMMISSION_RATES[vendor] ?? {}
  return rates[eventType] ?? rates['signup'] ?? 0
}

function ipInAllowlist(ip: string | null, allowedIPs: string[]): boolean {
  if (!ip) return false
  if (allowedIPs.length === 0) return true // no check configured
  return allowedIPs.some(allowed => {
    if (!allowed.includes('/')) return ip === allowed
    // Basic CIDR — /24 prefix match
    const prefix = allowed.split('/')[0].split('.').slice(0, 3).join('.')
    return ip.startsWith(prefix)
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { vendor: string } }
) {
  const vendor = params.vendor.toLowerCase()
  const { searchParams } = req.nextUrl

  // ── 1. Validate vendor is known ────────────────────────────────────────────
  if (!Object.keys(PARTNER_IPS).includes(vendor)) {
    console.warn(`Postback: unknown vendor '${vendor}'`)
    return NextResponse.json({ error: 'Unknown vendor' }, { status: 400 })
  }

  // ── 2. IP allowlist check ──────────────────────────────────────────────────
  const callerIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const allowedIPs = PARTNER_IPS[vendor] ?? []
  if (allowedIPs.length > 0 && !ipInAllowlist(callerIP, allowedIPs)) {
    console.warn(`Postback: IP not allowlisted — vendor=${vendor} ip=${callerIP}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // ── 3. Extract standard params (normalize across different partner schemas) ─
  const subid        = searchParams.get('subid') ?? searchParams.get('sid') ?? searchParams.get('click_id') ?? ''
  const eventType    = searchParams.get('event') ?? searchParams.get('type') ?? searchParams.get('conversion_type') ?? 'conversion'
  const orderId      = searchParams.get('order_id') ?? searchParams.get('transaction_id') ?? searchParams.get('ref') ?? ''
  const value        = parseFloat(searchParams.get('value') ?? searchParams.get('amount') ?? searchParams.get('revenue') ?? '0')
  const partnerSig   = searchParams.get('sig') ?? searchParams.get('hash') ?? searchParams.get('hmac') ?? null

  if (!subid) {
    console.warn(`Postback: missing subid — vendor=${vendor}`)
    return NextResponse.json({ error: 'Missing subid' }, { status: 400 })
  }

  // ── 4. Signature verification (if partner sends one) ──────────────────────
  const secret = process.env[`POSTBACK_SECRET_${vendor.toUpperCase().replace(/-/g, '_')}`]
  let verified = false

  if (partnerSig && secret) {
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${subid}:${orderId}:${value}`)
      .digest('hex')
    try {
      verified = crypto.timingSafeEqual(
        Buffer.from(partnerSig.toLowerCase(), 'hex'),
        Buffer.from(expectedSig, 'hex')
      )
      if (!verified) {
        console.warn(`Postback: invalid signature — vendor=${vendor} subid=${subid}`)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } catch {
      console.warn(`Postback: signature comparison failed — vendor=${vendor}`)
      return NextResponse.json({ error: 'Signature error' }, { status: 400 })
    }
  }

  // ── 5. Sanitize raw payload before storing anything ───────────────────────
  const rawParams = Object.fromEntries(searchParams.entries())
  const sanitizedPayload = sanitizePostbackPayload(rawParams)
  const hadRegulatedData = containsRegulatedData(rawParams)

  if (hadRegulatedData) {
    console.warn(`Postback: regulated data detected and redacted — vendor=${vendor} subid=${subid}`)
    // Do not reject — still log the conversion but flag it for review
  }

  // ── 6. Connect to Supabase ─────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Postback: Supabase not configured — conversion not logged')
    return NextResponse.json(
      { error: 'Referral conversion tracking is not configured. Missing Supabase service environment variables.' },
      { status: 503 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // ── 7. Match subid to original click ──────────────────────────────────────
  const { data: click } = await supabase
    .from('referral_clicks')
    .select('id, user_id, vendor_slug, user_state, user_score')
    .eq('subid', subid)
    .maybeSingle()

  // ── 8. Log the conversion ──────────────────────────────────────────────────
  const commission = getCommission(vendor, eventType)

  const { data: conversion, error: convError } = await supabase
    .from('referral_conversions')
    .insert({
      click_id:                click?.id ?? null,
      subid,
      vendor_slug:             vendor,
      conversion_type:         eventType,
      conversion_value:        isNaN(value) ? 0 : value,
      commission_owed:         commission,
      currency:                'USD',
      partner_order_id:        orderId || null,
      partner_event_name:      eventType,
      postback_source:         's2s',
      postback_raw:            sanitizedPayload,
      postback_verified:       verified,
      partner_ip:              callerIP,
      status:                  'received',
      regulated_data_received: hadRegulatedData,
      regulated_data_notes:    hadRegulatedData
        ? 'Partner sent fields matching regulated data patterns. Fields were redacted before storage. Review required.'
        : null,
    })
    .select('id')
    .single()

  if (convError) {
    console.error('Postback: insert failed:', convError.message)
    // Still return 200 so partner doesn't retry endlessly
    return NextResponse.json({ status: 'ok', warning: 'logging_failed' })
  }

  // ── 9. Return 200 immediately — partner needs this to stop retrying ────────
  return NextResponse.json({
    status: 'ok',
    conversion_id: conversion?.id,
  })
}

// Partners may also fire POST postbacks
export async function POST(
  req: NextRequest,
  context: { params: { vendor: string } }
) {
  // Delegate to GET handler after merging body params into URL
  try {
    const body = await req.json().catch(() => ({}))
    const url  = new URL(req.url)
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'number') {
        url.searchParams.set(key, String(value))
      }
    }
    return GET(new NextRequest(url.toString(), { headers: req.headers }), context)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
