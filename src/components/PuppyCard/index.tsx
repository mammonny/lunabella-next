import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Puppy } from '@/payload-types'
import { Media } from '@/components/Media'

// --- Helper Functions ---

// Calcula la edad en semanas
const calculateAgeInWeeks = (birthDate: string | null | undefined): string => {
  if (!birthDate) return ''
  try {
    const birthDateObj = new Date(birthDate)
    const today = new Date()
    if (isNaN(birthDateObj.getTime())) return ''
    const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
    if (diffTime < 1000 * 60 * 60 * 24) return 'Recién nacido'
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} sem.`
  } catch (error) {
    console.error('Error calculating age:', error)
    return ''
  }
}

// --- Component Props Interface ---

interface PuppyCardProps {
  puppy: Puppy | null | undefined
  className?: string
  collectionType?: 'puppies' | 'dogs'
}

// --- PuppyCard Component - LunaBella Editorial Style ---

export const PuppyCard: React.FC<PuppyCardProps> = ({
  puppy,
  className,
  collectionType = 'puppies',
}) => {
  if (!puppy) return null

  const {
    id,
    slug,
    name = 'Sin nombre',
    price,
    mainImage,
    disponibilidad,
    birthDate,
    gender,
  } = puppy

  const dogStatus = (puppy as any).breedingStatus as 'active' | 'retired' | 'deceased' | undefined
  const age = calculateAgeInWeeks(birthDate)
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

  const basePath = collectionType === 'dogs' ? '/nuestros-perros' : '/cachorros'
  const puppyUrl = `${basePath}/${slug || id}`

  // Status label for dogs
  const getStatusLabel = () => {
    if (collectionType === 'dogs') {
      if (dogStatus === 'retired') return 'Retirado'
      if (dogStatus === 'deceased') return 'En Memoria'
      return null
    }
    // For puppies
    if (disponibilidad === 'available') return 'Disponible'
    if (disponibilidad === 'reserved') return 'Reservado'
    if (disponibilidad === 'sold') return 'Vendido'
    return null
  }

  const statusLabel = getStatusLabel()

  return (
    <Link href={puppyUrl} className={`group block ${className || ''}`}>
      <article>
        {/* Image Container */}
        <div className="relative overflow-hidden mb-4">
          {/* Aspect ratio container */}
          <div className="relative aspect-[4/5] bg-[#f5f4f2]">
            {typeof mainImage === 'object' && mainImage !== null && 'url' in mainImage ? (
              <Media
                resource={mainImage}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                imgClassName="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={(typeof mainImage === 'object' && mainImage?.url) || '/placeholder.svg'}
                alt={`${name} - Golden Retriever LunaBella`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

            {/* Status Badge - LunaBella style */}
            {statusLabel && (
              <div
                className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em]"
                style={{
                  backgroundColor: dogStatus === 'deceased' ? '#6b6560' : '#a58a1b',
                  color: '#ece8e1',
                }}
              >
                {statusLabel}
              </div>
            )}
          </div>

          {/* Bottom accent line - appears on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ backgroundColor: '#a58a1b' }}
          />
        </div>

        {/* Content */}
        <div className="px-1">
          {/* Name */}
          <h3 className="font-heading text-lg md:text-xl font-medium text-gray-900 group-hover:text-[#a58a1b] transition-colors duration-300 mb-2 leading-tight">
            {name}
          </h3>

          {/* Details row */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {genderText && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: gender === 'male' ? '#5b8fc9' : '#d4a5a0',
                  }}
                />
                {genderText}
              </span>
            )}
            {age && genderText && <span className="text-gray-300">·</span>}
            {age && <span>{age}</span>}
          </div>

          {/* Price - only for puppies */}
          {collectionType === 'puppies' && typeof price === 'number' && (
            <div className="mt-3">
              <span className="text-sm font-medium text-gray-900">
                {price.toLocaleString('es-ES')} €
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
