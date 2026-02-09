'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

export type CardPuppyData = {
  id?: string | number | null
  slug?: string | null
  name?: string | null
  breed?: any
  gender?: 'male' | 'female' | null
  mainImage?: any
  price?: number | null
  disponibilidad?: 'available' | 'reserved' | 'sold' | null
}

export const PuppyCard: React.FC<{
  className?: string
  doc?: CardPuppyData
  relationTo?: 'puppies'
  showBreed?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showBreed } = props

  const slug = doc?.slug || ''
  const name = doc?.name || 'Sin nombre'
  const gender = doc?.gender
  const mainImage = doc?.mainImage
  const price = doc?.price || 0
  const disponibilidad = doc?.disponibilidad || 'available'

  const breedName =
    doc?.breed && typeof doc.breed === 'object' ? doc.breed?.name : 'Raza no especificada'
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''
  const href = `/${relationTo}/${slug}`

  // Estado con colores refinados que armonizan con la paleta LunaBella
  const statusConfig = {
    available: {
      text: 'Disponible',
      bgColor: 'bg-[#2d5a3d]/90',
      textColor: 'text-[#c8e6d0]',
      borderColor: 'border-[#4a8a5d]/40',
    },
    reserved: {
      text: 'Reservado',
      bgColor: 'bg-[#a58a1b]/90',
      textColor: 'text-[#faf8f5]',
      borderColor: 'border-[#c9a93d]/40',
    },
    sold: {
      text: 'Adoptado',
      bgColor: 'bg-[#1a1a1a]/90',
      textColor: 'text-[#ece8e1]/70',
      borderColor: 'border-[#333]/40',
    },
  }

  const status = statusConfig[disponibilidad] || statusConfig.available

  // Símbolo de género elegante
  const GenderSymbol = () => {
    if (gender === 'male') {
      return (
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
          <path d="M12 2a1 1 0 011 1v3.586l2.293-2.293a1 1 0 111.414 1.414L14.414 8H18a1 1 0 110 2h-5a1 1 0 01-1-1V4a1 1 0 011-1zM9 11a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1112 0 6 6 0 01-12 0z" />
        </svg>
      )
    }
    if (gender === 'female') {
      return (
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
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
      {/* Imagen */}
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

        {/* Badges superiores */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Badge de género */}
          {genderText && (
            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5',
                'text-[9px] font-medium uppercase tracking-[0.12em]',
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

          {/* Badge de disponibilidad */}
          <div
            className={cn(
              'px-2.5 py-1.5',
              'text-[9px] font-medium uppercase tracking-[0.12em]',
              'backdrop-blur-md border transition-all duration-300',
              status.bgColor,
              status.textColor,
              status.borderColor,
            )}
          >
            {status.text}
          </div>
        </div>

        {/* Quality seal en hover */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
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

        {/* Nombre */}
        {name && (
          <h3 className="font-heading text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight leading-tight mb-3">
            <Link
              className="hover:text-[#8a7316] transition-colors duration-300"
              href={href}
              ref={link.ref}
            >
              {name}
            </Link>
          </h3>
        )}

        {/* Precio elegante */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-heading font-semibold text-[#a58a1b]">
            {price.toLocaleString('es-ES')}
          </span>
          <span className="text-sm text-[#a58a1b]/70">€</span>
        </div>

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
