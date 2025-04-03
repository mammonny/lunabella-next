import type { Metadata } from 'next/types'

import { PuppiesArchive } from '@/components/PuppiesArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener Puppies
  const puppies = await payload.find({
    // @ts-ignore - 'puppies' will be added to CollectionSlug after server restart
    collection: 'puppies',
    depth: 2,
    limit: 12,
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

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Cachorros en Venta</h1>
          <p>
            Explora nuestra selección de cachorros disponibles para compra. Cada cachorro viene con
            pedigrí completo y todas las vacunas necesarias.
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="puppies"
          currentPage={puppies.page}
          limit={12}
          totalDocs={puppies.totalDocs}
        />
      </div>

      <PuppiesArchive puppies={puppies.docs} />

      <div className="container">
        {puppies.totalPages > 1 && puppies.page && (
          <Pagination page={puppies.page} totalPages={puppies.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Criadero Goizametz - Cachorros en Venta`,
  }
}
