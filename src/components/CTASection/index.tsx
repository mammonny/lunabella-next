import Link from 'next/link'
import type { ReactNode } from 'react'

interface CTASectionProps {
  label: string
  title: ReactNode
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export default function CTASection({
  label,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-lunabella-diagonal">
      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-[#a58a1b]" />
            <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
              {label}
            </span>
            <span className="w-16 h-px bg-[#a58a1b]" />
          </div>

          <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
            {title}
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryHref}
              className="group inline-flex items-center justify-center gap-3 px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] bg-[#000] text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
            >
              {primaryLabel}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] border border-gray-300 text-gray-600 transition-all duration-300 ease-out hover:bg-black/5 hover:border-gray-400"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
