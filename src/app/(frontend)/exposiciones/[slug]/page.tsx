import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import type { Media, Dog } from '@/payload-types'
import { PuppyGallery } from '@/components/PuppyGallery'
import { ExhibitionDetailHero } from '@/components/ExhibitionDetailHero'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import ScrollProgress from '@/components/ScrollProgress'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ slug: string }> | undefined
}

const queryExhibitionBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'exhibitions',
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export default async function Page({ params }: Args) {
  if (!params) {
    return notFound()
  }

  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  try {
    const exhibition = (await queryExhibitionBySlug({ slug })) as any

    if (!exhibition) {
      return notFound()
    }

    const { name, date, description, mainImage, gallery, awards, location } = exhibition

    const formattedDate = date
      ? new Date(date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

    // Separate awards by position
    const firstPlaceAwards = awards?.filter((a: any) => a.position === 'first') || []
    const secondPlaceAwards = awards?.filter((a: any) => a.position === 'second') || []
    const thirdPlaceAwards = awards?.filter((a: any) => a.position === 'third') || []
    const specialAwards = awards?.filter((a: any) => a.position === 'special') || []
    const otherAwards = awards?.filter((a: any) => a.position === 'other' || !a.position) || []

    return (
      <>
        <ScrollProgress />
        <main className="isolate">
          {/* ═══════════════════════════════════════════════════════════════════
              HERO - Cinematográfico con imagen de fondo
          ═══════════════════════════════════════════════════════════════════ */}
          <ExhibitionDetailHero
            name={name || 'Exposición'}
            date={date}
            mainImage={mainImage as Media}
            location={location}
            awardsCount={awards?.length || 0}
          />

          {/* ═══════════════════════════════════════════════════════════════════
              BREADCRUMBS
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border-b border-[#ece8e1]">
            <div className="container mx-auto px-6 lg:px-12 py-4">
              <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#a58a1b] transition-colors">
                  Inicio
                </Link>
                <span className="text-gray-300">/</span>
                <Link href="/exposiciones" className="hover:text-[#a58a1b] transition-colors">
                  Exposiciones
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{name}</span>
              </nav>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              FICHA DEL EVENTO + GALERÍA
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="bg-white py-20 md:py-28 relative overflow-hidden">
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `url('/lunabella-pattern.svg')`,
                backgroundSize: '1200px',
                backgroundRepeat: 'repeat',
              }}
            />

            {/* Decorative silhouette */}
            <div
              className="absolute -right-20 top-1/4 w-[400px] h-[280px] opacity-[0.02] pointer-events-none hidden xl:block"
              style={{
                backgroundImage: `url('/silueta-golden.svg')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />

            <div className="container mx-auto px-6 lg:px-12 relative">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-14">
                <span className="w-14 h-[2px] bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
                <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.3em] uppercase">
                  Ficha del Evento
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                {/* Info Column */}
                <div>
                  {/* Event Details Card - Premium design */}
                  <div className="relative bg-[#faf8f5] border border-[#ece8e1] p-8 lg:p-10 group hover:shadow-xl transition-all duration-500">
                    {/* Gold accent on hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-[#a58a1b] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                    {/* Corner decorations */}
                    <div className="absolute top-4 right-4 w-8 h-8">
                      <div className="absolute top-0 right-0 w-full h-[1px] bg-[#a58a1b]/40" />
                      <div className="absolute top-0 right-0 w-[1px] h-full bg-[#a58a1b]/40" />
                    </div>
                    <div className="absolute bottom-4 left-4 w-8 h-8">
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#a58a1b]/40" />
                      <div className="absolute bottom-0 left-0 w-[1px] h-full bg-[#a58a1b]/40" />
                    </div>

                    <h3 className="font-heading text-2xl text-gray-900 mb-8">
                      Detalles
                    </h3>

                    <dl className="space-y-6">
                      {formattedDate && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#a58a1b]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#a58a1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <dt className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">Fecha</dt>
                            <dd className="text-gray-900 font-medium">{formattedDate}</dd>
                          </div>
                        </div>
                      )}

                      {location && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#a58a1b]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#a58a1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <dt className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">Ubicación</dt>
                            <dd className="text-gray-900 font-medium">{location}</dd>
                          </div>
                        </div>
                      )}

                      {awards && awards.length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#a58a1b]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-[#a58a1b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <circle cx="12" cy="8" r="5" />
                              <path d="M8 12.5V20l4-2 4 2v-7.5" />
                            </svg>
                          </div>
                          <div>
                            <dt className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">Resultados</dt>
                            <dd className="text-gray-900 font-medium">{awards.length} {awards.length === 1 ? 'reconocimiento' : 'reconocimientos'}</dd>
                          </div>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Description */}
                  {description && description.root && (
                    <div className="mt-10 prose prose-gray max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-lg">
                      <RichText data={description} enableGutter={false} />
                    </div>
                  )}
                </div>

                {/* Gallery Column */}
                <div>
                  <PuppyGallery
                    mainImage={mainImage as Media}
                    gallery={gallery || []}
                    puppyName={name || 'Exposición'}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              PALMARÉS - Sección oscura premium
          ═══════════════════════════════════════════════════════════════════ */}
          {awards && awards.length > 0 && (
            <section className="bg-gradient-to-b from-[#0a0a0a] to-[#111111] py-24 md:py-32 relative overflow-hidden">
              {/* Pattern background */}
              <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage: `url('/lunabella-pattern.svg')`,
                  backgroundSize: '800px',
                  backgroundRepeat: 'repeat',
                }}
              />

              {/* Golden glow effect */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #a58a1b 0%, transparent 70%)' }}
              />

              <div className="container mx-auto px-6 lg:px-12 relative">
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <span className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#a58a1b]" />
                    <div className="golden-silhouette-sm opacity-60" />
                    <span className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[#a58a1b]" />
                  </div>
                  <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                    Palmarés <span className="text-gradient-gold">Oficial</span>
                  </h2>
                  <p className="text-white/50 text-lg max-w-xl mx-auto">
                    Reconocimientos obtenidos por nuestros ejemplares
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
                  <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#ffd700] to-[#daa520] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-heading font-bold text-2xl">{firstPlaceAwards.length}</span>
                    </div>
                    <span className="text-white/70 text-sm uppercase tracking-wide">Oro</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#e8e8e8] to-[#a8a8a8] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-heading font-bold text-2xl">{secondPlaceAwards.length}</span>
                    </div>
                    <span className="text-white/70 text-sm uppercase tracking-wide">Plata</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#cd7f32] to-[#a0522d] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-heading font-bold text-2xl">{thirdPlaceAwards.length}</span>
                    </div>
                    <span className="text-white/70 text-sm uppercase tracking-wide">Bronce</span>
                  </div>
                  {(specialAwards.length + otherAwards.length) > 0 && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#a58a1b] to-[#8a7316] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-heading font-bold text-2xl">{specialAwards.length + otherAwards.length}</span>
                      </div>
                      <span className="text-white/70 text-sm uppercase tracking-wide">Otros</span>
                    </div>
                  )}
                </div>

                {/* Podium Grid */}
                {(firstPlaceAwards.length > 0 || secondPlaceAwards.length > 0 || thirdPlaceAwards.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {/* Second Place - Left */}
                    <div className="md:order-1 md:mt-8">
                      {secondPlaceAwards.map((award: any, idx: number) => (
                        <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                          {idx === 0 ? (
                            <PodiumCard award={award} position="second" />
                          ) : (
                            <AwardCardCompact award={award} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* First Place - Center */}
                    <div className="md:order-2">
                      {firstPlaceAwards.map((award: any, idx: number) => (
                        <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                          {idx === 0 ? (
                            <PodiumCard award={award} position="first" />
                          ) : (
                            <AwardCardCompact award={award} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Third Place - Right */}
                    <div className="md:order-3 md:mt-12">
                      {thirdPlaceAwards.map((award: any, idx: number) => (
                        <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                          {idx === 0 ? (
                            <PodiumCard award={award} position="third" />
                          ) : (
                            <AwardCardCompact award={award} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special & Other Awards */}
                {(specialAwards.length > 0 || otherAwards.length > 0) && (
                  <div className="border-t border-white/10 pt-12 mt-8">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="w-10 h-[1px] bg-[#a58a1b]/50" />
                      <span className="text-[#c9a93d] text-[11px] font-medium tracking-[0.3em] uppercase">
                        Otros Reconocimientos
                      </span>
                      <span className="flex-1 h-[1px] bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...specialAwards, ...otherAwards].map((award: any, idx: number) => (
                        <AwardCardCompact key={idx} award={award} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CTA SECTION
          ═══════════════════════════════════════════════════════════════════ */}
          <section className="relative py-28 md:py-36 overflow-hidden bg-[#faf8f5]">
            {/* Pattern background */}
            <div className="absolute inset-0 bg-lunabella-diagonal opacity-40" />

            {/* Decorative silhouette */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[250px] opacity-[0.025] pointer-events-none hidden lg:block"
              style={{
                backgroundImage: `url('/silueta-golden.svg')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            />

            <div className="relative container mx-auto px-6 lg:px-12">
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center gap-6 mb-8">
                  <span className="w-20 h-[1px] bg-gradient-to-r from-transparent to-[#a58a1b]" />
                  <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.3em] uppercase">
                    Descubre más
                  </span>
                  <span className="w-20 h-[1px] bg-gradient-to-l from-transparent to-[#a58a1b]" />
                </div>

                <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-8">
                  Conoce a nuestros <span className="text-gradient-gold">campeones</span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto mb-12">
                  Los Golden Retrievers que han representado a LunaBella en competiciones caninas de alto nivel.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Link
                    href="/nuestros-goldens"
                    className="group inline-flex items-center justify-center gap-4 px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] bg-[#000000] text-[#ece8e1] transition-all duration-500 hover:bg-[#1a1a1a] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]"
                  >
                    Ver nuestros perros
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/exposiciones"
                    className="inline-flex items-center justify-center gap-3 px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] border border-[#a58a1b] text-[#a58a1b] transition-all duration-500 hover:bg-[#a58a1b] hover:text-white"
                  >
                    Más exposiciones
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    )
  } catch (error) {
    console.error('Error fetching exhibition:', error)
    return notFound()
  }
}

// Podium Card - Dark theme for awards section
function PodiumCard({ award, position }: { award: any; position: 'first' | 'second' | 'third' }) {
  const dog = award.dog as Dog | null
  const dogSlug = dog && typeof dog === 'object' ? dog.slug : null
  const dogName = dog && typeof dog === 'object' ? dog.name : 'Ejemplar'
  const dogImage = dog && typeof dog === 'object' ? dog.mainImage : null

  const positionConfig = {
    first: {
      label: '1º',
      name: 'Primer Lugar',
      gradient: 'from-[#ffd700] via-[#f0c14b] to-[#daa520]',
      borderColor: '#ffd700',
      bgGlow: 'rgba(255, 215, 0, 0.15)',
      textColor: '#ffd700',
    },
    second: {
      label: '2º',
      name: 'Segundo Lugar',
      gradient: 'from-[#e8e8e8] via-[#c0c0c0] to-[#a8a8a8]',
      borderColor: '#c0c0c0',
      bgGlow: 'rgba(192, 192, 192, 0.1)',
      textColor: '#c0c0c0',
    },
    third: {
      label: '3º',
      name: 'Tercer Lugar',
      gradient: 'from-[#cd7f32] via-[#b87333] to-[#a0522d]',
      borderColor: '#cd7f32',
      bgGlow: 'rgba(205, 127, 50, 0.1)',
      textColor: '#cd7f32',
    },
  }

  const config = positionConfig[position]

  const CardContent = () => (
    <div
      className="relative bg-white/5 backdrop-blur-sm border overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
      style={{ borderColor: `${config.borderColor}30` }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${config.bgGlow} 0%, transparent 70%)` }}
      />

      {/* Position badge */}
      <div className={`absolute top-4 right-4 w-14 h-14 flex items-center justify-center bg-gradient-to-br ${config.gradient} shadow-lg z-10`}>
        <span className="text-white font-heading text-2xl font-bold">{config.label}</span>
      </div>

      {/* Dog Image */}
      {dogImage && typeof dogImage === 'object' && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
            <MediaComponent
              resource={dogImage as Media}
              className="object-cover w-full h-full"
              imgClassName="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: config.textColor }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M8 12.5V20l4-2 4 2v-7.5" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: config.textColor }}>
            {award.title}
          </span>
        </div>

        <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-[#c9a93d] transition-colors">
          {dogName}
        </h3>

        <p className="text-white/50 text-sm">{config.name}</p>

        {/* Bottom accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
      </div>
    </div>
  )

  if (dogSlug) {
    return (
      <Link href={`/nuestros-goldens/${dogSlug}`} className="block">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}

// Compact Award Card - Dark theme
function AwardCardCompact({ award }: { award: any }) {
  const dog = award.dog as Dog | null
  const dogSlug = dog && typeof dog === 'object' ? dog.slug : null
  const dogName = dog && typeof dog === 'object' ? dog.name : 'Ejemplar'
  const dogImage = dog && typeof dog === 'object' ? dog.mainImage : null

  const CardContent = () => (
    <div className="flex gap-4 p-4 bg-white/5 border border-white/10 relative overflow-hidden group hover:bg-white/10 hover:border-[#a58a1b]/30 transition-all duration-300">
      {dogImage && typeof dogImage === 'object' && (
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
          <MediaComponent
            resource={dogImage as Media}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            imgClassName="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-3.5 h-3.5 text-[#a58a1b] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="5" />
            <path d="M8 12.5V20l4-2 4 2v-7.5" />
          </svg>
          <span className="text-[10px] text-[#c9a93d] uppercase tracking-wider font-medium truncate">
            {award.title}
          </span>
        </div>
        <h3 className="font-heading text-lg text-white group-hover:text-[#c9a93d] transition-colors truncate">
          {dogName}
        </h3>
      </div>
      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a58a1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )

  if (dogSlug) {
    return (
      <Link href={`/nuestros-goldens/${dogSlug}`} className="group block">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  if (!params) {
    return {
      title: 'Exposición no encontrada',
      description: 'La exposición que buscas no existe',
    }
  }

  try {
    const { slug } = await params
    const exhibition = await queryExhibitionBySlug({ slug })

    if (!exhibition) {
      return {
        title: 'Exposición no encontrada',
        description: 'La exposición que buscas no existe',
      }
    }

    const exhibitionData = exhibition as any
    const awardsCount = exhibitionData.awards?.length || 0

    return {
      title: `${exhibitionData.name || 'Exposición'} | LunaBella Golden Retrievers`,
      description: `${exhibitionData.name} - Exposición canina con ${awardsCount} ${awardsCount === 1 ? 'premio' : 'premios'} obtenidos por nuestros Golden Retrievers.`,
    }
  } catch (error) {
    console.error('Error generating metadata for exhibition:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información de la exposición',
    }
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const exhibitions = await payload.find({
    collection: 'exhibitions',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return exhibitions.docs.map(({ slug }) => ({ slug }))
}
