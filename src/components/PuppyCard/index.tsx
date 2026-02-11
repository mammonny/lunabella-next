import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Puppy } from '@/payload-types'
import { Media } from '@/components/Media'

// --- Helper Functions ---

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

const calculateAgeInYears = (birthDate: string | null | undefined): string => {
  if (!birthDate) return ''
  try {
    const birthDateObj = new Date(birthDate)
    const today = new Date()
    if (isNaN(birthDateObj.getTime())) return ''
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }
    if (age < 1) {
      const diffMonths = Math.floor(Math.abs(today.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30))
      return `${diffMonths} meses`
    }
    return `${age} ${age === 1 ? 'año' : 'años'}`
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

  const apodo = (puppy as any).apodo as string | undefined
  const dogStatus = (puppy as any).breedingStatus as 'active' | 'retired' | 'deceased' | undefined
  const age = collectionType === 'dogs' ? calculateAgeInYears(birthDate) : calculateAgeInWeeks(birthDate)
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

  const basePath = collectionType === 'dogs' ? '/nuestros-goldens' : '/cachorros'
  const puppyUrl = `${basePath}/${slug || id}`

  // Status configuration - refined colors that harmonize with LunaBella palette
  const getStatusConfig = () => {
    if (collectionType === 'dogs') {
      if (dogStatus === 'retired') return { label: 'Retirado', bg: '#6b6560', color: '#ece8e1' }
      if (dogStatus === 'deceased') return { label: 'En Memoria', bg: '#3d3a37', color: '#ece8e1' }
      return null
    }
    // For puppies - warm tones that complement the gold
    if (disponibilidad === 'available') return { label: 'Disponible', bg: '#a58a1b', color: '#ece8e1' }
    if (disponibilidad === 'reserved') return { label: 'Reservado', bg: '#8a7316', color: '#ece8e1' }
    if (disponibilidad === 'sold') return { label: 'Vendido', bg: '#6b6560', color: '#ece8e1' }
    return null
  }

  const statusConfig = getStatusConfig()

  // Gender colors - warm tones that harmonize with gold/cream palette
  const genderColor = gender === 'male' ? '#7a9bb8' : '#c4a69f'

  return (
    <Link href={puppyUrl} className={`group block ${className || ''}`}>
      <article className="transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
        {/* Image Container */}
        <div className="relative overflow-hidden mb-5">
          {/* Aspect ratio container */}
          <div className="relative aspect-[4/5] bg-[#f5f4f2]">
            {typeof mainImage === 'object' && mainImage !== null && 'url' in mainImage ? (
              <Media
                resource={mainImage}
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                imgClassName="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={(typeof mainImage === 'object' && mainImage?.url) || '/placeholder.svg'}
                alt={`${name} - Golden Retriever LunaBella`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {/* Subtle warm overlay on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 50%)' }}
            />

            {/* Status Badge */}
            {statusConfig && (
              <div
                className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em]"
                style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
              >
                {statusConfig.label}
              </div>
            )}
          </div>

          {/* Bottom accent line - gold, appears on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
            style={{ backgroundColor: '#a58a1b' }}
          />
        </div>

        {/* Content */}
        <div className="px-0.5">
          {/* Name with subtle gold underline on hover */}
          <h3 className="font-heading text-lg md:text-xl font-medium text-gray-900 group-hover:text-[#8a7316] transition-colors duration-300 leading-tight tracking-[-0.01em]">
            {name}
          </h3>
          {apodo && (
            <p className="text-sm text-[#6b6560] italic mb-2.5">&ldquo;{apodo}&rdquo;</p>
          )}
          {!apodo && <div className="mb-2.5" />}

          {/* Details row */}
          <div className="flex items-center gap-3 text-[13px] text-[#6b6560]">
            {genderText && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: genderColor }}
                />
                {genderText}
              </span>
            )}
            {age && genderText && <span className="text-[#ddd7cc]">·</span>}
            {age && <span>{age}</span>}
          </div>

          {/* Price - only for puppies, highlighted with gold */}
          {collectionType === 'puppies' && typeof price === 'number' && (
            <div className="mt-3.5">
              <span className="text-[15px] font-medium text-[#a58a1b]">
                {price.toLocaleString('es-ES')} €
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
