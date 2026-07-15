'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { trackLandingEvent } from '@/lib/landing-events'

interface Suggestion { title: string; slug: string; category?: string }
interface RelatedArticle { title: string; slug: string }

type MessageRole = 'user' | 'buster'
interface Message {
  id: string
  role: MessageRole
  text: string
  source?: { title: string; slug: string; sourcePath: string; status: string }
  confidence?: number
  relatedArticles?: RelatedArticle[]
  type?: 'answer' | 'unknown' | 'qualification_handoff'
  suggestions?: Suggestion[]
  recordId?: string | null
  escalated?: string | null
}

const SUGGESTED_PROMPTS = [
  'What does Metrix do?',
  'Is this right for my business?',
  "What's included?",
  'Compare plans.',
  'How do I get started?',
  'Show me the Help Center.',
  'Contact support.',
  'Book a demo.',
]

function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('szm_visitor_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('szm_visitor_id', id)
  }
  return id
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = sessionStorage.getItem('szm_session_id')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('szm_session_id', id)
  }
  return id
}

export function BusterChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'buster',
      text: "Hi, I'm Buster. Ask me anything about Metrix — what it does, pricing, whether it fits your business, or how to get started. I only answer from our real Help Center content, so if I don't know something, I'll say so.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function ask(question: string) {
    if (!question.trim() || loading) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: question }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/buster/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          route: typeof window !== 'undefined' ? window.location.pathname : '/buster',
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
        }),
      })
      const data = await res.json()

      let busterMsg: Message
      if (data.type === 'answer') {
        busterMsg = {
          id: crypto.randomUUID(),
          role: 'buster',
          text: data.answer,
          source: data.source,
          confidence: data.confidence,
          relatedArticles: data.relatedArticles,
          type: 'answer',
          recordId: data.recordId,
        }
        trackLandingEvent('help_answer_helpful', { confidence: data.confidence }, data.recordId || undefined)
      } else if (data.type === 'qualification_handoff') {
        busterMsg = { id: crypto.randomUUID(), role: 'buster', text: data.message, type: 'qualification_handoff', recordId: data.recordId }
      } else {
        busterMsg = {
          id: crypto.randomUUID(),
          role: 'buster',
          text: data.message || "I don't know that yet.",
          type: 'unknown',
          suggestions: data.suggestions,
          recordId: data.recordId,
        }
      }
      setMessages((prev) => [...prev, busterMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'buster', text: 'Something went wrong on my end. Please try again, or use the Help Center directly.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function escalate(recordId: string | null | undefined, target: 'care_request' | 'contact' | 'help_center', msgId: string) {
    if (recordId) {
      fetch('/api/buster/ask', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, escalatedTo: target }),
      }).catch(() => {})
    }
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, escalated: target } : m)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="card-panel flex flex-col h-[600px] max-h-[75vh]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1" aria-live="polite" aria-label="Conversation with Buster">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'user' ? 'bg-brand-electric text-white' : 'bg-gray-50 text-gray-900 border border-surface-border'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

              {m.type === 'answer' && m.source && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  <p>
                    Source: <Link href={`/help/${m.source.slug}`} className="text-brand-electric underline">{m.source.title}</Link>
                    {m.source.status !== 'VERIFIED' && <span className="ml-1 text-amber-700">({m.source.status})</span>}
                    {typeof m.confidence === 'number' && <span className="ml-1">&middot; confidence {Math.round(m.confidence * 100)}%</span>}
                  </p>
                  {m.relatedArticles && m.relatedArticles.length > 0 && (
                    <p className="mt-1">
                      Related:{' '}
                      {m.relatedArticles.map((a, i) => (
                        <span key={a.slug}>
                          <Link href={`/help/${a.slug}`} className="text-brand-electric underline">{a.title}</Link>
                          {i < m.relatedArticles!.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}

              {m.type === 'qualification_handoff' && !m.escalated && (
                <Link
                  href="/customer-care/qualify"
                  className="btn-primary text-xs inline-block mt-3"
                  onClick={() => escalate(m.recordId, 'care_request', m.id)}
                >
                  Start the quick questions
                </Link>
              )}

              {m.type === 'unknown' && !m.escalated && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  {m.suggestions && m.suggestions.length > 0 && (
                    <p className="text-xs text-gray-600">
                      You might find these useful:{' '}
                      {m.suggestions.map((s, i) => (
                        <span key={s.slug}>
                          <Link href={`/help/${s.slug}`} className="text-brand-electric underline">{s.title}</Link>
                          {i < m.suggestions!.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => escalate(m.recordId, 'care_request', m.id)}
                      className="text-xs font-semibold text-brand-electric border border-brand-electric/30 rounded-full px-3 py-1.5 hover:bg-brand-electric/5"
                    >
                      Create a Care request
                    </button>
                    <Link
                      href="/help"
                      onClick={() => escalate(m.recordId, 'help_center', m.id)}
                      className="text-xs font-semibold text-brand-electric border border-brand-electric/30 rounded-full px-3 py-1.5 hover:bg-brand-electric/5"
                    >
                      Browse Help Center
                    </Link>
                    <Link
                      href="/customer-care"
                      onClick={() => escalate(m.recordId, 'contact', m.id)}
                      className="text-xs font-semibold text-brand-electric border border-brand-electric/30 rounded-full px-3 py-1.5 hover:bg-brand-electric/5"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              )}

              {m.escalated && (
                <p className="text-xs text-emerald-700 mt-2">Got it — heading there now.</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-surface-border rounded-2xl px-4 py-3 text-sm text-gray-500">Thinking...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4 pt-4 border-t border-surface-border">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => ask(p)}
              className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-surface-border">
        <label htmlFor="buster-input" className="sr-only">Ask Buster a question</label>
        <input
          id="buster-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          maxLength={500}
          className="flex-1 px-4 py-2.5 rounded-full bg-surface-light-muted border border-surface-border text-gray-900 placeholder-gray-400 focus:border-brand-electric focus:ring-1 focus:ring-brand-electric focus:outline-none"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-6 disabled:opacity-50">
          Ask
        </button>
      </form>
    </div>
  )
}
