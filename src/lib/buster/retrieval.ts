import type { HelpArticle } from '@/lib/help-articles'

// Deterministic keyword-overlap retrieval -- not a generative model, not
// an LLM call. Every answer is a real help_articles row, cited by
// article/source, with a confidence score computed from term overlap.
// This is intentional: the mission requires "no hallucination, no
// unrestricted LLM, every answer must identify its source" -- retrieval
// over approved content is the only way to guarantee that.

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'i', 'you', 'my', 'your',
  'what', 'how', 'why', 'when', 'where', 'who', 'which', 'this', 'that', 'to', 'of', 'in', 'on',
  'for', 'and', 'or', 'with', 'about', 'it', 'can', 'will', 'have', 'has', 'be', 'if', 'me',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

export interface RetrievalResult {
  article: HelpArticle | null
  confidence: number
  relatedArticles: HelpArticle[]
}

// Qualification-intent detection -- if the question is really about
// pricing/fit/implementation, Buster should hand off to the existing
// qualification flow rather than trying to answer generically.
const QUALIFICATION_TERMS = [
  'pricing', 'price', 'plan', 'plans', 'cost', 'implementation', 'implement',
  'team', 'business fit', 'fit for my business', 'grow', 'growth', 'trial', 'demo',
]

export function detectsQualificationIntent(question: string): boolean {
  const q = question.toLowerCase()
  return QUALIFICATION_TERMS.some((term) => q.includes(term))
}

export function retrieveAnswer(question: string, articles: HelpArticle[]): RetrievalResult {
  const queryTokens = new Set(tokenize(question))
  if (queryTokens.size === 0) {
    return { article: null, confidence: 0, relatedArticles: [] }
  }

  const scored = articles.map((article) => {
    const titleTokens = tokenize(article.title)
    const answerTokens = tokenize(article.answer)
    const categoryTokens = tokenize(article.category)

    let score = 0
    for (const t of Array.from(queryTokens)) {
      if (titleTokens.includes(t)) score += 3
      if (categoryTokens.includes(t)) score += 2
      if (answerTokens.includes(t)) score += 1
    }

    // Normalize against query length so short, precise matches don't lose
    // to long articles that happen to contain a stray shared word.
    const confidence = Math.min(1, score / (queryTokens.size * 3))

    return { article, score, confidence }
  })

  scored.sort((a, b) => b.score - a.score)

  const top = scored[0]
  if (!top || top.score === 0) {
    return { article: null, confidence: 0, relatedArticles: [] }
  }

  const relatedArticles = scored
    .slice(1, 4)
    .filter((s) => s.score > 0 && s.article.category === top.article.category)
    .map((s) => s.article)

  return { article: top.article, confidence: top.confidence, relatedArticles }
}

// Below this, Buster should say "I don't know that yet" rather than
// present a weak match as a confident answer.
export const CONFIDENCE_THRESHOLD = 0.34
