import { NextRequest, NextResponse } from 'next/server'
import { getAllHelpArticles } from '@/lib/help-articles'
import { retrieveAnswer, detectsQualificationIntent, CONFIDENCE_THRESHOLD } from '@/lib/buster/retrieval'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

function sanitizeQuestion(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim().slice(0, 500)
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit('buster-ask', ip, 20)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const d = body as Record<string, unknown>
  if (typeof d.question !== 'string' || d.question.trim().length === 0) {
    return NextResponse.json({ error: 'A question is required' }, { status: 400 })
  }
  const question = sanitizeQuestion(d.question)
  const route = typeof d.route === 'string' ? d.route.slice(0, 300) : null
  const visitorId = typeof d.visitorId === 'string' ? d.visitorId.slice(0, 64) : null
  const sessionId = typeof d.sessionId === 'string' ? d.sessionId.slice(0, 64) : null

  const qualificationIntent = detectsQualificationIntent(question)

  const articles = await getAllHelpArticles()
  const { article, confidence, relatedArticles } = retrieveAnswer(question, articles)
  const resolved = !!article && confidence >= CONFIDENCE_THRESHOLD

  let recordId: string | null = null
  try {
    const supabase = createMccLeadsAdminClient()
    const { data } = await supabase
      .from('buster_questions')
      .insert({
        question,
        matched_article_id: resolved ? article!.id : null,
        confidence,
        resolved,
        route,
        visitor_id: visitorId,
        session_id: sessionId,
      })
      .select('id')
      .single()
    recordId = data?.id || null
  } catch (err) {
    console.error('[buster-ask] Log error:', err instanceof Error ? err.message : 'unknown error')
  }

  if (qualificationIntent) {
    return NextResponse.json({
      recordId,
      type: 'qualification_handoff',
      message: 'It sounds like you want to know whether Metrix fits your business. A few quick questions will get you a real answer.',
      qualificationUrl: '/customer-care/qualify',
    })
  }

  if (!resolved) {
    return NextResponse.json({
      recordId,
      type: 'unknown',
      message: "I don't know that yet.",
      suggestions: articles.slice(0, 3).map((a) => ({ title: a.title, slug: a.slug, category: a.category })),
    })
  }

  return NextResponse.json({
    recordId,
    type: 'answer',
    answer: article!.answer,
    source: { title: article!.title, slug: article!.slug, sourcePath: article!.source_path, status: article!.status },
    confidence,
    relatedArticles: relatedArticles.map((a) => ({ title: a.title, slug: a.slug })),
  })
}

const VALID_ESCALATIONS = ['care_request', 'contact', 'help_center']

export async function PATCH(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const d = body as Record<string, unknown>
  const recordId = typeof d.recordId === 'string' ? d.recordId : null
  const escalatedTo = typeof d.escalatedTo === 'string' ? d.escalatedTo : null

  if (!recordId || !escalatedTo || !VALID_ESCALATIONS.includes(escalatedTo)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const supabase = createMccLeadsAdminClient()
    const { error } = await supabase.from('buster_questions').update({ escalated_to: escalatedTo }).eq('id', recordId)
    if (error) {
      console.error('[buster-ask] Escalation update error:', error.message)
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[buster-ask] Error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
