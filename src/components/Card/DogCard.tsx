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

  // Extraemos los datos con valores por defecto para evitar problemas
  const slug = doc?.slug || ''
  const name = doc?.name || 'Sin nombre'
  const gender = doc?.gender
  const mainImage = doc?.mainImage

  // Aseguramos que siempre tengamos un nombre de raza
  const breedName =
    doc?.breed && typeof doc.breed === 'object' ? doc.breed?.name : 'Raza no especificada'
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''
  const href = `/${relationTo}/${slug}`

  // Verificamos en consola para depuración
  console.log('DogCard data:', { name, breedName, gender })

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!mainImage && (
          <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            No image
          </div>
        )}
        {mainImage && typeof mainImage !== 'string' && (
          <div className="relative w-full overflow-hidden">
            <Media resource={mainImage} size="" className="h-48 w-full object-cover" />
            {genderText && (
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  gender === 'male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
                }`}
              >
                {genderText}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        {showBreed && breedName && <div className="uppercase text-sm mb-4">{breedName}</div>}
        {name && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {name}
              </Link>
            </h3>
          </div>
        )}
      </div>
    </article>
  )
}
