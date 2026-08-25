'use client'

export default function CitationIntelligenceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <p className="text-red-400 font-medium">Something went wrong loading this view.</p>
      <p className="mt-2 text-sm text-gray-500">{error.message}</p>
      <button onClick={reset} className="btn-secondary mt-4">Try again</button>
    </div>
  )
}
