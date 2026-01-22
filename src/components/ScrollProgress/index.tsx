'use client'

/**
 * ScrollProgress - Fixed corner indicator showing page scroll progress
 * The Golden Retriever silhouette fills with gold as user scrolls
 */

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      setScrollProgress(progress)
      setIsVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Container with subtle shadow */}
      <div className="relative group cursor-pointer" title={`${Math.round(scrollProgress)}% leído`}>
        {/* Background silhouette (empty state) */}
        <div
          className="w-12 h-8 transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: '#ece8e1',
            maskImage: `url('/silueta-golden.svg')`,
            WebkitMaskImage: `url('/silueta-golden.svg')`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
          }}
        />

        {/* Filled silhouette (progress indicator) */}
        <div
          className="absolute inset-0 w-12 h-8 transition-transform duration-300 group-hover:scale-110"
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
            clipPath: `inset(${100 - scrollProgress}% 0 0 0)`,
            transition: 'clip-path 0.1s ease-out',
          }}
        />

        {/* Percentage tooltip on hover */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[#ece8e1] text-xs font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {Math.round(scrollProgress)}%
        </div>
      </div>
    </div>
  )
}
