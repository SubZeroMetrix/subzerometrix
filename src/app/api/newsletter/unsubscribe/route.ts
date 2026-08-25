import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const token = (body as Record<string, unknown>)?.token
  if (typeof token !== 'string' || !UUID_RE.test(token)) {
    return NextResponse.json({ error: 'Invalid unsubscribe token' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: new Date().toISOString(), pinellas_field_notes: false, growth_systems_brief: false })
      .eq('unsubscribe_token', token)
      .select('id')
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }
  } catch (err) {
    const code = (err as { code?: string })?.code
    if (code === '42P01') {
      return NextResponse.json({ error: 'Newsletter system is not yet available.' }, { status: 503 })
    }
    console.error('[newsletter-unsubscribe] Error:', err)
    return NextResponse.json({ error: 'Failed to process unsubscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
