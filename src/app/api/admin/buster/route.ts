import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/supabase/admin-auth'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  let user
  try {
    user = await getAdminUser()
  } catch (err) {
    console.error('[admin-buster] Auth check error:', err instanceof Error ? err.message : 'unknown error')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createMccLeadsAdminClient()

    const { data: recent, error } = await supabase
      .from('buster_questions')
      .select('id, question, confidence, quality_score, resolved, escalated_to, route, created_at, matched_source_title, matched_source_path')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      console.error('[admin-buster] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
    }

    const rows = recent || []
    const total = rows.length
    const resolvedCount = rows.filter((r) => r.resolved).length
    const unresolvedCount = total - resolvedCount
    const escalatedCount = rows.filter((r) => r.escalated_to).length

    const frequency = new Map<string, number>()
    for (const r of rows) {
      const key = r.question.trim().toLowerCase()
      frequency.set(key, (frequency.get(key) || 0) + 1)
    }
    const mostAsked = Array.from(frequency.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }))

    // Frequently requested but never resolved -- the real backlog for
    // new Help Center content, not just "asked more than once."
    const unresolvedFrequency = new Map<string, number>()
    for (const r of rows) {
      if (r.resolved) continue
      const key = r.question.trim().toLowerCase()
      unresolvedFrequency.set(key, (unresolvedFrequency.get(key) || 0) + 1)
    }
    const missingTopics = Array.from(unresolvedFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([question, count]) => ({ question, count }))

    const sourceUsage = new Map<string, number>()
    for (const r of rows) {
      if (r.matched_source_title) sourceUsage.set(r.matched_source_title, (sourceUsage.get(r.matched_source_title) || 0) + 1)
    }
    const topSources = Array.from(sourceUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }))

    // Resolved (passed the confidence threshold) but with a low quality
    // score -- meaning a second document scored almost as well as the
    // top match. These are the answers most worth a human double-check.
    const weakRetrievals = rows
      .filter((r) => r.resolved && typeof r.quality_score === 'number' && r.quality_score < 0.3)
      .slice(0, 15)

    const buckets = { high: 0, medium: 0, low: 0, none: 0 }
    for (const r of rows) {
      const c = r.confidence || 0
      if (c === 0) buckets.none++
      else if (c < 0.34) buckets.low++
      else if (c < 0.7) buckets.medium++
      else buckets.high++
    }

    return NextResponse.json({
      summary: { total, resolvedCount, unresolvedCount, escalatedCount },
      recent: rows,
      mostAsked,
      missingTopics,
      topSources,
      weakRetrievals,
      confidenceDistribution: buckets,
      unanswered: rows.filter((r) => !r.resolved),
    })
  } catch (err) {
    console.error('[admin-buster] Error:', err)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
