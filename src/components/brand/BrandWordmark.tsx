import Image from 'next/image'

interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Renders the real, approved Metrix Command Center logo asset exactly as
// supplied — no redraw, recolor, or recreation. The logo already includes
// its own wordmark text, so nothing is composited on top of it.
const sizeConfig = {
  sm: { width: 120, height: 42 },
  md: { width: 160, height: 56 },
  lg: { width: 220, height: 77 },
}

export function BrandWordmark({ size = 'md', className = '' }: BrandWordmarkProps) {
  const { width, height } = sizeConfig[size]
  return (
    <Image
      src="/brand/metrix-command-center-logo.png"
      alt="Metrix Command Center"
      width={width}
      height={height}
      priority
      className={className}
      style={{ width, height, objectFit: 'contain' }}
    />
  )
}
