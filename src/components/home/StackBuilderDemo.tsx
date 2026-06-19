'use client'

import { useState } from 'react'
import Link from 'next/link'

const steps = [
  { key: 'goal', label: 'Goal' },
  { key: 'stage', label: 'Stage' },
  { key: 'budget', label: 'Budget' },
  { key: 'needs', label: 'Needs' },
  { key: 'match', label: 'Match' },
  { key: 'compare', label: 'Compare' },
  { key: 'stack', label: 'Final Stack' },
]

const stepContent: Record<string, { heading: string; items: string[] }> = {
  goal: {
    heading: 'What are you building?',
    items: ['An online business from scratch', 'A website or blog', 'An email list or newsletter', 'An online store', 'A B2B outreach system'],
  },
  stage: {
    heading: 'Where are you now?',
    items: ['Just starting — no audience yet', 'Early stage — small audience', 'Growing — ready to invest', 'Established — optimizing'],
  },
  budget: {
    heading: 'Monthly software budget?',
    items: ['Free only', 'Under $30/month', '$30–$100/month', 'Over $100/month'],
  },
  needs: {
    heading: 'What do you need first?',
    items: ['Website or landing page', 'Email marketing', 'Selling products', 'Marketing automation', 'SEO and content', 'Cold outreach'],
  },
  match: {
    heading: 'Matching software to your needs…',
    items: ['Evaluating User Fit…', 'Checking Budget Alignment…', 'Reviewing Feature Requirements…', 'Assessing Editorial Confidence…'],
  },
  compare: {
    heading: 'Comparing top candidates',
    items: ['Systeme.io — All-in-One', 'MailerLite — Email Marketing', 'Shopify — E-Commerce'],
  },
  stack: {
    heading: 'Your Recommended Stack',
    items: ['Website & Funnels → Systeme.io', 'Email Marketing → MailerLite', 'SEO → Deferred until growth stage', 'E-Commerce → Not needed yet', 'Automation → Included in Systeme.io'],
  },
}

export function StackBuilderDemo() {
  const [activeStep, setActiveStep] = useState(0)
  const current = steps[activeStep]
  const content = stepContent[current.key]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setActiveStep(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              i === activeStep
                ? 'bg-brand-electric text-white shadow-md'
                : i < activeStep
                  ? 'bg-blue-50 text-brand-electric'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 font-medium">SubZero Metrix — Stack Builder</span>
          <span className="text-xs text-gray-300">Step {activeStep + 1} of {steps.length}</span>
        </div>

        <div className="p-8 min-h-[280px]">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{content.heading}</h3>
          <div className="space-y-3">
            {content.items.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  current.key === 'stack'
                    ? 'bg-blue-50 border border-blue-100'
                    : current.key === 'match'
                      ? 'bg-gray-50 border border-gray-100'
                      : 'bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 cursor-pointer'
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {current.key === 'stack' && (
                  <span className="w-6 h-6 rounded-full bg-brand-electric text-white text-xs flex items-center justify-center font-bold shrink-0">
                    &#10003;
                  </span>
                )}
                {current.key === 'match' && (
                  <span className="w-5 h-5 rounded-full border-2 border-brand-electric border-t-transparent animate-spin shrink-0" />
                )}
                {current.key !== 'stack' && current.key !== 'match' && (
                  <span className="w-2 h-2 rounded-full bg-brand-electric shrink-0" />
                )}
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400 italic">Demonstration preview</p>
          <Link href="/tool-finder" className="text-sm font-semibold text-brand-electric hover:text-blue-700 transition-colors">
            Build My Stack &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
