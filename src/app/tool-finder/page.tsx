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
      <div className="py-16">
        <div className="section-container max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-8">Your Recommendation</h1>

          <AffiliateDisclosureInline />

          {primary && (
            <div className="card mt-6 mb-6">
              <p className="text-xs text-brand-cyan uppercase font-semibold mb-2">Primary Recommendation</p>
              <h2 className="text-xl font-bold text-white mb-2">{primary.name}</h2>
              <p className="text-sm text-gray-300 mb-4">{result.reasoning}</p>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Best use case:</span>
                  <span className="text-gray-300 ml-2">{result.bestUseCase}</span>
                </div>
                <div>
                  <span className="text-gray-500">Complexity:</span>
                  <span className="text-gray-300 ml-2">{result.complexity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Pricing:</span>
                  <span className="text-gray-300 ml-2">{result.pricingNote}</span>
                </div>
                <div>
                  <span className="text-amber-400 text-xs">Caveat:</span>
                  <span className="text-gray-400 ml-2 text-xs">{result.caveat}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/go/${primary.slug}?src=tool-finder`}
                  className="btn-primary"
                  rel="sponsored nofollow"
                >
                  Visit {primary.name}
                </Link>
              </div>
            </div>
          )}

          {secondary && (
            <div className="card mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Also Consider</p>
              <h3 className="text-lg font-bold text-white mb-2">{secondary.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{secondary.description}</p>
              <Link
                href={`/tools/${secondary.slug}`}
                className="text-sm text-brand-cyan hover:text-brand-cyan-light"
              >
                Learn more about {secondary.name} &rarr;
              </Link>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button onClick={reset} className="btn-secondary">
              Start Over
            </button>
            <Link href="/compare" className="btn-secondary">
              Browse Comparisons
            </Link>
          </div>

          <AffiliateDisclosureInline />
        </div>
      </div>
    )
  }

  const question = toolFinderQuestions[step]

  return (
    <div className="py-16">
      <div className="section-container max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Tool Finder</h1>
        <p className="text-gray-400 mb-8">
          Answer {toolFinderQuestions.length} quick questions to get a personalized
          recommendation.
        </p>

        <div className="mb-6">
          <div className="flex gap-1 mb-4">
            {toolFinderQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= step ? 'bg-brand-electric' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Question {step + 1} of {toolFinderQuestions.length}
          </p>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectAnswer(question.key, opt.value)}
              className="w-full text-left card hover:border-brand-electric/60 transition-colors group"
            >
              <span className="text-sm text-gray-200 group-hover:text-brand-cyan transition-colors">
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 text-sm text-gray-500 hover:text-gray-300"
          >
            &larr; Back
          </button>
        )}
      </div>
    </div>
  )
}
