import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Importaciones para páginas de raza
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PuppiesArchive } from '@/components/PuppiesArchive'
import { DogsArchive } from '@/components/DogsArchive'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Función para obtener raza por slug
const queryBreedBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'breeds',
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

// Función para obtener página por slug
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  // Obtener páginas
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Obtener razas
  const breeds = await payload.find({
    collection: 'breeds',
    limit: 100,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const pageParams =
    pages.docs?.filter((doc) => doc.slug !== 'home').map(({ slug }) => ({ slug })) || []

  const breedParams = breeds.docs.map((breed) => ({ slug: breed.slug }))

  return [...pageParams, ...breedParams]
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise

  if (!slug) {
    return notFound()
  }

  try {
    // Primero intentar buscar una raza
    const breed = (await queryBreedBySlug({ slug })) as any

    if (breed) {
      // Es una página de raza
      const {
        name,
        description,
        mainImage,
        characteristics,
        temperament,
        careInstructions,
        size,
        lifeExpectancy,
        weight,
        height,
      } = breed

      // Obtener los últimos 3 cachorros disponibles de esta raza
      const payload = await getPayload({ config: configPromise })
      const recentPuppies = await payload.find({
        collection: 'puppies',
        depth: 2,
        limit: 3,
        overrideAccess: false,
        where: {
          breed: {
            equals: breed.id,
          },
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
        sort: '-createdAt',
      })

      // Obtener los últimos 3 ejemplares de esta raza
      const recentDogs = await payload.find({
        collection: 'dogs',
        depth: 2,
        limit: 3,
        overrideAccess: false,
        where: {
          breed: {
            equals: breed.id,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          breed: true,
          gender: true,
          mainImage: true,
        },
        sort: '-createdAt',
      })

      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-64">
          {/* Breadcrumbs */}
          <Breadcrumbs
            className="mb-6"
            items={[
              {
                label: 'Home',
                href: '/',
                icon: <Home className="h-4 w-4" />,
              },
              {
                label: name || 'Raza',
              },
            ]}
          />

          {/* Hero Section */}
          <div className="mb-12">
            <div className="relative h-[600px] w-full overflow-hidden rounded-lg mb-8">
              {mainImage && (
                <Media
                  resource={mainImage as MediaType}
                  imgClassName="object-cover w-full h-full"
                  fill
                />
              )}
              {/* Degradado hacia blanco en la parte inferior */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{name}</h1>
          </div>

          {/* Texto Introductorio */}
          <div className="mb-12">
            <div className="prose dark:prose-invert max-w-none">
              {description ? (
                <RichText data={description} enableGutter={false} className="max-w-none" />
              ) : (
                <p>Información sobre la raza {name}.</p>
              )}
            </div>
          </div>

          {/* Características Básicas */}
          {(size || lifeExpectancy || weight || height) && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {size && (
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-2">Tamaño</h3>
                    <p className="text-muted-foreground capitalize">{size.replace('_', ' ')}</p>
                  </div>
                )}
                {lifeExpectancy && (
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-2">Esperanza de Vida</h3>
                    <p className="text-muted-foreground">{lifeExpectancy}</p>
                  </div>
                )}
                {weight && (weight.min || weight.max) && (
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-2">Peso</h3>
                    <p className="text-muted-foreground">
                      {weight.min && weight.max
                        ? `${weight.min} - ${weight.max} kg`
                        : weight.min
                          ? `${weight.min} kg`
                          : `${weight.max} kg`}
                    </p>
                  </div>
                )}
                {height && (height.min || height.max) && (
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-2">Altura</h3>
                    <p className="text-muted-foreground">
                      {height.min && height.max
                        ? `${height.min} - ${height.max} cm`
                        : height.min
                          ? `${height.min} cm`
                          : `${height.max} cm`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Temperamento */}
          {temperament && temperament.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Temperamento</h2>
              <div className="flex flex-wrap gap-2">
                {temperament.map((item: any, index: number) => (
                  <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full">
                    {item.trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Características Detalladas */}
          {characteristics && characteristics.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Características Detalladas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characteristics.map((char: any, index: number) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <h3 className="font-semibold mb-2">{char.title}</h3>
                    <p className="text-muted-foreground">{char.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cuidados */}
          {careInstructions && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Cuidados Específicos</h2>
              <div className="prose dark:prose-invert max-w-none">
                <RichText data={careInstructions} />
              </div>
            </div>
          )}

          {/* Nuestros Cachorros */}
          {recentPuppies.docs.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nuestros Cachorros de {name}</h2>
                <Link href={`/${slug}/cachorros`}>
                  <Button variant="outline">Ver Todos</Button>
                </Link>
              </div>
              <PuppiesArchive puppies={recentPuppies.docs} />
            </div>
          )}

          {/* Nuestros Ejemplares */}
          {recentDogs.docs.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nuestros Ejemplares de {name}</h2>
                <Link href={`/${slug}/ejemplares`}>
                  <Button variant="outline">Ver Todos</Button>
                </Link>
              </div>
              <DogsArchive dogs={recentDogs.docs} />
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center bg-primary/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">¿Interesado en un {name}?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contáctanos para conocer nuestros cachorros disponibles y ejemplares de esta raza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${slug}/cachorros`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Ver Cachorros Disponibles
                </Button>
              </Link>
              <Link href={`/${slug}/ejemplares`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver Nuestros Ejemplares
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )
    }

    // Si no es una raza, intentar buscar una página de Payload
    const url = '/' + slug
    let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryPageBySlug({ slug })

    // Remove this code once your website is seeded
    if (!page && slug === 'home') {
      page = homeStatic
    }

    if (!page) {
      return <PayloadRedirects url={url} />
    }

    const { hero, layout } = page

    return (
      <article className="pt-16 pb-24">
        <PageClient />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </article>
    )
  } catch (error) {
    console.error('Error fetching page or breed:', error)
    return notFound()
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise

  try {
    // Primero intentar buscar una raza
    const breed = await queryBreedBySlug({ slug })

    if (breed) {
      const breedData = breed as any
      const metaTitle = breedData.meta?.title || `${breedData.name} - Criadero Goizametz`
      const metaDescription =
        breedData.meta?.description ||
        `Descubre todo sobre la raza ${breedData.name}. Cachorros disponibles, características, cuidados y más información.`

      return {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          images:
            breedData.meta?.image?.url || breedData.mainImage?.url
              ? [{ url: breedData.meta?.image?.url || breedData.mainImage?.url }]
              : [],
        },
      }
    }

    // Si no es una raza, buscar página de Payload
    const page = await queryPageBySlug({ slug })
    return generateMeta({ doc: page })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información',
    }
  }
}
