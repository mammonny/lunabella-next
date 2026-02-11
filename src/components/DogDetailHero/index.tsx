'use client'

import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface DogDetailHeroProps {
  name: string
  apodo?: string | null
  breedName: string
  mainImage: MediaType | null
  gender: 'male' | 'female' | null
  breedingStatus: 'active' | 'retired' | 'deceased' | null
  birthDate: string | null
  pedigreeNumber?: string | null
}

export const DogDetailHero: React.FC<DogDetailHeroProps> = ({
  name,
  apodo,
  breedName,
  mainImage,
  gender,
  breedingStatus,
  birthDate,
  pedigreeNumber,
}) => {
  const statusText = breedingStatus === 'retired'
    ? 'Retirado'
    : breedingStatus === 'deceased'
      ? 'En Memoria'
      : null

  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

  const calculateAge = () => {
    if (!birthDate) return null

    const birthDateObj = new Date(birthDate)
    const today = new Date()
    let years = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      years--
    }

    if (years < 1) {
      const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
      return `${diffMonths} meses`
    }

    return `${years} ${years === 1 ? 'año' : 'años'}`
  }

  const age = calculateAge()

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {mainImage && typeof mainImage !== 'string' && (
          <Media
            fill
            priority
            imgClassName="object-cover object-center"
            resource={mainImage}
          />
        )}
        {/* Gradient Overlay - Editorial style with more drama */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              105deg,
              rgba(0, 0, 0, 0.95) 0%,
              rgba(0, 0, 0, 0.85) 30%,
              rgba(0, 0, 0, 0.6) 55%,
              rgba(0, 0, 0, 0.35) 100%
            )`,
          }}
        />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative silhouette - subtle brand mark */}
      <div
        className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[300px] h-[200px] opacity-[0.03] pointer-events-none hidden lg:block"
        style={{
          backgroundImage: `url('/silueta-golden.svg')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl">
          {/* Ornamental line + category - with animation */}
          <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
            <span
              className="w-12 h-px bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]"
              style={{
                animation: 'lineGrow 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
              }}
            />
            <span className="text-[#c9a93d] text-[11px] font-medium tracking-[0.35em] uppercase">
              {breedName}
            </span>
          </div>

          {/* Name - with staggered animation */}
          <h1
            className="text-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            {name}
          </h1>
          {apodo && (
            <p
              className="text-xl md:text-2xl text-white/60 italic mt-2 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.15s' }}
            >
              &ldquo;{apodo}&rdquo;
            </p>
          )}
          {!apodo && <div className="mb-8" />}

          {/* Details row - Editorial style with subtle separators */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-white/75 text-sm animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {genderText && (
              <span className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
                  style={{
                    backgroundColor: gender === 'male' ? '#5b8fc9' : '#d4a5a0',
                  }}
                />
                <span className="font-medium">{genderText}</span>
              </span>
            )}
            {age && (
              <>
                <span className="w-px h-4 bg-white/20" />
                <span>{age}</span>
              </>
            )}
            {pedigreeNumber && (
              <>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#a58a1b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#c9a93d]">Pedigree certificado</span>
                </span>
              </>
            )}
          </div>

          {/* Status badge - only for retired/deceased */}
          {statusText && (
            <div
              className="inline-block mt-8 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] animate-fade-in-up"
              style={{
                backgroundColor: breedingStatus === 'deceased' ? '#6b6560' : '#a58a1b',
                color: '#ece8e1',
                animationDelay: '0.3s',
              }}
            >
              {statusText}
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative line - animated on load */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-transparent via-[#a58a1b] to-transparent"
          style={{
            animation: 'fadeIn 1s ease-out 0.5s forwards',
            opacity: 0,
          }}
        />
      </div>

      {/* Keyframes injected via style tag */}
      <style jsx>{`
        @keyframes lineGrow {
          to { transform: scaleX(1); }
        }
        @keyframes fadeIn {
          to { opacity: 0.6; }
        }
      `}</style>
    </section>
  )
}
