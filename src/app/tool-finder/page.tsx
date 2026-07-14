'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toolFinderQuestions, computeRecommendation, type ToolFinderResult } from '@/../../content/tool-finder'
import { seedProducts } from '@/../../content/products'
import { AffiliateDisclosureInline } from '@/components/AffiliateDisclosureInline'

export default function ToolFinderPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<ToolFinderResult | null>(null)

  function selectAnswer(key: string, value: string) {
    const updated = { ...answers, [key]: value }
    setAnswers(updated)

    if (step < toolFinderQuestions.length - 1) {
      setStep(step + 1)
    } else {
      const rec = computeRecommendation(updated)
      setResult(rec)
    }
  }

  function reset() {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  if (result) {
    const primary = seedProducts.find((p) => p.slug === result.primarySlug)
    const secondary = result.secondarySlug
      ? seedProducts.find((p) => p.slug === result.secondarySlug)
      : null

    return (
      <div className="py-20">
        <div className="section-container max-w-2xl">
          <p className="text-label text-brand-electric mb-3">Your Stack</p>
          <h1 className="text-headline text-gray-900 mb-8">Your Recommended Stack</h1>

          <AffiliateDisclosureInline />

          {primary && (
            <div className="card-panel mt-6 mb-6 border-t-4 border-t-brand-electric">
              <p className="text-label text-brand-electric mb-2">Primary Recommendation</p>
              <h2 className="text-subhead text-gray-900 mb-3">{primary.name}</h2>
              <p className="text-gray-600 mb-5">{result.reasoning}</p>

              <div className="space-y-3 text-sm">
                <div><span className="text-gray-400 font-medium">Best use case:</span> <span className="text-gray-700 ml-1">{result.bestUseCase}</span></div>
                <div><span className="text-gray-400 font-medium">Complexity:</span> <span className="text-gray-700 ml-1">{result.complexity}</span></div>
                <div><span className="text-gray-400 font-medium">Pricing:</span> <span className="text-gray-700 ml-1">{result.pricingNote}</span></div>
                <div className="bg-amber-50 rounded-lg p-3 mt-2">
                  <span className="text-amber-700 text-xs font-semibold">Caveat:</span>
                  <span className="text-amber-800 ml-1 text-xs">{result.caveat}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/go/${primary.slug}?src=tool-finder`} className="btn-primary" rel="sponsored nofollow">
                  Visit {primary.name}
                </Link>
              </div>
            </div>
          )}

          {secondary && (
            <div className="card-panel mb-6">
              <p className="text-label mb-2">Also Consider</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{secondary.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{secondary.description}</p>
              <Link href={`/tools/${secondary.slug}`} className="text-sm text-brand-electric font-medium hover:text-blue-700">
                Learn more about {secondary.name} &rarr;
              </Link>
            </div>
          )}

          <div className="flex gap-4 mt-10">
            <button onClick={reset} className="btn-secondary">Start Over</button>
            <Link href="/compare" className="btn-secondary">Browse Comparisons</Link>
          </div>

          <AffiliateDisclosureInline />
        </div>
      </div>
    )
  }

  const question = toolFinderQuestions[step]

  return (
    <div className="py-20">
      <div className="section-container max-w-2xl">
        <p className="text-label text-brand-electric mb-3">Tool Finder</p>
        <h1 className="text-headline text-gray-900 mb-2">Build Your Stack</h1>
        <p className="text-body-lg mb-10">
          Answer {toolFinderQuestions.length} quick questions to get a personalized recommendation.
        </p>

        <div className="mb-8">
          <div className="flex gap-1.5 mb-3">
            {toolFinderQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-brand-electric' : 'bg-surface-border'
                }`}
              />
            ))}
          </div>
          <p className="text-label">
            Question {step + 1} of {toolFinderQuestions.length}
          </p>
        </div>

        <h2 className="text-subhead text-gray-900 mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectAnswer(question.key, opt.value)}
              className="w-full text-left card-panel hover:border-brand-electric/40 hover:shadow-panel-lg transition-all duration-200 group"
            >
              <span className="text-sm text-gray-700 group-hover:text-brand-electric transition-colors font-medium">
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            &larr; Back
          </button>
        )}
      </div>
    </div>
  )
}
