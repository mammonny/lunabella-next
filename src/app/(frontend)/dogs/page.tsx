import type { Metadata } from 'next/types'

import { DogsArchive } from '@/components/DogsArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener Dogs
  const dogs = await payload.find({
    collection: 'dogs',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    select: {
      id: true,
      name: true,
      slug: true,
      breed: true,
      gender: true,
      mainImage: true,
    },
  })

  return (
    <>
      <main className="isolate">
        <div className="pt-64 pb-24">
          <div className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h1>Nuestros Ejemplares</h1>
              <p>
                Conoce nuestros ejemplares reproductores. Cada ejemplar cuenta con pedigrí completo,
                certificaciones de salud y un temperamento excepcional.
              </p>
            </div>
          </div>

          <div className="container mb-8">
            <PageRange
              collection="dogs"
              currentPage={dogs.page}
              limit={12}
              totalDocs={dogs.totalDocs}
            />
          </div>

          <DogsArchive dogs={dogs.docs} />

          <div className="container">
            {dogs.totalPages > 1 && dogs.page && (
              <Pagination page={dogs.page} totalPages={dogs.totalPages} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Criadero Goizametz - Nuestros Ejemplares`,
  }
}
