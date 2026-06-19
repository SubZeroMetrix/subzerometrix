interface AnswerFirstProps {
  answer: string
  context: string
  lastReviewed: string
  reviewer: string
}

export function AnswerFirst({ answer, context, lastReviewed, reviewer }: AnswerFirstProps) {
  return (
    <div className="card border-brand-electric/30 mb-8">
      <p className="text-xs text-brand-cyan uppercase font-semibold tracking-wide mb-2">Quick Answer</p>
      <p className="text-lg text-white font-medium leading-relaxed">{answer}</p>
      <p className="text-sm text-gray-400 mt-3">{context}</p>
      <p className="text-xs text-gray-600 mt-4">
        Last reviewed {lastReviewed} by {reviewer}
      </p>
    </div>
  )
}
