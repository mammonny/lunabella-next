import type { Metadata } from 'next/types'

import { PuppyCard } from '@/components/PuppyCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { cn } from '@/utilities/ui'
import ScrollProgress from '@/components/ScrollProgress'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener todos los Puppies (excepto vendidos)
  const puppies = await payload.find({
    collection: 'puppies',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    where: {
      disponibilidad: {
        not_equals: 'sold',
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      breed: true,
      gender: true,
      mainImage: true,
      price: true,
      disponibilidad: true,
    },
  })

  // Filtrar por secciones
  const available = puppies.docs.filter((puppy) => puppy.disponibilidad === 'available')
  const reserved = puppies.docs.filter((puppy) => puppy.disponibilidad === 'reserved')

  return (
    <>
      <ScrollProgress />
      <main className="isolate">
        {/* Hero Section - Compact Editorial Style */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          {/* Background Image - Decorative */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/landscape.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
          {/* Strong gradient overlay for readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                100deg,
                rgba(0, 0, 0, 0.9) 0%,
                rgba(0, 0, 0, 0.75) 40%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
            }}
          />

          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              {/* Ornamental detail */}
              <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
                <span className="w-10 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
                <span className="text-[#c9a93d] text-xs font-medium tracking-[0.3em] uppercase">
                  Nuevos miembros
                </span>
              </div>

              {/* Título principal */}
              <h1 className="mb-5 text-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] animate-fade-in-up delay-100">
                Cachorros{' '}
                <span className="text-gradient-gold">Disponibles</span>
              </h1>

              {/* Descripción */}
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl animate-fade-in-up delay-200">
                Explora nuestra selección de cachorros Golden Retriever. Cada uno viene con pedigrí completo,
                vacunas al día y un carácter excepcional.
              </p>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="bg-white">
          {/* Seccion: Disponibles */}
          {available.length > 0 && (
            <PuppiesSection
              title="Disponibles"
              subtitle="Cachorros listos para encontrar un nuevo hogar. Cada uno ha sido criado con amor y está listo para formar parte de tu familia."
              puppies={available}
              accentColor="#a58a1b"
              index={0}
            />
          )}

          {/* Seccion: Reservados */}
          {reserved.length > 0 && (
            <PuppiesSection
              title="Reservados"
              subtitle="Estos cachorros ya han encontrado su familia, pero aún puedes conocerlos mientras esperan a ser recogidos."
              puppies={reserved}
              accentColor="#d4a5a0"
              index={1}
              isReserved
            />
          )}

          {/* Empty State */}
          {available.length === 0 && reserved.length === 0 && (
            <section className="py-20 md:py-28">
              <div className="container mx-auto px-6 lg:px-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="w-16 h-px bg-[#a58a1b]" />
                  <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                    Próximamente
                  </span>
                  <span className="w-16 h-px bg-[#a58a1b]" />
                </div>
                <h2 className="text-display text-3xl md:text-4xl text-gray-900 mb-6">
                  No hay cachorros disponibles
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Actualmente no tenemos cachorros disponibles, pero pronto tendremos nuevas camadas.
                  Contáctanos para ser notificado cuando tengamos nuevos cachorros.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* CTA Section - Same style as WhyLunaBella */}
        <section className="relative py-28 md:py-40 overflow-hidden bg-lunabella-diagonal">
          <div className="relative container mx-auto px-6 lg:px-12">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  ¿Te interesa?
                </span>
                <span className="w-16 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
                ¿Quieres conocer a{' '}
                <span className="text-gradient-gold">nuestros padres</span>?
              </h2>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
                Conoce a los padres de nuestros cachorros. Todos nuestros ejemplares tienen pedigrí completo,
                certificaciones de salud y un carácter excepcional.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/nuestros-perros"
                  className="group btn-lunabella inline-flex items-center justify-center gap-3"
                >
                  Ver nuestros perros
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/contacto"
                  className="btn-lunabella-outline"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

type PuppiesSectionProps = {
  title: string
  subtitle?: string
  puppies: any[]
  accentColor: string
  index: number
  isReserved?: boolean
}

function PuppiesSection({ title, subtitle, puppies, accentColor, index, isReserved }: PuppiesSectionProps) {
  const isEven = index % 2 === 0

  return (
    <section
      className={cn(
        'py-20 md:py-28 relative overflow-hidden',
        isEven && 'bg-white',
        !isEven && 'bg-[#faf8f5]'
      )}
    >
      {/* Decorative background element */}
      <div
        className="absolute top-1/4 right-0 w-64 h-44 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('/silueta-golden.svg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: isEven ? 'scaleX(1)' : 'scaleX(-1)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header con estilo editorial */}
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-20 items-end',
          isEven ? 'lg:text-left' : 'lg:text-left'
        )}>
          {/* Título con ornamento */}
          <div className={cn(
            'lg:col-span-4',
            !isEven && 'lg:order-2 lg:col-start-9'
          )}>
            <div className="flex items-center gap-4 mb-4">
              <span
                className="w-12 h-px transition-all duration-500"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="text-sm font-medium tracking-[0.25em] uppercase"
                style={{ color: accentColor }}
              >
                {isReserved ? 'Ya tienen familia' : 'Listos para ti'}
              </span>
            </div>

            <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900">
              {title}
            </h2>
          </div>

          {/* Descripción */}
          <div className={cn(
            'lg:col-span-7',
            !isEven && 'lg:order-1 lg:col-start-1'
          )}>
            {subtitle && (
              <p className="text-lg leading-relaxed text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Grid de cards con diseño elegante */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {puppies.map((puppy, idx) => (
            <div
              key={puppy.id || idx}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <PuppyCard
                puppy={puppy}
                collectionType="puppies"
                className={cn(
                  'h-full',
                  isReserved && 'opacity-75 hover:opacity-100 transition-all duration-500'
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section divider - only between sections */}
      {!isReserved && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#a58a1b]/20 to-transparent" />
      )}
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Cachorros Golden Retriever Disponibles | LunaBella',
    description:
      'Explora nuestra selección de cachorros Golden Retriever disponibles. Pedigrí completo, vacunas al día y un carácter excepcional.',
  }
}
