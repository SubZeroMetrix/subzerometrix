import Link from 'next/link'

export function AffiliateDisclosureInline() {
  return (
    <p className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-4">
      <strong>Disclosure:</strong> SubZero Metrix may earn a commission if you
      sign up through links on this page. This does not affect our editorial
      recommendations.{' '}
      <Link href="/affiliate-disclosure" className="text-gray-400 hover:text-brand-cyan underline">
        Learn more
      </Link>
    </p>
  )
}
