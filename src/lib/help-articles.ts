import { createMccLeadsAdminClient } from '@/lib/supabase/admin'

export interface HelpArticle {
  id: string
  slug: string
  title: string
  category: string
  answer: string
  source_path: string
  status: 'VERIFIED' | 'LIMITED' | 'PLANNED' | 'UNKNOWN'
  last_verified_date: string
  escalation_rule: string | null
}

export async function getAllHelpArticles(): Promise<HelpArticle[]> {
  try {
    const supabase = createMccLeadsAdminClient()
    const { data, error } = await supabase
      .from('help_articles')
      .select('id, slug, title, category, answer, source_path, status, last_verified_date, escalation_rule')
      .order('category', { ascending: true })
      .order('title', { ascending: true })

    if (error) {
      console.error('[help-articles] DB error:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('[help-articles] Error:', err)
    return []
  }
}

export async function getHelpArticleBySlug(slug: string): Promise<HelpArticle | null> {
  try {
    const supabase = createMccLeadsAdminClient()
    const { data, error } = await supabase
      .from('help_articles')
      .select('id, slug, title, category, answer, source_path, status, last_verified_date, escalation_rule')
      .eq('slug', slug)
      .single()

    if (error || !data) return null
    return data
  } catch (err) {
    console.error('[help-articles] Error:', err)
    return null
  }
}

export const HELP_CATEGORIES = [
  'What Metrix Does',
  'Revenue Recovery',
  'Leads and Estimate Follow-Up',
  'Buster',
  'Owner Approval and AI Controls',
  'Setup and First Value',
  'Existing CRM and Field-Service Software',
  'Pricing and Trial',
  'Security and Privacy',
  'Billing and Cancellation',
  'Resources and Calculators',
  'Troubleshooting',
  'Contact Support',
] as const
