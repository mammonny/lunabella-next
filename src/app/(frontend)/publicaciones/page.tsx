import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener Posts
  const posts = await payload.find({
    collection: 'publicaciones',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  // Obtener Dogs
  const dogs = await payload.find({
    collection: 'ejemplares',
    depth: 2, // Aumentamos la profundidad para acceder a las relaciones anidadas
    limit: 8, // Ajusta el número de perros que quieres mostrar
    overrideAccess: false,
    select: {
      name: true,
      breed: true,
      mainImage: true, // Cambiado de 'image' a 'mainImage'
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      {/* Sección de Posts */}
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="publicaciones"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>

      {/* Sección de Dogs */}
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h2>Dogs</h2>
        </div>
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dogs.docs && dogs.docs.length > 0 ? (
          dogs.docs.map((dog) => <DogCard key={dog.id} dog={dog} />)
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No hay perros disponibles para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog | LunaBella Golden Retriever`,
  }
}

// Componente DogCard para mostrar cada perro
const DogCard = ({ dog }: { dog: any }) => {
  // Obtenemos la URL de la imagen desde la relación mainImage
  const imageUrl =
    dog.mainImage?.url || dog.mainImage?.sizes?.medium?.url || '/media/placeholder.jpg'

  // Obtenemos el nombre de la raza desde la relación breed
  const breedName = typeof dog.breed === 'object' ? dog.breed?.name : 'Raza no especificada'

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      <img src={imageUrl} alt={dog.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-lg font-semibold">{dog.name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{breedName}</p>
    </div>
  )
}
