import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'
import CTASection from '@/components/CTASection'

import type { Media } from '@/payload-types'
import { PuppyGallery } from '@/components/PuppyGallery'
import { Media as MediaComponent } from '@/components/Media'
import { OtherAvailablePuppiesCarousel } from '@/components/OtherAvailablePuppiesCarousel'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ slug: string }> | undefined
}

const queryPuppyBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'puppies',
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
    const payload = await getPayload({ config: configPromise })
    const puppy = (await queryPuppyBySlug({ slug })) as any

    if (!puppy) {
      return notFound()
    }

    const {
      name,
      breed,
      gender,
      price,
      disponibilidad,
      parents,
      birthDate,
      description,
      mainImage,
      gallery,
      color,
      weight,
      specialFeatures,
    } = puppy

    // Fetch litter mates
    type LitterMate = {
      id: string | number
      image: Media | null
      slug: string
      name?: string | null
    }
    let litterMates: LitterMate[] = []
    const litterId = puppy.litter?.id

    if (litterId) {
      try {
        const siblingsResult = await payload.find({
          collection: 'puppies',
          depth: 1,
          pagination: false,
          where: {
            and: [
              { 'litter.id': { equals: litterId } },
              { id: { not_equals: puppy.id } },
            ],
          },
        })

        litterMates = siblingsResult.docs.map(
          (sibling): LitterMate => ({
            id: sibling.id,
            image: sibling.mainImage as Media | null,
            slug: sibling.slug as string,
            name: sibling.name,
          }),
        )
      } catch (fetchError) {
        console.error('Error fetching siblings:', fetchError)
      }
    }

    // Check if there are other available puppies
    let hasOtherPuppies = false
    try {
      const otherResult = await payload.find({
        collection: 'puppies',
        limit: 1,
        pagination: false,
        where: {
          and: [
            { disponibilidad: { equals: 'available' } },
            { id: { not_equals: puppy.id } },
          ],
        },
      })
      hasOtherPuppies = otherResult.docs.length > 0
    } catch (_) {}

    const formattedBirthDate = birthDate
      ? new Date(birthDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

    const calculateAgeInWeeks = () => {
      if (!birthDate) return null

      const birthDateObj = new Date(birthDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

      if (diffWeeks > 52) {
        const years = Math.floor(diffWeeks / 52)
        return `${years} ${years === 1 ? 'año' : 'años'}`
      }

      return `${diffWeeks} semanas`
    }

    const ageInWeeks = calculateAgeInWeeks()
    const breedName = (breed as any)?.name || 'Golden Retriever'
    const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

    const statusText =
      disponibilidad === 'available'
        ? 'Disponible'
        : disponibilidad === 'reserved'
          ? 'Reservado'
          : disponibilidad === 'sold'
            ? 'Vendido'
            : ''

    const statusColors =
      disponibilidad === 'available'
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : disponibilidad === 'reserved'
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : disponibilidad === 'sold'
            ? 'bg-gray-100 text-gray-500 border border-gray-200'
            : ''

    // Build specs array
    const specs = [
      { label: 'Sexo', value: genderText },
      { label: 'Edad', value: ageInWeeks },
      { label: 'Color', value: color },
      { label: 'Peso', value: weight ? `${weight} kg` : null },
      { label: 'Fecha de nacimiento', value: formattedBirthDate },
      { label: 'Raza', value: breedName },
    ].filter(spec => spec.value)

    const formattedPrice = price
      ? `${price.toLocaleString('es-ES')} €`
      : 'Consultar'

    return (
      <main className="isolate bg-white pt-16">
        <PageBreadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Cachorros', href: '/cachorros' },
          { label: name || 'Cachorro' },
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
                  puppyName={name || 'Cachorro'}
                />
              </div>

              {/* Right Column - Details (sticky) */}
              <div className="lg:sticky lg:top-24 lg:self-center">
                {/* Name */}
                <h1 className="font-heading text-3xl md:text-4xl text-gray-900 mb-2">
                  {name || 'Cachorro'}
                </h1>

                {/* Inline meta info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${gender === 'male' ? 'bg-[#5b8fc9]' : gender === 'female' ? 'bg-[#d4a5a0]' : 'bg-gray-300'}`} />
                    {genderText}
                  </span>
                  {ageInWeeks && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{ageInWeeks}</span>
                    </>
                  )}
                  {statusText && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${statusColors}`}>
                        {statusText}
                      </span>
                    </>
                  )}
                </div>

                {/* Price */}
                <p className="text-2xl md:text-3xl font-heading text-gray-900 mb-6">
                  {formattedPrice}
                </p>

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
                      {specialFeatures.map((item: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-[#f5f4f2] text-gray-700 text-sm border-l-2 border-[#a58a1b]/30 hover:border-[#a58a1b] transition-colors duration-300"
                        >
                          {item.feature || item}
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

                {/* CTA Box */}
                <div className="relative bg-[#f5f4f2] p-6 overflow-hidden group hover:shadow-lg transition-shadow duration-500">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#a58a1b] via-[#c9a93d] to-[#a58a1b] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  <div className="relative">
                    <h3 className="font-heading text-xl md:text-2xl text-gray-900 mb-3">
                      ¿Te interesa <span className="text-[#a58a1b]">{name}</span>?
                    </h3>
                    <p className="text-gray-600 text-[15px] mb-5 leading-relaxed">
                      Incluye kit de iniciación, primeras vacunas, microchip y asesoramiento continuo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/contacto"
                        className="group flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] bg-[#000] text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
                      >
                        <span>Información</span>
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
                  Línea sanguínea
                </span>
                <span className="w-12 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-12">
                Padres de {name}
              </h2>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

                {/* Ring icon - union symbol */}
                {parents.father && parents.mother && (
                  <div className="absolute left-1/2 top-[calc(50%-1rem)] -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center">
                    <div className="bg-white rounded-full p-2.5 shadow-sm border border-gray-100">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#c9a93d]">
                        <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor" opacity="0.15" />
                        <circle cx="9" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="15" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M12 8.5C13 9.5 13.5 10.7 13.5 12C13.5 13.3 13 14.5 12 15.5C11 14.5 10.5 13.3 10.5 12C10.5 10.7 11 9.5 12 8.5Z" fill="currentColor" opacity="0.25" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Mobile ring icon */}
                {parents.father && parents.mother && (
                  <div className="flex md:hidden items-center justify-center -my-4">
                    <div className="bg-white rounded-full p-2 shadow-sm border border-gray-100">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#c9a93d]">
                        <circle cx="9" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="15" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M12 8.5C13 9.5 13.5 10.7 13.5 12C13.5 13.3 13 14.5 12 15.5C11 14.5 10.5 13.3 10.5 12C10.5 10.7 11 9.5 12 8.5Z" fill="currentColor" opacity="0.25" />
                      </svg>
                    </div>
                  </div>
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

        {/* Litter Mates Section */}
        {litterMates.length > 0 && (
          <section className="bg-[#faf8f5] py-16 md:py-24">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="w-12 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.2em] uppercase">
                  Su camada
                </span>
                <span className="w-12 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-12">
                Hermanos de <span className="text-gradient-gold">{name}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {litterMates.map((sibling) => (
                  <Link
                    key={sibling.id}
                    href={`/cachorros/${sibling.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square bg-[#f5f4f2] overflow-hidden mb-3">
                      {sibling.image && typeof sibling.image === 'object' && (
                        <MediaComponent
                          resource={sibling.image}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          imgClassName="object-cover w-full h-full"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a58a1b] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                    <h3 className="font-heading text-base text-gray-900 group-hover:text-[#a58a1b] transition-colors text-center">
                      {sibling.name || 'Cachorro'}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Available Puppies Carousel */}
        {hasOtherPuppies && (
          <section className={`${litterMates.length > 0 ? 'bg-white' : 'bg-[#faf8f5]'} py-16 md:py-24`}>
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="w-12 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.2em] uppercase">
                  Descubre más
                </span>
                <span className="w-12 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-3xl md:text-4xl text-gray-900 text-center mb-12">
                Otros <span className="text-gradient-gold">cachorros</span>
              </h2>

              <OtherAvailablePuppiesCarousel currentPuppyId={puppy.id} />
            </div>
          </section>
        )}

        <CTASection
          label="¿Te interesa?"
          title={<>¿Quieres un <span className="text-gradient-gold">Golden Retriever</span>?</>}
          description="Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de nuestros cachorros, nos encantaría conocerte."
          primaryLabel="Contactar"
          primaryHref="/contacto"
          secondaryLabel="Ver ejemplares"
          secondaryHref="/nuestros-goldens"
        />
      </main>
    )
  } catch (error) {
    console.error('Error fetching puppy:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  if (!params) {
    return {
      title: 'Cachorro no encontrado',
      description: 'El cachorro que buscas no existe',
    }
  }

  try {
    const { slug } = await params
    const puppy = await queryPuppyBySlug({ slug })

    if (!puppy) {
      return {
        title: 'Cachorro no encontrado',
        description: 'El cachorro que buscas no existe',
      }
    }

    const puppyData = puppy as any
    const breedName = (puppyData.breed as any)?.name || 'Golden Retriever'

    return {
      title: `${puppyData.name || 'Cachorro'} | ${breedName} - LunaBella`,
      description: `Conoce a ${puppyData.name || 'nuestro cachorro'}, ${puppyData.gender === 'male' ? 'un macho' : 'una hembra'} ${breedName} disponible en LunaBella Golden Retriever.`,
    }
  } catch (error) {
    console.error('Error generating metadata for puppy:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información del cachorro',
    }
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const puppies = await payload.find({
    collection: 'puppies',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return puppies.docs.map(({ slug }) => ({ slug }))
}
