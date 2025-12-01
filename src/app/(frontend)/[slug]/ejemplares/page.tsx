import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { DogsArchive } from '@/components/DogsArchive'
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

export default async function DogsByBreedPage({ params }: Args) {
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

    // Obtener ejemplares filtrados por raza
    const dogs = await payload.find({
      collection: 'dogs',
      depth: 2,
      limit: 12,
      overrideAccess: false,
      where: {
        breed: {
          equals: breedData.id,
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
                  label: 'Ejemplares',
                },
              ]}
            />
          </div>

          {/* Header */}
          <div className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h1>Ejemplares de {breedData.name}</h1>
              <p>
                Conoce nuestros ejemplares reproductores de {breedData.name}. Cada ejemplar cuenta
                con pedigrí completo, certificaciones de salud y un temperamento excepcional.
              </p>
            </div>
          </div>

          {/* Page Range */}
          {dogs.totalDocs > 0 && (
            <div className="container mb-8">
              <PageRange
                collection="dogs"
                currentPage={dogs.page}
                limit={12}
                totalDocs={dogs.totalDocs}
              />
            </div>
          )}

          {/* Dogs Archive */}
          {dogs.totalDocs > 0 ? (
            <>
              <DogsArchive dogs={dogs.docs} />

              {/* Pagination */}
              <div className="container mt-8">
                {dogs.totalPages > 1 && dogs.page && (
                  <Pagination page={dogs.page} totalPages={dogs.totalPages} />
                )}
              </div>
            </>
          ) : (
            <div className="container">
              <div className="text-center py-16">
                <Dog className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">
                  No hay ejemplares disponibles actualmente
                </h2>
                <p className="text-muted-foreground mb-6">
                  En este momento no tenemos ejemplares de {breedData.name} en nuestro criadero. Por
                  favor, vuelve a visitarnos pronto o contáctanos para más información.
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
    console.error('Error fetching dogs by breed:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  try {
    const { slug } = await params
    const breed = await queryBreedBySlug({ slug })

    if (!breed) {
      return {
        title: 'Ejemplares no encontrados',
        description: 'La raza que buscas no existe',
      }
    }

    const breedData = breed as any

    return {
      title: `Ejemplares de ${breedData.name} - Criadero Goizametz`,
      description: `Conoce nuestros ejemplares reproductores de ${breedData.name}. Pedigrí completo, certificaciones de salud y temperamento excepcional. Criadero profesional en La Rioja.`,
      openGraph: {
        title: `Ejemplares de ${breedData.name} - Criadero Goizametz`,
        description: `Conoce nuestros ejemplares reproductores de ${breedData.name}. Pedigrí completo, certificaciones de salud y temperamento excepcional.`,
        images: breedData.mainImage?.url ? [{ url: breedData.mainImage.url }] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for dogs by breed:', error)
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
