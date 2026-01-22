'use client'

import React from 'react'
import Link from 'next/link'
import type { Exhibition, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface ExhibitionCardProps {
  exhibition: Exhibition | null | undefined
  className?: string
  variant?: 'default' | 'premium' | 'compact'
}

export const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
  className,
  variant = 'default'
}) => {
  if (!exhibition) return null

  const { id, slug, name, date, mainImage, awards, location } = exhibition

  const formattedDate = date
    ? new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const exhibitionUrl = `/exposiciones/${slug || id}`
  const awardsCount = awards?.length || 0

  // Premium Variant - Luxury editorial design
  if (variant === 'premium') {
    return (
      <Link href={exhibitionUrl} className={cn('group block h-full', className)}>
        <article className="relative h-full bg-white border border-[#ece8e1] overflow-hidden transition-all duration-700 hover:border-[#a58a1b]/40 hover:shadow-[0_25px_60px_-15px_rgba(165,138,27,0.2)]">
          {/* Image Container with overlay effects */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f4f2]">
            {typeof mainImage === 'object' && mainImage !== null && (
              <>
                <Media
                  resource={mainImage as MediaType}
                  className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-110"
                  imgClassName="object-cover w-full h-full"
                />
                {/* Premium overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              </>
            )}

            {/* Awards badge - Premium gold style */}
            {awardsCount > 0 && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#a58a1b] to-[#c9a93d] text-white shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="5" opacity="0.5" />
                  <path d="M8 12.5V20l4-2 4 2v-7.5" />
                </svg>
                <span className="text-xs font-medium tracking-wide">
                  {awardsCount} {awardsCount === 1 ? 'Premio' : 'Premios'}
                </span>
              </div>
            )}

            {/* Date badge - bottom left */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-[0.15em] text-gray-700">
                {formattedDate}
              </span>
            </div>

            {/* Hover reveal - Golden accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-[#a58a1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>

          {/* Content Section */}
          <div className="relative p-6 lg:p-8">
            {/* Location if exists */}
            {location && (
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="truncate">{location}</span>
              </div>
            )}

            {/* Exhibition Name */}
            <h3 className="font-heading text-xl lg:text-2xl font-medium text-gray-900 group-hover:text-[#a58a1b] transition-colors duration-500 mb-4 leading-tight line-clamp-2">
              {name}
            </h3>

            {/* Awards preview - Premium style */}
            {awardsCount > 0 && awards && (
              <div className="pt-4 border-t border-[#ece8e1] space-y-2.5">
                {awards.slice(0, 2).map((award, idx) => {
                  const dogName =
                    typeof award.dog === 'object' && award.dog !== null
                      ? award.dog.name
                      : 'Ejemplar'

                  // Get position color
                  const positionColors: Record<string, string> = {
                    first: '#ffd700',
                    second: '#c0c0c0',
                    third: '#cd7f32',
                    special: '#a58a1b',
                    other: '#6b6560'
                  }
                  const positionColor = positionColors[award.position || 'other'] || '#a58a1b'

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: positionColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-800 font-medium truncate block">
                          {dogName}
                        </span>
                        {award.title && (
                          <span className="text-xs text-gray-400 truncate block">
                            {award.title}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
                {awardsCount > 2 && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#a58a1b] font-medium pt-1">
                    <span>+{awardsCount - 2} más</span>
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </div>
            )}

            {/* Hover CTA */}
            <div className="mt-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#a58a1b] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <span>Ver detalles</span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
          </div>

          {/* Corner decoration on hover */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-4 right-4 w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#a58a1b] transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#a58a1b] transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-200" />
            </div>
          </div>
        </article>
      </Link>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link href={exhibitionUrl} className={cn('group block', className)}>
        <article className="flex gap-4 p-4 bg-white border border-[#ece8e1] hover:border-[#a58a1b]/30 transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-[#f5f4f2]">
            {typeof mainImage === 'object' && mainImage !== null && (
              <Media
                resource={mainImage as MediaType}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                imgClassName="object-cover w-full h-full"
              />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{formattedDate}</span>
            <h3 className="font-heading text-base font-medium text-gray-900 group-hover:text-[#a58a1b] transition-colors truncate">
              {name}
            </h3>
            {awardsCount > 0 && (
              <span className="text-xs text-[#a58a1b] mt-1">
                {awardsCount} {awardsCount === 1 ? 'premio' : 'premios'}
              </span>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Default variant - Clean minimal design
  return (
    <Link href={exhibitionUrl} className={cn('group block', className)}>
      <article>
        {/* Image Container */}
        <div className="relative overflow-hidden mb-5">
          <div className="relative aspect-[16/10] bg-[#f5f4f2]">
            {typeof mainImage === 'object' && mainImage !== null && (
              <Media
                resource={mainImage as MediaType}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                imgClassName="object-cover w-full h-full"
              />
            )}

            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

            {/* Awards badge */}
            {awardsCount > 0 && (
              <div className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] bg-[#a58a1b] text-[#ece8e1]">
                {awardsCount} {awardsCount === 1 ? 'Premio' : 'Premios'}
              </div>
            )}
          </div>

          {/* Bottom accent line - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a58a1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>

        {/* Content */}
        <div className="px-1">
          {/* Date */}
          <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
            {formattedDate}
          </span>

          {/* Name */}
          <h3 className="font-heading text-lg md:text-xl font-medium text-gray-900 group-hover:text-[#a58a1b] transition-colors duration-300 mb-2 leading-tight">
            {name}
          </h3>

          {/* Awards preview */}
          {awardsCount > 0 && awards && (
            <div className="mt-3 space-y-1">
              {awards.slice(0, 2).map((award, idx) => {
                const dogName =
                  typeof award.dog === 'object' && award.dog !== null
                    ? award.dog.name
                    : 'Ejemplar'
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                    <svg
                      className="w-3.5 h-3.5 text-[#a58a1b] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M8 12.5V20l4-2 4 2v-7.5" />
                    </svg>
                    <span className="truncate">
                      <span className="font-medium text-gray-700">{dogName}</span>
                      {award.title && <span className="text-gray-400"> - {award.title}</span>}
                    </span>
                  </div>
                )
              })}
              {awardsCount > 2 && (
                <span className="text-xs text-[#a58a1b]">+{awardsCount - 2} más...</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
