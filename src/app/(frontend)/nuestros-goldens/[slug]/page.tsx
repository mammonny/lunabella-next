import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'
import CTASection from '@/components/CTASection'

import type { Media } from '@/payload-types'
import { PuppyGallery } from '@/components/PuppyGallery'
import { OtherDogsCarousel } from '@/components/OtherDogsCarousel'
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
    collection: 'ejemplares',
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
      apodo,
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
      <main className="isolate bg-white pt-16">
        <PageBreadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Nuestros Goldens', href: '/nuestros-goldens' },
          { label: name || 'Ejemplar' },
        ]} />
        {/* Main Content - Shopify-style product layout */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12">
              {/* Left Column - Gallery */}
              <div>
                <PuppyGallery
                  mainImage={mainImage as Media}
                  gallery={gallery || []}
                  puppyName={name || 'Ejemplar'}
                />
              </div>

              {/* Right Column - Details (sticky) */}
              <div className="lg:sticky lg:top-24 lg:self-center">
                {/* Name & Breed */}
                <h1 className="font-heading text-3xl md:text-4xl text-gray-900 mb-2">
                  {name || 'Ejemplar'}
                </h1>
                {apodo && (
                  <p className="italic text-lg font-bold mb-4"><span className="bg-gradient-to-r from-[#8a7316] to-[#d4b94e] bg-clip-text text-transparent">&ldquo;{apodo}&rdquo;</span></p>
                )}

                {/* Inline meta info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${gender === 'male' ? 'bg-[#5b8fc9]' : gender === 'female' ? 'bg-[#d4a5a0]' : 'bg-gray-300'}`} />
                    {genderText}
                  </span>
                  {ageInYears && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{ageInYears}</span>
                    </>
                  )}
                  {pedigreeNumber && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-[#a58a1b]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Pedigree
                      </span>
                    </>
                  )}
                </div>

                {/* Breeding status badge */}
                {breedingStatus && breedingStatus !== 'active' && (
                  <div className="mb-6">
                    <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                      breedingStatus === 'retired'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : breedingStatus === 'deceased'
                          ? 'bg-gray-100 text-gray-500 border border-gray-200'
                          : ''
                    }`}>
                      {breedingStatus === 'retired' ? 'Retirado' : breedingStatus === 'deceased' ? 'En Memoria' : ''}
                    </span>
                  </div>
                )}

                {/* Gold divider */}
                <div className="w-full h-px bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-transparent mb-6" />

                {/* Specs Grid */}
                <dl className="grid grid-cols-2 gap-x-8 gap-y-0 mb-8">
                  {specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="py-3 border-b border-gray-100 group"
                    >
                      <dt className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1 transition-colors duration-300 group-hover:text-[#a58a1b]">
                        {spec.label}
                      </dt>
                      <dd className="text-gray-900 font-medium text-sm">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Special Features */}
                {specialFeatures && specialFeatures.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-3">
                      Características especiales
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specialFeatures.map((feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-[#f5f4f2] text-gray-700 text-sm border-l-2 border-[#a58a1b]/30 hover:border-[#a58a1b] transition-colors duration-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {description && description.root && (
                  <div className="mb-8">
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-3">
                      Sobre {name}
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <RichText data={description} enableGutter={false} />
                    </div>
                  </div>
                )}

                {/* CTA Box - conditional based on breeding status */}
                {breedingStatus === 'deceased' ? (
                  <div className="relative bg-[#f9f8f6] p-6 border border-gray-200/60">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 text-[#c9a93d] shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-gray-700 text-[15px] leading-relaxed mb-1">
                          {name} siempre será parte de nuestra familia. Su legado vive en cada una de las generaciones que nos dejó.
                        </p>
                        <Link
                          href="/nuestros-goldens"
                          className="text-[#a58a1b] text-sm hover:underline underline-offset-4"
                        >
                          Conoce a nuestros ejemplares
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-[#f5f4f2] p-6 overflow-hidden group hover:shadow-lg transition-shadow duration-500">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-[#a58a1b] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                    <div className="relative">
                      {breedingStatus === 'retired' ? (
                        <>
                          <h3 className="font-heading text-xl md:text-2xl text-gray-900 mb-3">
                            Conoce a nuestros <span className="text-[#a58a1b]">ejemplares</span>
                          </h3>
                          <p className="text-gray-600 text-[15px] mb-5 leading-relaxed">
                            {name} está retirado de la cría. Descubre nuestros ejemplares activos o contáctanos para más información.
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-heading text-xl md:text-2xl text-gray-900 mb-3">
                            ¿Quieres un cachorro de <span className="text-[#a58a1b]">{name}</span>?
                          </h3>
                          <p className="text-gray-600 text-[15px] mb-5 leading-relaxed">
                            Consulta la disponibilidad de cachorros de esta línea o contáctanos para más información.
                          </p>
                        </>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={breedingStatus === 'retired' ? '/nuestros-goldens' : '/cachorros'}
                          className="group flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] bg-[#000] text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
                        >
                          <span>{breedingStatus === 'retired' ? 'Ejemplares' : 'Cachorros'}</span>
                          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                          </svg>
                        </Link>
                        <a
                          href="tel:+34670004089"
                          className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] border border-gray-300 text-gray-600 transition-all duration-300 ease-out hover:bg-black/5 hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                          <span>Llamar</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

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
                    href={`/nuestros-goldens/${parents.father.slug}`}
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
                    href={`/nuestros-goldens/${parents.mother.slug}`}
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

        <CTASection
          label="¿Te interesa?"
          title={<>¿Buscas un <span className="text-gradient-gold">cachorro</span>?</>}
          description="Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de nuestros cachorros, nos encantaría conocerte."
          primaryLabel="Ver cachorros"
          primaryHref="/cachorros"
          secondaryLabel="Contactar"
          secondaryHref="/contacto"
        />
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
    collection: 'ejemplares',
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
