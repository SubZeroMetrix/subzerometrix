interface TldrBlockProps {
  points: string[]
}

export function TldrBlock({ points }: TldrBlockProps) {
  return (
    <div className="card border-brand-cyan/20 mb-8">
      <p className="text-xs text-brand-cyan uppercase font-semibold tracking-wide mb-3">TL;DR</p>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-brand-cyan mt-0.5 shrink-0">&bull;</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
