import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { PuppiesArchive } from '@/components/PuppiesArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Home, Dog } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
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

export default async function PuppiesByBreedPage({ params }: Args) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  try {
    // Obtener la raza por slug
    const breed = await queryBreedBySlug({ slug })

    if (!breed) {
      return notFound()
    }

    const breedData = breed as any
    const payload = await getPayload({ config: configPromise })

    // Obtener cachorros filtrados por raza
    const puppies = await payload.find({
      collection: 'puppies',
      depth: 2,
      limit: 12,
      overrideAccess: false,
      where: {
        breed: {
          equals: breedData.id,
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
    })

    return (
      <main className="isolate">
        <div className="pt-64 pb-24">
          {/* Breadcrumbs */}
          <div className="container mb-8">
            <Breadcrumbs
              items={[
                {
                  label: 'Home',
                  href: '/',
                  icon: <Home className="h-4 w-4" />,
                },
                {
                  label: breedData.name || 'Raza',
                  href: `/${slug}`,
                },
                {
                  label: 'Cachorros',
                },
              ]}
            />
          </div>

          {/* Header */}
          <div className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h1>Cachorros de {breedData.name} en Venta</h1>
              <p>
                Explora nuestra selección de cachorros de {breedData.name} disponibles para compra.
                Cada cachorro viene con pedigrí completo y todas las vacunas necesarias.
              </p>
            </div>
          </div>

          {/* Page Range */}
          {puppies.totalDocs > 0 && (
            <div className="container mb-8">
              <PageRange
                collection="puppies"
                currentPage={puppies.page}
                limit={12}
                totalDocs={puppies.totalDocs}
              />
            </div>
          )}

          {/* Puppies Archive */}
          {puppies.totalDocs > 0 ? (
            <>
              <PuppiesArchive puppies={puppies.docs} />

              {/* Pagination */}
              <div className="container mt-8">
                {puppies.totalPages > 1 && puppies.page && (
                  <Pagination page={puppies.page} totalPages={puppies.totalPages} />
                )}
              </div>
            </>
          ) : (
            <div className="container">
              <div className="text-center py-16">
                <Dog className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">
                  No hay cachorros disponibles actualmente
                </h2>
                <p className="text-muted-foreground mb-6">
                  En este momento no tenemos cachorros de {breedData.name} disponibles. Por favor,
                  vuelve a visitarnos pronto o contáctanos para más información.
                </p>
                <a
                  href={`/${slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Volver a {breedData.name}
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error fetching puppies by breed:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  try {
    const { slug } = await params
    const breed = await queryBreedBySlug({ slug })

    if (!breed) {
      return {
        title: 'Cachorros no encontrados',
        description: 'La raza que buscas no existe',
      }
    }

    const breedData = breed as any

    return {
      title: `Cachorros de ${breedData.name} en Venta - Criadero Goizametz`,
      description: `Descubre nuestros cachorros de ${breedData.name} disponibles. Pedigrí completo, vacunas al día y garantía de salud. Criadero profesional en La Rioja.`,
      openGraph: {
        title: `Cachorros de ${breedData.name} en Venta - Criadero Goizametz`,
        description: `Descubre nuestros cachorros de ${breedData.name} disponibles. Pedigrí completo, vacunas al día y garantía de salud.`,
        images: breedData.mainImage?.url ? [{ url: breedData.mainImage.url }] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for puppies by breed:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información',
    }
  }
}

// Generar rutas estáticas para todas las razas
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

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

  return breeds.docs.map((breed) => ({
    slug: breed.slug,
  }))
}
