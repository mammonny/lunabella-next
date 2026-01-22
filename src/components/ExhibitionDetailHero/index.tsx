'use client'

import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface ExhibitionDetailHeroProps {
  name: string
  date: string | null
  mainImage: MediaType | null
  location?: string | null
  awardsCount?: number
}

export const ExhibitionDetailHero: React.FC<ExhibitionDetailHeroProps> = ({
  name,
  date,
  mainImage,
  location,
  awardsCount = 0,
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const year = date ? new Date(date).getFullYear() : null

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-[#faf8f5] overflow-hidden">
      {/* Pattern background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url('/lunabella-pattern.svg')`,
          backgroundSize: '1200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Decorative year watermark */}
      {year && (
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:block">
          <span
            className="text-[20vw] font-heading font-bold leading-none select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(165, 138, 27, 0.12)',
              letterSpacing: '-0.05em'
            }}
          >
            {year}
          </span>
        </div>
      )}

      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
            {/* Ornamental line + category */}
            <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
              <span className="w-12 h-[2px] bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
              <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.35em] uppercase">
                Exposición Canina
              </span>
            </div>

            {/* Name */}
            <h1
              className="text-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-gray-900 mb-6 leading-[1.08] animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              {name}
            </h1>

            {/* Details */}
            <div
              className="space-y-4 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {formattedDate && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-[#a58a1b]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#a58a1b]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{formattedDate}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 bg-[#a58a1b]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#a58a1b]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{location}</span>
                </div>
              )}
            </div>

            {/* Awards badge */}
            {awardsCount > 0 && (
              <div
                className="inline-flex items-center gap-4 bg-white border border-[#ece8e1] px-6 py-4 animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#a58a1b] to-[#8a7316] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M8 12.5V20l4-2 4 2v-7.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-heading font-medium text-gray-900">
                    {awardsCount}
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-[0.15em]">
                    {awardsCount === 1 ? 'Premio obtenido' : 'Premios obtenidos'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
            <div
              className="relative animate-fade-in-up"
              style={{ animationDelay: '0.15s' }}
            >
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#a58a1b]/20 pointer-events-none hidden md:block" />

              {/* Gold corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 hidden md:block">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#a58a1b]" />
                <div className="absolute top-0 left-0 w-[2px] h-full bg-[#a58a1b]" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 hidden md:block">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#a58a1b]" />
                <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#a58a1b]" />
              </div>

              {/* Image container - constrained aspect ratio */}
              <div className="relative aspect-[4/3] bg-[#ece8e1] overflow-hidden">
                {mainImage && typeof mainImage !== 'string' ? (
                  <Media
                    fill
                    priority
                    imgClassName="object-cover object-center"
                    resource={mainImage}
                  />
                ) : (
                  // Placeholder when no image
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="golden-silhouette-lg opacity-20" />
                  </div>
                )}

                {/* Subtle overlay for consistency */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#a58a1b]/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
