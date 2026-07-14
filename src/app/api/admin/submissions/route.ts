import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'

export interface SubmissionRow {
  type: string
  id: string
  name: string | null
  email: string | null
  status: string
  created_at: string
  source: string | null
  details: string
}

export async function GET(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const typeFilter = request.nextUrl.searchParams.get('type')

  try {
    const supabase = createMccLeadsAdminClient()
    const rows: SubmissionRow[] = []

    const [leads, care, qual, referral, feedback] = await Promise.all([
      supabase.from('mcc_leads').select('id, name, email, status, created_at, source, message').order('created_at', { ascending: false }).limit(50),
      supabase.from('customer_care_requests').select('id, name, contact_email, status, created_at, route, request_type, message').order('created_at', { ascending: false }).limit(50),
      supabase.from('qualification_responses').select('id, name, email, status, created_at, trade_type, primary_pain, desired_next_step').order('created_at', { ascending: false }).limit(50),
      supabase.from('referral_partner_interest').select('id, name, email, status, created_at, interest_type, business_name, message').order('created_at', { ascending: false }).limit(50),
      supabase.from('help_feedback').select('id, contact_email, status, created_at, route, category, comment').not('comment', 'is', null).order('created_at', { ascending: false }).limit(50),
    ])

    for (const l of leads.data || []) {
      rows.push({ type: 'lead', id: l.id, name: l.name, email: l.email, status: l.status, created_at: l.created_at, source: l.source, details: l.message || '' })
    }
    for (const c of care.data || []) {
      rows.push({ type: 'customer_care', id: c.id, name: c.name, email: c.contact_email, status: c.status, created_at: c.created_at, source: c.route, details: `[${c.request_type}] ${c.message}` })
    }
    for (const q of qual.data || []) {
      rows.push({ type: 'qualification', id: q.id, name: q.name, email: q.email, status: q.status, created_at: q.created_at, source: q.desired_next_step, details: `${q.trade_type || 'Unknown trade'} — ${q.primary_pain || 'No pain stated'}` })
    }
    for (const r of referral.data || []) {
      rows.push({ type: 'referral_partner', id: r.id, name: r.name, email: r.email, status: r.status, created_at: r.created_at, source: r.interest_type, details: `${r.business_name || ''} ${r.message || ''}`.trim() })
    }
    for (const f of feedback.data || []) {
      rows.push({ type: 'help_feedback', id: f.id, name: null, email: f.contact_email, status: f.status, created_at: f.created_at, source: f.route, details: `[${f.category}] ${f.comment}` })
    }

    rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const filtered = typeFilter ? rows.filter((r) => r.type === typeFilter) : rows

    return NextResponse.json({ submissions: filtered.slice(0, 100) })
  } catch (err) {
    console.error('[admin-submissions] Error:', err)
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 })
  }
}

const TABLE_BY_TYPE: Record<string, string> = {
  lead: 'mcc_leads',
  customer_care: 'customer_care_requests',
  qualification: 'qualification_responses',
  referral_partner: 'referral_partner_interest',
  help_feedback: 'help_feedback',
}

const VALID_STATUSES = ['new', 'NEW', 'reviewed', 'REVIEWED', 'contacted', 'converted', 'archived', 'ACTIONABLE', 'PLANNED', 'COMPLETED', 'DECLINED', 'DUPLICATE', 'SPAM', 'QUALIFIED', 'NOT_QUALIFIED', 'HANDED_OFF', 'APPROVED']

export async function PATCH(request: NextRequest) {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const d = body as Record<string, unknown>
  const table = typeof d.type === 'string' ? TABLE_BY_TYPE[d.type] : null
  const id = typeof d.id === 'string' ? d.id : null
  const status = typeof d.status === 'string' ? d.status : null

  if (!table || !id || !status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const supabase = createMccLeadsAdminClient()
    const { error } = await supabase.from(table).update({ status }).eq('id', id)
    if (error) {
      console.error('[admin-submissions] Update error:', error.message)
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin-submissions] Error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
