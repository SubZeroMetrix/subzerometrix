import type { HelpArticle } from '@/lib/help-articles'
import { STATIC_KNOWLEDGE_DOCS, type KnowledgeDoc } from '@/lib/buster/knowledge-sources'

// Intent-aware, deterministic retrieval -- NOT a vector-embedding
// semantic search and NOT an LLM call. No embeddings API or LLM
// credential is available in this environment, and the mission requires
// zero hallucination with every answer traceable to a real source, so
// this is built as: query-term expansion (mapping real-world phrasing to
// the concepts our content actually uses) + weighted term-overlap
// scoring across ALL indexed content (Help Center + pricing, resources,
// legal, about, customer care). This closes real intent gaps ("my
// company is missing calls" -> lead response / revenue recovery) without
// ever generating text that isn't a real, citable source.

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'i', 'you', 'my', 'your',
  'what', 'how', 'why', 'when', 'where', 'who', 'which', 'this', 'that', 'to', 'of', 'in', 'on',
  'for', 'and', 'or', 'with', 'about', 'it', 'can', 'will', 'have', 'has', 'be', 'if', 'me',
])

// Maps common real-world phrasing to the canonical concept terms our
// content actually contains. Expansion only ADDS candidate terms to
// search with -- it never removes or replaces the user's own words, so
// a direct keyword match still works exactly as before.
const CONCEPT_EXPANSIONS: Record<string, string[]> = {
  'missing calls': ['lead', 'response', 'follow-up', 'revenue'],
  'missed calls': ['lead', 'response', 'follow-up', 'revenue'],
  'not answering': ['lead', 'response', 'follow-up'],
  'losing money': ['revenue', 'leak', 'recovery', 'estimate'],
  'losing revenue': ['revenue', 'leak', 'recovery', 'estimate'],
  'losing customers': ['customer', 'reactivation', 'follow-up'],
  'too busy': ['owner', 'priorities', 'daily'],
  'disorganized': ['crm', 'pipeline', 'tracking'],
  'spreadsheet': ['crm', 'existing software', 'replace'],
  'quotes': ['estimate', 'follow-up'],
  'estimates going cold': ['estimate', 'follow-up', 'aging'],
  'forgetting': ['follow-up', 'tracking'],
  'reviews': ['reviews', 'referral'],
  'referrals': ['reviews', 'referral'],
  'how much': ['pricing', 'cost'],
  'expensive': ['pricing', 'cost'],
  'safe': ['security', 'privacy'],
  'trust': ['approval', 'control', 'security'],
  'control': ['approval', 'owner approval'],
  'ai taking over': ['approval', 'owner approval', 'autonomous'],
  'automatic': ['approval', 'owner approval', 'autonomous'],
  'get started': ['setup', 'first value'],
  'onboarding': ['setup', 'first value'],
  'switch': ['existing crm', 'replace', 'field-service'],
  'current system': ['existing crm', 'replace', 'field-service'],
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

function expandQuery(question: string): Set<string> {
  const lower = question.toLowerCase()
  const tokens = new Set(tokenize(question))
  for (const [phrase, concepts] of Object.entries(CONCEPT_EXPANSIONS)) {
    if (lower.includes(phrase)) {
      for (const concept of concepts) {
        for (const t of tokenize(concept)) tokens.add(t)
      }
    }
  }
  return tokens
}

export interface RetrievableDoc {
  id: string
  title: string
  category: string
  text: string
  source_path: string
  slug: string | null
  status: 'VERIFIED' | 'LIMITED' | 'PLANNED' | 'UNKNOWN' | null
}

export function buildIndex(articles: HelpArticle[]): RetrievableDoc[] {
  const fromArticles: RetrievableDoc[] = articles.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    text: a.answer,
    source_path: a.source_path,
    slug: a.slug,
    status: a.status,
  }))
  const fromStatic: RetrievableDoc[] = STATIC_KNOWLEDGE_DOCS.map((d: KnowledgeDoc) => ({
    id: d.id,
    title: d.title,
    category: d.category,
    text: d.text,
    source_path: d.source_path,
    slug: null,
    status: null,
  }))
  return [...fromArticles, ...fromStatic]
}

export interface RetrievalResult {
  doc: RetrievableDoc | null
  confidence: number
  qualityScore: number
  relatedDocs: RetrievableDoc[]
}

// previousCategory: session-only context (not persisted server-side
// beyond the existing question log) -- if the visitor's prior question
// matched a given category, give docs in that same category a small
// boost, since a follow-up question is often still on the same topic.
export function retrieveAnswer(question: string, docs: RetrievableDoc[], previousCategory?: string | null): RetrievalResult {
  const queryTokens = Array.from(expandQuery(question))
  if (queryTokens.length === 0) {
    return { doc: null, confidence: 0, qualityScore: 0, relatedDocs: [] }
  }

  const scored = docs.map((doc) => {
    const titleTokens = tokenize(doc.title)
    const textTokens = tokenize(doc.text)
    const categoryTokens = tokenize(doc.category)

    let score = 0
    for (const t of queryTokens) {
      if (titleTokens.includes(t)) score += 3
      if (categoryTokens.includes(t)) score += 2
      if (textTokens.includes(t)) score += 1
    }
    if (previousCategory && doc.category === previousCategory) {
      score += 1
    }

    const confidence = Math.min(1, score / (queryTokens.length * 3))
    return { doc, score, confidence }
  })

  scored.sort((a, b) => b.score - a.score)

  const top = scored[0]
  if (!top || top.score === 0) {
    return { doc: null, confidence: 0, qualityScore: 0, relatedDocs: [] }
  }

  const second = scored[1]
  // Quality score: how much more confident the top match is than the
  // runner-up. A high top confidence but a close second means the
  // question is ambiguous between two topics -- logged for admin review.
  const qualityScore = second && second.score > 0
    ? Math.max(0, (top.score - second.score) / top.score)
    : 1

  const relatedDocs = scored
    .slice(1, 4)
    .filter((s) => s.score > 0 && s.doc.category === top.doc.category)
    .map((s) => s.doc)

  return { doc: top.doc, confidence: top.confidence, qualityScore, relatedDocs }
}

const QUALIFICATION_TERMS = [
  'pricing', 'price', 'plan', 'plans', 'cost', 'implementation', 'implement',
  'team', 'business fit', 'fit for my business', 'grow', 'growth', 'trial', 'demo',
]

export function detectsQualificationIntent(question: string): boolean {
  const q = question.toLowerCase()
  return QUALIFICATION_TERMS.some((term) => q.includes(term))
}

export const CONFIDENCE_THRESHOLD = 0.34
