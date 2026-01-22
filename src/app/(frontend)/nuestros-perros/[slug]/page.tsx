import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import type { Media } from '@/payload-types'
import { PuppyGallery } from '@/components/PuppyGallery'
import { OtherDogsCarousel } from '@/components/OtherDogsCarousel'
import { DogDetailHero } from '@/components/DogDetailHero'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ slug: string }> | undefined
}

const queryDogBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'dogs',
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
    const dog = (await queryDogBySlug({ slug })) as any

    if (!dog) {
      return notFound()
    }

    const {
      name,
      breed,
      gender,
      breedingStatus,
      parents,
      birthDate,
      description,
      mainImage,
      gallery,
      color,
      weight,
      height,
      pedigreeNumber,
      breeder,
      specialFeatures,
    } = dog

    const formattedBirthDate = birthDate
      ? new Date(birthDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

    const calculateAgeInYears = () => {
      if (!birthDate) return null

      const birthDateObj = new Date(birthDate)
      const today = new Date()
      let age = today.getFullYear() - birthDateObj.getFullYear()
      const monthDiff = today.getMonth() - birthDateObj.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--
      }

      if (age < 1) {
        const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
        return `${diffMonths} meses`
      }

      return `${age} ${age === 1 ? 'año' : 'años'}`
    }

    const ageInYears = calculateAgeInYears()
    const breedName = (breed as any)?.name || 'Golden Retriever'
    const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

    // Build specs array
    const specs = [
      { label: 'Raza', value: breedName },
      { label: 'Sexo', value: genderText },
      { label: 'Edad', value: ageInYears },
      { label: 'Color', value: color },
      { label: 'Peso', value: weight ? `${weight} kg` : null },
      { label: 'Altura', value: height ? `${height} cm` : null },
      { label: 'Fecha de nacimiento', value: formattedBirthDate },
      { label: 'Criador', value: breeder },
      { label: 'Nº Pedigree', value: pedigreeNumber },
    ].filter(spec => spec.value)

    return (
      <main className="isolate">
        {/* Hero Section */}
        <DogDetailHero
          name={name || 'Ejemplar'}
          breedName={breedName}
          mainImage={mainImage as Media}
          gender={gender}
          breedingStatus={breedingStatus}
          birthDate={birthDate}
          pedigreeNumber={pedigreeNumber}
        />

        {/* Breadcrumbs - Simple editorial style */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 lg:px-12 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#a58a1b] transition-colors">
                Inicio
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/nuestros-perros" className="hover:text-[#a58a1b] transition-colors">
                Nuestros Perros
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">{name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="bg-white py-16 md:py-24 relative overflow-hidden">
          {/* Subtle decorative background element */}
          <div
            className="absolute -right-20 top-1/4 w-[400px] h-[280px] opacity-[0.015] pointer-events-none hidden xl:block"
            style={{
              backgroundImage: `url('/silueta-golden.svg')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />

          <div className="container mx-auto px-6 lg:px-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left Column - Gallery */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-10 h-px bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
                  <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.25em] uppercase">
                    Galería
                  </span>
                </div>
                <PuppyGallery
                  mainImage={mainImage as Media}
                  gallery={gallery || []}
                  puppyName={name || 'Ejemplar'}
                />
              </div>

              {/* Right Column - Details */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-10 h-px bg-gradient-to-r from-[#a58a1b] to-[#c9a93d]" />
                  <span className="text-[#a58a1b] text-[11px] font-medium tracking-[0.25em] uppercase">
                    Ficha técnica
                  </span>
                </div>

                {/* Specs Grid - Premium Editorial Style */}
                <dl className="grid grid-cols-2 gap-x-10 gap-y-0 mb-12">
                  {specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="py-4 border-b border-gray-100 group"
                      style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
                    >
                      <dt className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1.5 transition-colors duration-300 group-hover:text-[#a58a1b]">
                        {spec.label}
                      </dt>
                      <dd className="text-gray-900 font-medium text-[15px]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Special Features */}
                {specialFeatures && specialFeatures.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-4">
                      Características especiales
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specialFeatures.map((feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-[#f5f4f2] text-gray-700 text-sm border-l-2 border-[#a58a1b]/30 hover:border-[#a58a1b] transition-colors duration-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Box - Premium with gold accent */}
                <div className="relative bg-[#f5f4f2] p-8 overflow-hidden group hover:shadow-lg transition-shadow duration-500">
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-[#a58a1b] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  {/* Subtle pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                      backgroundImage: `url('/silueta-golden.svg')`,
                      backgroundSize: '80px',
                      backgroundPosition: 'bottom right',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />

                  <div className="relative">
                    <h3 className="font-heading text-xl text-gray-900 mb-2">
                      ¿Te interesa <span className="text-[#a58a1b]">{name}</span>?
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                      Contáctanos para conocer más sobre este ejemplar y nuestro programa de cría.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/contacto"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 bg-[#000] text-[#ece8e1] hover:bg-[#1a1a1a] hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <span>Contactar</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                      </Link>
                      <a
                        href="tel:+34600000000"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 border border-gray-200 text-gray-600 hover:border-[#a58a1b] hover:text-[#a58a1b] hover:bg-[#a58a1b]/5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <span>Llamar</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        {description && description.root && (
          <section className="bg-[#faf8f5] py-16 md:py-24">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="w-12 h-px bg-[#a58a1b]" />
                  <span className="text-[#a58a1b] text-xs font-medium tracking-[0.2em] uppercase">
                    Sobre {name}
                  </span>
                  <span className="w-12 h-px bg-[#a58a1b]" />
                </div>

                <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-8">
                  Conoce a <span className="text-gradient-gold">{name}</span>
                </h2>

                <div className="prose prose-lg max-w-none text-gray-600 [&_p]:text-center">
                  <RichText data={description} enableGutter={false} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Parents Section - if available */}
        {parents && (parents.father || parents.mother) && (
          <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="w-12 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.2em] uppercase">
                  Línea de sangre
                </span>
                <span className="w-12 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-12">
                Padres de {name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {parents.father && typeof parents.father === 'object' && (
                  <Link
                    href={`/nuestros-perros/${parents.father.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] bg-[#f5f4f2] overflow-hidden mb-4">
                      {parents.father.mainImage && (
                        <MediaComponent
                          resource={parents.father.mainImage as Media}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          imgClassName="object-cover w-full h-full"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5b8fc9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Padre</p>
                    <h3 className="font-heading text-xl text-gray-900 group-hover:text-[#a58a1b] transition-colors">
                      {parents.father.name}
                    </h3>
                  </Link>
                )}

                {parents.mother && typeof parents.mother === 'object' && (
                  <Link
                    href={`/nuestros-perros/${parents.mother.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] bg-[#f5f4f2] overflow-hidden mb-4">
                      {parents.mother.mainImage && (
                        <MediaComponent
                          resource={parents.mother.mainImage as Media}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          imgClassName="object-cover w-full h-full"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d4a5a0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Madre</p>
                    <h3 className="font-heading text-xl text-gray-900 group-hover:text-[#a58a1b] transition-colors">
                      {parents.mother.name}
                    </h3>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Other Dogs Carousel */}
        <section className="bg-[#faf8f5] py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className="w-12 h-px bg-[#a58a1b]" />
              <span className="text-[#a58a1b] text-xs font-medium tracking-[0.2em] uppercase">
                Descubre más
              </span>
              <span className="w-12 h-px bg-[#a58a1b]" />
            </div>

            <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-12">
              Otros <span className="text-gradient-gold">ejemplares</span>
            </h2>

            {dog?.id && <OtherDogsCarousel currentDogId={dog.id} showTitle={false} />}
          </div>
        </section>

        {/* Final CTA Section - LunaBella diagonal style */}
        <section className="relative py-28 md:py-40 overflow-hidden bg-lunabella-diagonal">
          <div className="relative container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  ¿Te interesa?
                </span>
                <span className="w-16 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
                ¿Buscas un <span className="text-gradient-gold">cachorro</span>?
              </h2>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
                Si estás interesado en formar parte de nuestra familia y darle un hogar
                a uno de nuestros cachorros, nos encantaría conocerte.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cachorros"
                  className="inline-flex items-center justify-center gap-3 px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                  style={{ backgroundColor: '#000000', color: '#ece8e1' }}
                >
                  Ver cachorros disponibles
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
    )
  } catch (error) {
    console.error('Error fetching dog:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  if (!params) {
    return {
      title: 'Ejemplar no encontrado',
      description: 'El ejemplar que buscas no existe',
    }
  }

  try {
    const { slug } = await params
    const dog = await queryDogBySlug({ slug })

    if (!dog) {
      return {
        title: 'Ejemplar no encontrado',
        description: 'El ejemplar que buscas no existe',
      }
    }

    const dogData = dog as any
    const breedName = (dogData.breed as any)?.name || 'Golden Retriever'
    const statusText =
      dogData.breedingStatus === 'retired'
        ? ' (Retirado)'
        : dogData.breedingStatus === 'deceased'
          ? ' (En Memoria)'
          : ''

    return {
      title: `${dogData.name || 'Ejemplar'} | ${breedName}${statusText} - LunaBella`,
      description: `Conoce a ${dogData.name || 'nuestro ejemplar'}, ${dogData.gender === 'male' ? 'un macho' : 'una hembra'} ${breedName} de nuestra familia de criadores de Golden Retriever.`,
    }
  } catch (error) {
    console.error('Error generating metadata for dog:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información del ejemplar',
    }
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const dogs = await payload.find({
    collection: 'dogs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return dogs.docs.map(({ slug }) => ({ slug }))
}
