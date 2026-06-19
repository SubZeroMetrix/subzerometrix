import Link from 'next/link'

interface LastReviewedProps {
  date: string
  reviewer: string
  reviewerUrl?: string
}

export function LastReviewed({ date, reviewer, reviewerUrl }: LastReviewedProps) {
  return (
    <p className="text-xs text-gray-500 mb-6">
      Last reviewed {date} by{' '}
      {reviewerUrl ? (
        <Link href={reviewerUrl} className="text-gray-400 hover:text-brand-cyan underline">{reviewer}</Link>
      ) : (
        <span className="text-gray-400">{reviewer}</span>
      )}
      {' | '}
      <Link href="/contact" className="text-gray-400 hover:text-brand-cyan underline">Report a correction</Link>
    </p>
  )
}
