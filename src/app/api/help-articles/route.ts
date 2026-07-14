import { NextRequest, NextResponse } from 'next/server'
import { createMccLeadsAdminClient } from '@/lib/supabase/admin'

// Read-only, public-safe listing of curated help articles. Reads go
// through the service role server-side (RLS on help_articles blocks
// anon entirely) rather than exposing any table to the browser directly.
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  const search = request.nextUrl.searchParams.get('q')

  try {
    const supabase = createMccLeadsAdminClient()
    let query = supabase
      .from('help_articles')
      .select('id, slug, title, category, answer, source_path, status, last_verified_date')
      .order('category', { ascending: true })
      .order('title', { ascending: true })

    if (category) query = query.eq('category', category)
    if (search && search.trim().length > 0) {
      const term = search.trim().slice(0, 100)
      query = query.or(`title.ilike.%${term}%,answer.ilike.%${term}%`)
    }

    const { data, error } = await query
    if (error) {
      console.error('[help-articles] DB error:', error.message)
      return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 })
    }

    return NextResponse.json({ articles: data || [] })
  } catch (err) {
    console.error('[help-articles] Error:', err)
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 })
  }
}
