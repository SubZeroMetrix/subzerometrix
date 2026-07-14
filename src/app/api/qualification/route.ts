import { NextRequest, NextResponse } from 'next/server'
import { validateQualificationForm } from '@/lib/validation/landing'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendOwnerNotification } from '@/lib/email/send-owner-notification'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit('qualification', ip)) {
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

  const result = validateQualificationForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const utm = typeof d.utm === 'object' && d.utm ? (d.utm as Record<string, unknown>) : {}

  try {
    const supabase = createMccLeadsAdminClient()

    const { data: existing } = await supabase
      .from('qualification_responses')
      .select('id')
      .eq('email', result.data.email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    const { data, error } = await supabase
      .from('qualification_responses')
      .insert({
        trade_type: result.data.tradeType,
        role: result.data.role,
        company_size_range: result.data.companySizeRange,
        current_method: result.data.currentMethod,
        primary_pain: result.data.primaryPain,
        opportunity_volume_range: result.data.opportunityVolumeRange,
        current_software: result.data.currentSoftware,
        desired_next_step: result.data.desiredNextStep,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        how_heard: result.data.howHeard,
        consent_given: result.data.consentGiven,
        utm_source: typeof utm.source === 'string' ? utm.source.slice(0, 200) : null,
        utm_medium: typeof utm.medium === 'string' ? utm.medium.slice(0, 200) : null,
        utm_campaign: typeof utm.campaign === 'string' ? utm.campaign.slice(0, 200) : null,
        referrer: typeof d.referrer === 'string' ? d.referrer.slice(0, 500) : null,
        landing_page: typeof d.landingPage === 'string' ? d.landingPage.slice(0, 500) : null,
        ip_address: ip,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[qualification] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    if (data) {
      await sendOwnerNotification({
        submissionType: 'New Qualification Submission',
        recordId: data.id,
        source: result.data.desiredNextStep,
        fields: [
          { label: 'Name', value: result.data.name },
          { label: 'Email', value: result.data.email },
          { label: 'Trade', value: result.data.tradeType || 'Not provided' },
          { label: 'Company Size', value: result.data.companySizeRange || 'Not provided' },
          { label: 'Primary Pain', value: result.data.primaryPain || 'Not provided' },
          { label: 'Current Method', value: result.data.currentMethod || 'Not provided' },
        ],
      })
    }
  } catch (err) {
    console.error('[qualification] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
