import type { Metadata } from 'next/types'
import Link from 'next/link'
import Image from 'next/image'

import { ExhibitionCard } from '@/components/ExhibitionCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { cn } from '@/utilities/ui'
import ScrollProgress from '@/components/ScrollProgress'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Get all exhibitions, sorted by date descending (most recent first)
  const exhibitions = await payload.find({
    collection: 'exposiciones',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    sort: '-date',
    select: {
      id: true,
      name: true,
      slug: true,
      date: true,
      mainImage: true,
      description: true,
      location: true,
      awards: true,
    },
  })

  // Group exhibitions by year
  const exhibitionsByYear = exhibitions.docs.reduce(
    (acc, exhibition) => {
      const year = new Date(exhibition.date).getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(exhibition)
      return acc
    },
    {} as Record<number, typeof exhibitions.docs>,
  )

  // Sort years descending
  const years = Object.keys(exhibitionsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  // Calculate total stats
  const totalExhibitions = exhibitions.docs.length
  const totalAwards = exhibitions.docs.reduce((acc, e) => acc + (e.awards?.length || 0), 0)
  const uniqueYears = years.length

  return (
    <>
      <ScrollProgress />
      <main className="isolate">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO - Cinematográfico Premium con imagen de fondo
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          {/* Background Image with cinematic treatment */}
          <div
            className="absolute inset-0 animate-image-reveal"
            style={{
              backgroundImage: `url('/images/landscape.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 35%',
            }}
          />

          {/* Primary gradient - strong from bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.4) 0%,
                rgba(0, 0, 0, 0.3) 30%,
                rgba(0, 0, 0, 0.6) 60%,
                rgba(0, 0, 0, 0.92) 100%
              )`,
            }}
          />

          {/* Left side gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.7) 0%,
                rgba(0, 0, 0, 0.5) 35%,
                rgba(0, 0, 0, 0.2) 60%,
                transparent 80%
              )`,
            }}
          />

          {/* Golden accent gradient at bottom */}
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background: 'linear-gradient(180deg, transparent 60%, rgba(165, 138, 27, 0.2) 100%)',
            }}
          />

          {/* Decorative medal icon - floating */}
          <div className="absolute top-1/4 right-[15%] opacity-15 hidden xl:block animate-float">
            <svg
              className="w-32 h-32 text-[#a58a1b]"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M8 13V22l4-2.5 4 2.5V13" />
            </svg>
          </div>

          {/* Content Container */}
          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl">
              {/* Small ornamental detail */}
              <div className="animate-fade-in-up mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-16 h-[2px] bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
                  <span className="golden-silhouette-sm opacity-70" />
                  <span
                    className="text-[#c9a93d] text-[11px] font-medium tracking-[0.4em] uppercase"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                  >
                    Palmarés Oficial
                  </span>
                </div>
              </div>

              {/* Título principal - Tipografía dramática con text-shadow para legibilidad */}
              <h1
                className="animate-fade-in-up delay-100 mb-8 text-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05]"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}
              >
                Exposiciones
                <br />
                <span className="text-gradient-gold drop-shadow-lg">&amp; Premios</span>
              </h1>

              {/* Línea decorativa animada */}
              <div className="animate-line-draw delay-300 w-32 mb-10" />

              {/* Descripción con estilo editorial */}
              <p
                className="animate-fade-in-up delay-400 text-white text-lg md:text-xl leading-relaxed max-w-2xl mb-12"
                style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}
              >
                Celebramos la excelencia de nuestros Golden Retrievers en los rings de exposición
                más prestigiosos. Cada reconocimiento refleja años de dedicación a la preservación
                del estándar de la raza.
              </p>

              {/* Stats Row - Premium design */}
              <div className="animate-fade-in-up delay-500 flex flex-wrap gap-8 md:gap-12">
                <div className="group">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-5xl md:text-6xl font-heading font-medium text-white group-hover:text-[#c9a93d] transition-colors duration-500"
                      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                    >
                      {totalExhibitions}
                    </span>
                    <span className="text-[#c9a93d] text-sm drop-shadow-lg">+</span>
                  </div>
                  <span
                    className="text-white/70 text-xs uppercase tracking-[0.2em] mt-2 block"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                  >
                    Exposiciones
                  </span>
                </div>
                <div className="w-px h-16 bg-white/30 hidden md:block" />
                <div className="group">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-5xl md:text-6xl font-heading font-medium text-white group-hover:text-[#c9a93d] transition-colors duration-500"
                      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                    >
                      {totalAwards}
                    </span>
                    <span className="text-[#c9a93d] text-sm drop-shadow-lg">+</span>
                  </div>
                  <span
                    className="text-white/70 text-xs uppercase tracking-[0.2em] mt-2 block"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                  >
                    Reconocimientos
                  </span>
                </div>
                <div className="w-px h-16 bg-white/30 hidden md:block" />
                <div className="group">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-5xl md:text-6xl font-heading font-medium text-white group-hover:text-[#c9a93d] transition-colors duration-500"
                      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                    >
                      {uniqueYears}
                    </span>
                  </div>
                  <span
                    className="text-white/70 text-xs uppercase tracking-[0.2em] mt-2 block"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                  >
                    Temporadas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            INTRO SECTION - Filosofía de competición
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url('/lunabella-pattern.svg')`,
              backgroundSize: '1200px',
              backgroundRepeat: 'repeat',
            }}
          />

          <div className="container mx-auto px-6 lg:px-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Left - Photo with decorative frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative max-w-md mx-auto lg:mx-0">
                  {/* Decorative frame offset */}
                  <div className="absolute -inset-3 border border-[#a58a1b]/20 pointer-events-none" />

                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-10 h-10 z-10">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#a58a1b]" />
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-[#a58a1b]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 z-10">
                    <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#a58a1b]" />
                    <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#a58a1b]" />
                  </div>

                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#ece8e1]">
                    <Image
                      src="/fotos/crianza.jpg"
                      alt="Golden Retriever en exposición canina"
                      fill
                      className="object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Right - Text content */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-px bg-[#a58a1b]" />
                  <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.3em] uppercase">
                    Nuestra filosofía
                  </span>
                </div>

                <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-8">
                  Preservando la <span className="text-gradient-gold">excelencia</span> de la raza
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    En LunaBella creemos firmemente en la importancia de las exposiciones caninas
                    como herramienta fundamental para preservar la integridad y el estándar de la
                    raza Golden Retriever.
                  </p>
                  <p className="text-editorial text-xl text-gray-800 border-l-2 border-[#a58a1b] pl-6">
                    Cada exposición es una oportunidad de validar nuestro trabajo de cría
                    responsable y demostrar que belleza, salud y temperamento pueden ir de la mano.
                  </p>
                  <p>
                    Participamos activamente en eventos nacionales e internacionales, donde nuestros
                    ejemplares han obtenido reconocimientos que avalan su calidad morfológica y su
                    fidelidad al estándar oficial de la FCI.
                  </p>
                </div>

                {/* Quick facts */}
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="group p-5 bg-[#faf8f5] hover:bg-[#a58a1b]/5 transition-colors duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-5 h-5 text-[#a58a1b]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-[10px] text-[#a58a1b] uppercase tracking-[0.2em]">
                        Estándar FCI
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Crianza fiel al estándar oficial</p>
                  </div>
                  <div className="group p-5 bg-[#faf8f5] hover:bg-[#a58a1b]/5 transition-colors duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-5 h-5 text-[#a58a1b]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                      <span className="text-[10px] text-[#a58a1b] uppercase tracking-[0.2em]">
                        Jueces Internacionales
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Evaluados por expertos de renombre</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            EXHIBITION SECTIONS BY YEAR
        ═══════════════════════════════════════════════════════════════════ */}
        <div>
          {years.map((year, index) => (
            <ExhibitionsSection
              key={year}
              year={year}
              exhibitions={exhibitionsByYear[year] || []}
              index={index}
              isFirst={index === 0}
            />
          ))}

          {/* Empty State */}
          {exhibitions.docs.length === 0 && (
            <section className="py-32 md:py-40 bg-[#faf8f5]">
              <div className="container mx-auto px-6 lg:px-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#a58a1b]/10 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[#a58a1b]/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="5" strokeWidth={1.5} />
                      <path d="M8 12.5V20l4-2 4 2v-7.5" strokeWidth={1.5} />
                    </svg>
                  </div>
                  <h3 className="text-display text-2xl text-gray-900 mb-4">Próximamente</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Estamos preparando nuestro historial de exposiciones. Vuelve pronto para conocer
                    los logros de nuestros ejemplares.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CTA SECTION - Premium design
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-32 md:py-44 overflow-hidden bg-[#0a0a0a]">
          {/* Pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url('/lunabella-pattern.svg')`,
              backgroundSize: '1000px',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Golden glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-15 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #a58a1b 0%, transparent 70%)' }}
          />

          <div className="relative container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Ornamental header */}
              <div className="flex items-center justify-center gap-6 mb-10">
                <span className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#a58a1b]" />
                <div className="golden-silhouette-sm opacity-60" />
                <span className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[#a58a1b]" />
              </div>

              <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-white mb-8">
                Conoce a nuestros <span className="text-gradient-gold">campeones</span>
              </h2>

              <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-14">
                Descubre los Golden Retrievers que representan a LunaBella en los rings de
                exposición. Cada uno de ellos es un testimonio de nuestra dedicación a la
                excelencia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/nuestros-goldens"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 text-[13px] font-medium uppercase tracking-[0.2em] bg-[#ece8e1] text-black transition-all duration-300 ease-out hover:bg-white"
                >
                  Ver nuestros perros
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center px-10 py-4 text-[13px] font-medium uppercase tracking-[0.2em] border border-[#ece8e1]/35 text-[#ece8e1] transition-all duration-300 ease-out hover:bg-white/10 hover:border-[#ece8e1]/60"
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

type ExhibitionsSectionProps = {
  year: number
  exhibitions: any[]
  index: number
  isFirst: boolean
}

function ExhibitionsSection({ year, exhibitions, index, isFirst }: ExhibitionsSectionProps) {
  const isEven = index % 2 === 0

  // Calculate awards for this year
  const yearAwards = exhibitions.reduce((acc, e) => acc + (e.awards?.length || 0), 0)

  return (
    <section
      className={cn(
        'py-24 md:py-32 relative overflow-hidden',
        isEven ? 'bg-[#faf8f5]' : 'bg-white',
      )}
    >
      {/* Decorative year watermark */}
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] hidden xl:block',
          isEven ? 'right-0' : 'left-0',
        )}
      >
        <span
          className="text-[25vw] font-heading font-bold leading-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '3px #a58a1b',
            letterSpacing: '-0.08em',
          }}
        >
          {year}
        </span>
      </div>

      {/* Decorative silhouette */}
      <div
        className={cn(
          'absolute top-20 w-48 h-32 opacity-[0.025] pointer-events-none hidden lg:block',
          isEven ? 'left-12' : 'right-12',
        )}
        style={{
          backgroundImage: `url('/silueta-golden.svg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: isEven ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header - Editorial style */}
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-20 items-end',
          )}
        >
          {/* Year title with badge */}
          <div className={cn('lg:col-span-5', !isEven && 'lg:order-2 lg:col-start-8')}>
            <div className="flex items-center gap-4 mb-5">
              <span className="w-14 h-[2px] bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
              <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.35em] uppercase">
                Temporada {year}
              </span>
            </div>

            <div className="flex items-end gap-6">
              <h2 className="text-display text-6xl md:text-7xl lg:text-8xl text-gray-900 leading-none">
                {year}
              </h2>

              {/* Awards badge */}
              {yearAwards > 0 && (
                <div className="mb-2 flex items-center gap-2 px-4 py-2 bg-[#a58a1b] text-[#ece8e1]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="5" opacity="0.5" />
                    <path d="M8 12.5V20l4-2 4 2v-7.5" />
                  </svg>
                  <span className="text-sm font-medium">{yearAwards}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className={cn('lg:col-span-6', !isEven && 'lg:order-1 lg:col-start-1')}>
            <p className="text-lg text-gray-600 leading-relaxed">
              {exhibitions.length} {exhibitions.length === 1 ? 'exposición' : 'exposiciones'} con{' '}
              {yearAwards} {yearAwards === 1 ? 'reconocimiento' : 'reconocimientos'} obtenidos
              durante la temporada {year}.
            </p>
          </div>
        </div>

        {/* Cards Grid - Staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {exhibitions.map((exhibition, idx) => (
            <div
              key={exhibition.id || idx}
              className={cn(
                'animate-fade-in-up',
                // Stagger the cards for visual interest
                idx % 3 === 1 && 'lg:translate-y-8',
                idx % 3 === 2 && 'lg:translate-y-4',
              )}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ExhibitionCard exhibition={exhibition} variant="premium" />
            </div>
          ))}
        </div>
      </div>

      {/* Section divider - elegant */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#a58a1b]/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Exposiciones y Premios | LunaBella Golden Retrievers',
    description:
      'Descubre los logros de nuestros Golden Retrievers en exposiciones caninas nacionales e internacionales. Palmarés oficial de LunaBella.',
  }
}
