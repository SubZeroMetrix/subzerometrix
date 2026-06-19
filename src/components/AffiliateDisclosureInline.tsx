import Link from 'next/link'

export function AffiliateDisclosureInline() {
  return (
    <p className="text-xs text-gray-500 mt-6 border-t border-gray-200 pt-4">
      <strong className="text-gray-600">Disclosure:</strong> SubZero Metrix may earn a commission if you
      sign up through links on this page. This does not affect our editorial
      recommendations.{' '}
      <Link href="/affiliate-disclosure" className="text-brand-electric hover:text-blue-700 underline decoration-brand-electric/30 hover:decoration-brand-electric">
        Learn more
      </Link>
    </p>
  )
}
