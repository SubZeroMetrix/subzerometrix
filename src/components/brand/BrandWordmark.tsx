interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'light' | 'dark'
}

// Text wordmark. No verified SubZero Metrix-specific logo asset exists yet
// (the only logo file in this repo belongs to a different product, Metrix
// Command Center) -- rendering an accurate text mark rather than borrowing
// another brand's logo.
const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

export function BrandWordmark({ size = 'md', className = '', variant = 'dark' }: BrandWordmarkProps) {
  const colorClass = variant === 'dark' ? 'text-white' : 'text-gray-900'
  return (
    <span className={`inline-flex items-baseline font-bold tracking-tight ${sizeClasses[size]} ${colorClass} ${className}`}>
      Sub<span className="text-brand-cyan">Zero</span>Metrix
    </span>
  )
}
