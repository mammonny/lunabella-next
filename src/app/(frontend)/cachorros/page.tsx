import type { Metadata } from 'next/types'

import { PuppyCard } from '@/components/PuppyCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { cn } from '@/utilities/ui'
import ScrollProgress from '@/components/ScrollProgress'
import Link from 'next/link'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'
import CTASection from '@/components/CTASection'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener todos los Puppies (excepto vendidos)
  const puppies = await payload.find({
    collection: 'cachorros',
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
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 min-h-[26rem] md:min-h-[30rem] overflow-hidden">
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
              <div className="flex items-center gap-3 mb-5 w-[15rem] animate-fade-in-up">
                <span className="flex-1 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
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

        <PageBreadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Cachorros' },
        ]} />

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

          {/* Empty State - Lista de espera */}
          {available.length === 0 && reserved.length === 0 && (
            <section className="py-20 md:py-28">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                  <div className="relative bg-[#faf8f5] p-10 md:p-16">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#a58a1b]/30" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#a58a1b]/30" />

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="golden-silhouette-sm opacity-70" />
                        <span className="text-[#a58a1b] text-xs font-medium tracking-[0.25em] uppercase">
                          Lista de espera
                        </span>
                      </div>

                      <h2 className="text-display text-3xl md:text-4xl text-gray-900 mb-6">
                        Próximamente nuevos{' '}
                        <span className="text-gradient-gold">cachorros</span>
                      </h2>

                      <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                        Estamos preparando nuevas camadas. Contáctanos para apuntarte a la lista de
                        espera y ser de los primeros en conocerlos.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          href="/contacto"
                          className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-[13px] font-medium uppercase tracking-[0.2em] bg-black text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
                        >
                          Apuntarme a la lista
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
                        <a
                          href="tel:+34670004089"
                          className="inline-flex items-center justify-center gap-3 px-10 py-5 text-[13px] font-medium uppercase tracking-[0.2em] border border-gray-300 text-gray-600 transition-all duration-300 ease-out hover:bg-black/5 hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                          Llamar
                        </a>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a58a1b]" />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <CTASection
          label="¿Te interesa?"
          title={<>¿Quieres conocer a <span className="text-gradient-gold">nuestros padres</span>?</>}
          description="Conoce a los padres de nuestros cachorros. Todos nuestros ejemplares tienen pedigrí completo, certificaciones de salud y un carácter excepcional."
          primaryLabel="Nuestros Goldens"
          primaryHref="/nuestros-goldens"
          secondaryLabel="Contactar"
          secondaryHref="/contacto"
        />
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
                collectionType="cachorros"
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
