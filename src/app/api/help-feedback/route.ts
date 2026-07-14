import { NextRequest, NextResponse } from 'next/server'
import { validateHelpFeedbackForm } from '@/lib/validation/landing'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit('help-feedback', ip, 10)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = validateHelpFeedbackForm(body)
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const supabase = createMccLeadsAdminClient()
    const { error } = await supabase.from('help_feedback').insert({
      category: result.data.category,
      route: result.data.route,
      help_article_id: result.data.helpArticleId,
      rating: result.data.rating,
      comment: result.data.comment,
      consent_analytics: true,
      contact_email: result.data.contactEmail,
      ip_address: ip,
    })

    if (error) {
      console.error('[help-feedback] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
  } catch (err) {
    console.error('[help-feedback] Error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
