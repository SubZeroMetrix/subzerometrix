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
      .select('id, question, confidence, resolved, escalated_to, route, created_at, matched_article_id, help_articles(title, slug)')
      .order('created_at', { ascending: false })
      .limit(100)

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

    const sourceUsage = new Map<string, number>()
    for (const r of rows) {
      const title = (r as unknown as { help_articles?: { title: string } }).help_articles?.title
      if (title) sourceUsage.set(title, (sourceUsage.get(title) || 0) + 1)
    }
    const topSources = Array.from(sourceUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }))

    return NextResponse.json({
      summary: { total, resolvedCount, unresolvedCount, escalatedCount },
      recent: rows,
      mostAsked,
      topSources,
      unanswered: rows.filter((r) => !r.resolved),
    })
  } catch (err) {
    console.error('[admin-buster] Error:', err)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
