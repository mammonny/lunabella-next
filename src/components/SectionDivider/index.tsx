/**
 * SectionDivider - Elegant divider with Golden Retriever silhouette
 * Used sparingly between major sections as a brand signature
 */

interface SectionDividerProps {
  className?: string
  variant?: 'default' | 'subtle' | 'gold'
}

export default function SectionDivider({ className = '', variant = 'default' }: SectionDividerProps) {
  const lineColor = variant === 'gold'
    ? 'bg-[#a58a1b]'
    : variant === 'subtle'
      ? 'bg-[#a58a1b]/20'
      : 'bg-[#a58a1b]/40'

  const silhouetteOpacity = variant === 'gold'
    ? 'opacity-100'
    : variant === 'subtle'
      ? 'opacity-40'
      : 'opacity-60'

  return (
    <div className={`relative flex items-center justify-center py-16 ${className}`}>
      {/* Left line */}
      <div className={`flex-1 h-px ${lineColor} max-w-[200px]`} />

      {/* Silhouette container */}
      <div className="relative mx-8 group">
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 blur-xl transition-opacity duration-700 opacity-0 group-hover:opacity-30"
          style={{ backgroundColor: '#a58a1b' }}
        />

        {/* Golden Retriever silhouette */}
        <div
          className={`relative w-16 h-11 transition-all duration-500 group-hover:scale-110 ${silhouetteOpacity}`}
          style={{
            backgroundColor: '#a58a1b',
            maskImage: `url('/silueta-golden.svg')`,
            WebkitMaskImage: `url('/silueta-golden.svg')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      </div>

      {/* Right line */}
      <div className={`flex-1 h-px ${lineColor} max-w-[200px]`} />
    </div>
  )
}
