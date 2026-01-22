import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  Home,
  Dog,
  Info,
  CalendarDays,
  Syringe,
  ShieldCheck,
  Award,
  ScrollText,
  ThumbsUp,
  PhoneForwarded,
} from 'lucide-react'

import { Media as MediaComponent } from '@/components/Media'
import type { Media } from '@/payload-types'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { PuppyGallery } from '@/components/PuppyGallery'
import { PuppyParentsTab } from '@/components/PuppyParentsTab'
import RichText from '@/components/RichText'
import { ExpandableDescription } from '@/components/ExpandableDescription'
import { ShareButton } from '@/components/ShareButton'
import { LikeButton } from '@/components/LikeButton'
import { OtherAvailablePuppiesCarousel } from '@/components/OtherAvailablePuppiesCarousel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PuppyTabs } from '@/components/PuppyTabs'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection'
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
      likes,
    } = puppy

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
              {
                'litter.id': {
                  equals: litterId,
                },
              },
              {
                id: {
                  not_equals: puppy.id,
                },
              },
            ],
          },
        })

        const siblings = siblingsResult.docs.map(
          (sibling): LitterMate => ({
            id: sibling.id,
            image: sibling.mainImage as Media | null,
            slug: sibling.slug as string,
            name: sibling.name,
          }),
        )

        const currentPuppyMate: LitterMate = {
          id: puppy.id,
          image: puppy.mainImage as Media | null,
          slug: puppy.slug as string,
          name: puppy.name,
        }

        litterMates = [currentPuppyMate, ...siblings]
      } catch (fetchError) {
        console.error('Error fetching siblings:', fetchError)
      }
    }

    const statusText =
      disponibilidad === 'available'
        ? 'Disponible'
        : disponibilidad === 'reserved'
          ? 'Reservado'
          : disponibilidad === 'sold'
            ? 'Vendido'
            : ''

    const statusBgColor =
      disponibilidad === 'available'
        ? 'bg-lunabella-gold text-lunabella-cream'
        : disponibilidad === 'reserved'
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          : disponibilidad === 'sold'
            ? 'bg-red-100 text-red-800 hover:bg-red-200'
            : ''

    const formattedBirthDate = birthDate
      ? new Date(birthDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'No disponible'

    const calculateAgeInWeeks = () => {
      if (!birthDate) return 'No disponible'

      const birthDateObj = new Date(birthDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

      return `${diffWeeks} semanas`
    }

    const ageInWeeks = calculateAgeInWeeks()

    const puppyId = `GR-${new Date(birthDate || '').getFullYear() || 'YYYY'}-${String(puppy.id).padStart(2, '0') || '00'}`

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
              label: 'Cachorros',
              href: '/cachorros',
              icon: <Dog className="h-4 w-4" />,
            },
            {
              label: name || 'Cachorro',
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
          {/* Imagenes del Cachorro */}
          <div className="w-full lg:w-1/2">
            <PuppyGallery
              mainImage={mainImage as Media}
              gallery={gallery || []}
              puppyName={name || 'Cachorro'}
            />
          </div>
          {/* Informacion del Cachorro */}
          <div className="w-full lg:w-1/2">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`mb-2 ${statusBgColor}`}>{statusText}</Badge>
                <h1 className="text-3xl font-bold mb-2">{name || 'Cachorro'} {(breed as any)?.name || 'Golden Retriever'}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <span>Nacido: {formattedBirthDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <LikeButton puppyId={puppy.id} initialLikes={likes || 0} />
                <ShareButton
                  title={`Mira este cachorro: ${name || 'Cachorro'}`}
                  text={`Echa un vistazo a este Golden Retriever llamado ${name || 'Cachorro'} en LunaBella!`}
                />
              </div>
            </div>
            <div className="text-3xl font-bold mb-6">
              {price?.toLocaleString('es-ES') || 'Consultar'} EUR
            </div>
            {/* Renderizar el nuevo componente PuppyTabs */}
            <PuppyTabs puppyData={puppy} litterMates={litterMates} ageInWeeks={ageInWeeks} />
            <div className="space-y-4">
              <Button className="w-full inline-flex items-center justify-center gap-2 bg-lunabella-dark text-lunabella-cream hover:bg-lunabella-dark/90 font-semibold">
                <Info className="h-4 w-4" />
                Solicitar informacion
              </Button>
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center gap-2 border-lunabella-gold text-lunabella-gold hover:bg-lunabella-gold hover:text-lunabella-cream font-semibold"
              >
                <PhoneForwarded className="h-4 w-4" />
                Contactar
              </Button>
              <p className="text-sm text-muted-foreground">
                Incluye: kit de iniciacion, primeras vacunas, microchip, y asesoramiento continuo.
              </p>
            </div>
          </div>
        </div>
        {/* Seccion de Descripcion */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Descripcion</h2>
          <div className="prose max-w-none text-muted-foreground">
            {description ? (
              <ExpandableDescription data={description} />
            ) : (
              <>
                <p>
                  Este hermoso cachorro Golden Retriever proviene de una camada de cachorros nacidos
                  el {formattedBirthDate}. Ha sido criado en un ambiente familiar, con mucho amor y
                  cuidados profesionales desde su nacimiento.
                </p>
                <p className="mt-4">
                  Los Golden Retriever son conocidos por su inteligencia, lealtad y temperamento
                  equilibrado, lo que los convierte en excelentes mascotas familiares. Son perros
                  activos que disfrutan de actividades al aire libre, juegos y especialmente de la
                  compania humana.
                </p>
                <p className="mt-4">
                  Nuestros cachorros crecen en un entorno estimulante, con socializacion temprana
                  para garantizar un desarrollo emocional saludable. Estan acostumbrados a ninos,
                  otros perros y diferentes entornos.
                </p>
              </>
            )}
          </div>
        </div>
        {/* Otros cachorros disponibles */}
        {puppy?.id && <OtherAvailablePuppiesCarousel currentPuppyId={puppy.id} />}
        {/* Seccion Por que elegirnos */}
        <WhyChooseUsSection />
        {/* Seccion de Opiniones */}
        <TestimonialsSection viewAllLink="/opiniones" />
        {/* CTA final */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Listo para conocer a tu nuevo mejor amigo?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contactanos hoy mismo para agendar una visita y conocer a nuestros cachorros en persona.
            Estaremos encantados de asesorarte en la eleccion de tu nuevo companero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 bg-lunabella-dark text-lunabella-cream hover:bg-lunabella-dark/90">
              Contactar ahora
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-lunabella-gold text-lunabella-gold hover:bg-lunabella-gold hover:text-lunabella-cream">
              Ver mas cachorros
            </Button>
          </div>
        </div>
      </div>
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
      title: `${puppyData.name || 'Cachorro'} ${breedName} - LunaBella`,
      description: `Conoce a ${puppyData.name || 'nuestro cachorro'} ${breedName}, ${puppyData.gender === 'male' ? 'un macho' : 'una hembra'} disponible.`,
    }
  } catch (error) {
    console.error('Error generating metadata for puppy:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la informacion del cachorro',
    }
  }
}
