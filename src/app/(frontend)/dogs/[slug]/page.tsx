import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { DogHero } from '@/heros/DogHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

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

  const params = dogs.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Dog({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/dogs/' + slug
  const dog = await queryDogBySlug({ slug })

  if (!dog) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <DogHero dog={dog} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <div className="max-w-[48rem] mx-auto">
            {/* Información básica */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Información Básica</h2>
              <RichText data={dog.description} enableGutter={false} />
            </div>

            {/* Características */}
            {dog.color && dog.weight && dog.height && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Color</h3>
                    <p>{dog.color}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Peso</h3>
                    <p>{dog.weight} kg</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Altura</h3>
                    <p>{dog.height} cm</p>
                  </div>
                </div>
              </div>
            )}

            {/* Características especiales */}
            {dog.specialFeatures && dog.specialFeatures.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Características Especiales</h2>
                <div className="space-y-4">
                  {dog.specialFeatures.map((feature, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{feature.feature}</h3>
                      {feature.description && <p>{feature.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pedigree */}
            {(dog.pedigreeNumber ||
              (dog.parents && (dog.parents.father || dog.parents.mother))) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Pedigree</h2>
                {dog.pedigreeNumber && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Número de Pedigree</h3>
                    <p>{dog.pedigreeNumber}</p>
                  </div>
                )}
                {dog.parents && (dog.parents.father || dog.parents.mother) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dog.parents.father && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Padre</h3>
                        <p>{dog.parents.father}</p>
                      </div>
                    )}
                    {dog.parents.mother && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Madre</h3>
                        <p>{dog.parents.mother}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Galería de imágenes */}
            {dog.gallery && dog.gallery.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Galería</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dog.gallery.map((item, index) => (
                    <div key={index} className="relative aspect-square">
                      {item.image && typeof item.image === 'object' && 'url' in item.image && (
                        <img
                          src={item.image.url || item.image.sizes?.medium?.url || ''}
                          alt={item.caption || `${dog.name} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                          <p className="text-sm">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const dog = await queryDogBySlug({ slug })

  // Crear un objeto con la estructura esperada por generateMeta
  const metaDoc = {
    ...dog,
    meta: {
      title: dog?.name ? `${dog.name} - Criadero Goizametz` : 'Ejemplar - Criadero Goizametz',
      description: `Conoce a ${dog?.name}, un ejemplar de ${typeof dog?.breed === 'object' ? dog?.breed?.name : 'nuestra colección'}.`,
      image: dog?.mainImage || undefined,
    },
  }

  return generateMeta({ doc: metaDoc })
}

const queryDogBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'dogs',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
