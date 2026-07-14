import { NextRequest, NextResponse } from 'next/server'
import { validateCustomerCareForm } from '@/lib/validation/landing'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { sendOwnerNotification } from '@/lib/email/send-owner-notification'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit('customer-care', ip)) {
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

  const result = validateCustomerCareForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const supabase = createMccLeadsAdminClient()
    const { data, error } = await supabase
      .from('customer_care_requests')
      .insert({
        request_type: result.data.requestType,
        message: result.data.message,
        route: result.data.route,
        name: result.data.name,
        contact_email: result.data.contactEmail,
        ip_address: ip,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[customer-care] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    if (data) {
      await sendOwnerNotification({
        submissionType: 'New Customer Care Request',
        recordId: data.id,
        source: result.data.route,
        fields: [
          { label: 'Category', value: result.data.requestType },
          { label: 'Name', value: result.data.name || 'Not provided' },
          { label: 'Email', value: result.data.contactEmail || 'Not provided' },
          { label: 'Message', value: result.data.message },
        ],
      })
    }
  } catch (err) {
    console.error('[customer-care] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
