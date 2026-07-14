import { NextRequest, NextResponse } from 'next/server'
import { validateReferralInterestForm } from '@/lib/validation/landing'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit('referral-interest', ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const d = body as Record<string, unknown>

  if (typeof d.website === 'string' && d.website.length > 0) {
    return NextResponse.json({ success: true })
  }
  if (typeof d.formRenderedAt === 'number' && Date.now() - d.formRenderedAt < 1500) {
    return NextResponse.json({ error: 'Please try again.' }, { status: 400 })
  }

  const result = validateReferralInterestForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const supabase = createMccLeadsAdminClient()

    const { data: existing } = await supabase
      .from('referral_partner_interest')
      .select('id')
      .eq('email', result.data.email)
      .eq('interest_type', result.data.interestType)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from('referral_partner_interest').insert({
      interest_type: result.data.interestType,
      name: result.data.name,
      email: result.data.email,
      business_name: result.data.businessName,
      message: result.data.message,
      source_attribution: typeof d.source === 'string' ? d.source.slice(0, 200) : 'landing_page',
      consent_given: result.data.consentGiven,
    })

    if (error) {
      console.error('[referral-interest] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
  } catch (err) {
    console.error('[referral-interest] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
