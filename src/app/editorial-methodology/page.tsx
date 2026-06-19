import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Editorial Methodology',
  description: 'How SubZero Metrix scores, ranks, and recommends software tools — our four-factor evaluation model and transparency standards.',
  path: '/editorial-methodology',
})

export default function EditorialMethodologyPage() {
  return (
    <div className="py-16">
      <div className="section-container max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-4">Editorial Methodology</h1>
        <p className="text-xs text-gray-500 mb-8">Last updated June 19, 2026</p>

        <div className="prose-content">
          <p>
            SubZero Metrix evaluates software tools using a structured,
            transparent methodology. Every recommendation reflects four
            independent evaluation factors. This page explains how each factor
            works and how affiliate compensation is handled.
          </p>

          <h2>The Four-Factor Evaluation Model</h2>

          <h3>1. User Fit Score (Primary Weight)</h3>
          <p>
            The User Fit Score measures how well a product matches a specific
            user&apos;s goals, stage, budget, and technical comfort. It is the
            dominant factor in all public recommendations. A product with a high
            User Fit Score for a given scenario is recommended regardless of
            affiliate relationship.
          </p>
          <p>Inputs to User Fit Score include:</p>
          <ul>
            <li>Use-case alignment (what the user needs vs. what the tool provides)</li>
            <li>Stage appropriateness (beginner, growing, established)</li>
            <li>Budget match (free plans, pricing tiers, cost trajectory)</li>
            <li>Technical complexity vs. user comfort level</li>
            <li>Strengths relative to the stated goal</li>
            <li>Limitations that may block the user&apos;s primary use case</li>
          </ul>

          <h3>2. Editorial Confidence</h3>
          <p>
            Editorial Confidence reflects how thoroughly we have been able to
            evaluate a product. High confidence means features, pricing, and
            limitations have been verified against official vendor sources.
            Lower confidence means we are relying on limited or older information.
          </p>
          <p>
            Products with low Editorial Confidence may still appear in listings
            but will not be featured as primary recommendations until confidence
            improves.
          </p>

          <h3>3. Verification Freshness</h3>
          <p>
            Every product listing includes a last-verified date. Verification
            Freshness tracks how recently product details — features, pricing,
            free plan status, and limitations — have been checked against
            vendor-published sources.
          </p>
          <p>
            Stale listings are flagged for review. We aim to re-verify core
            product details at least quarterly, though high-traffic comparisons
            may be reviewed more frequently.
          </p>

          <h3>4. Commercial Opportunity Score (Internal Only)</h3>
          <p>
            The Commercial Opportunity Score is an internal metric that tracks the
            affiliate economics of a product — commission structure, cookie
            duration, payout thresholds, and program terms.
          </p>
          <p>
            <strong>
              This score is used for internal business planning only. It does not
              control, influence, or secretly weight public rankings or
              recommendations.
            </strong>
          </p>
          <p>
            A product with a high Commercial Opportunity Score but poor User Fit
            will not be recommended over a product that genuinely fits the
            user&apos;s needs. A product with no affiliate program at all may still
            be the primary recommendation if it is the best fit.
          </p>

          <h2>How Affiliate Compensation Is Handled</h2>
          <ul>
            <li>Affiliate relationships are disclosed on every page that contains affiliate links.</li>
            <li>Commission rates do not determine ranking position.</li>
            <li>Products without affiliate programs are included when editorially relevant.</li>
            <li>The Commercial Opportunity Score is never shown to visitors or used in public ranking logic.</li>
            <li>We do not accept payment for favorable reviews.</li>
          </ul>

          <h2>Tool Finder Logic</h2>
          <p>
            The SubZero Metrix Tool Finder uses deterministic rule-based logic.
            Recommendations are computed from explicit conditions matching user
            answers to product fit criteria. There are no AI-generated or
            randomized recommendations. Every recommendation path is auditable.
          </p>

          <h2>Corrections and Updates</h2>
          <p>
            If you find an error in any product listing, comparison, or
            recommendation, please{' '}
            <Link href="/contact">report it</Link>. We investigate and correct
            verified issues promptly.
          </p>

          <p className="text-xs text-gray-600 mt-8 border-t border-gray-800 pt-4">
            See also:{' '}
            <Link href="/editorial-policy" className="text-gray-400 hover:text-brand-cyan underline">
              Editorial Policy
            </Link>
            {' | '}
            <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-brand-cyan underline">
              Affiliate Disclosure
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
