'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

export type CardDogData = {
  id?: string | number | null
  slug?: string | null
  name?: string | null
  breed?: any
  gender?: 'male' | 'female' | null
  mainImage?: any
}

export const DogCard: React.FC<{
  className?: string
  doc?: CardDogData
  relationTo?: 'dogs'
  showBreed?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showBreed } = props

  const slug = doc?.slug || ''
  const name = doc?.name || 'Sin nombre'
  const gender = doc?.gender
  const mainImage = doc?.mainImage

  const breedName =
    doc?.breed && typeof doc.breed === 'object' ? doc.breed?.name : 'Raza no especificada'
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''
  const href = `/${relationTo}/${slug}`

  // Símbolo de género elegante
  const GenderSymbol = () => {
    if (gender === 'male') {
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M12 2a1 1 0 011 1v3.586l2.293-2.293a1 1 0 111.414 1.414L14.414 8H18a1 1 0 110 2h-5a1 1 0 01-1-1V4a1 1 0 011-1zM9 11a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1112 0 6 6 0 01-12 0z" />
        </svg>
      )
    }
    if (gender === 'female') {
      return (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
          <path d="M12 2a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V15h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H11a1 1 0 110-2h2v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 016-6zm0 2a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    }
    return null
  }

  return (
    <article
      className={cn(
        'group relative bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer',
        'border border-gray-100/80',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-[#a58a1b]/40 hover:shadow-[0_20px_50px_-15px_rgba(165,138,27,0.15)]',
        'hover:-translate-y-1',
        className,
      )}
      ref={card.ref}
    >
      {/* Imagen con overlay sutil */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {!mainImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] to-[#ece8e1] flex items-center justify-center">
            <div className="golden-silhouette opacity-20" />
          </div>
        )}
        {mainImage && typeof mainImage !== 'string' && (
          <>
            <Media
              resource={mainImage}
              size=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Gradient overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}

        {/* Badge de género - esquina superior */}
        {genderText && (
          <div
            className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5',
              'text-[10px] font-medium uppercase tracking-[0.15em]',
              'backdrop-blur-md border transition-all duration-300',
              gender === 'male'
                ? 'bg-[#1a1a1a]/80 text-[#bfe0fb] border-[#4a90b8]/30'
                : 'bg-[#1a1a1a]/80 text-[#f8d4cf] border-[#c9918a]/30',
            )}
          >
            <GenderSymbol />
            <span>{genderText}</span>
          </div>
        )}

        {/* Quality seal en hover - silueta dorada */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="golden-silhouette-sm opacity-60" />
        </div>
      </div>

      {/* Contenido */}
      <div className="relative p-6 lg:p-7">
        {/* Línea de acento dorada animada */}
        <div className="w-8 h-0.5 bg-[#a58a1b] mb-4 transition-all duration-500 ease-out group-hover:w-12" />

        {/* Raza */}
        {showBreed && breedName && (
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#a58a1b] mb-2">
            {breedName}
          </span>
        )}

        {/* Nombre con tipografía editorial */}
        {name && (
          <h3 className="font-heading text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
            <Link
              className="hover:text-[#8a7316] transition-colors duration-300"
              href={href}
              ref={link.ref}
            >
              {name}
            </Link>
          </h3>
        )}

        {/* Flecha decorativa */}
        <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-8px] group-hover:translate-x-0">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#a58a1b]">
            Conocer
          </span>
          <svg
            className="w-4 h-4 text-[#a58a1b] transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </div>
      </div>

      {/* Borde inferior dorado en hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a58a1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
    </article>
  )
}
