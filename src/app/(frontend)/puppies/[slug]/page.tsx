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
} from 'lucide-react' // Iconos para Salud

import { Media as MediaComponent } from '@/components/Media' // Renombrar import del componente
import type { Media } from '@/payload-types' // Importar tipo Media
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { PuppyGallery } from '@/components/PuppyGallery'
import { PuppyParentsTab } from '@/components/PuppyParentsTab'
import RichText from '@/components/RichText' // Mantenido por si se usa en otro sitio, pero la descripción usará ExpandableDescription
import { ExpandableDescription } from '@/components/ExpandableDescription' // Importar nuevo componente
import { ShareButton } from '@/components/ShareButton'
import { LikeButton } from '@/components/LikeButton'
import { OtherAvailablePuppiesCarousel } from '@/components/OtherAvailablePuppiesCarousel' // Importar el carrusel
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card' // CardContent no se usa aquí, pero lo dejo por si acaso
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' // Ya no se usa aquí
import { PuppyTabs } from '@/components/PuppyTabs' // Importar el nuevo componente
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection' // Importar el nuevo componente
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

// Definir el tipo para los parámetros de la página
// En Next.js 15, params debe ser una promesa o undefined
type Args = {
  params: Promise<{ slug: string }> | undefined
}

// Función para obtener datos del cachorro por slug
const queryPuppyBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    // @ts-ignore - 'puppies' will be added to CollectionSlug after server restart
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
  // Si params es undefined, redirigir a 404
  if (!params) {
    return notFound()
  }

  // Obtener el slug de forma asíncrona
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
      likes, // Añadir likes a la desestructuración
    } = puppy

    // --- Inicio: Obtener hermanos de camada ---
    // Definir tipo explícito para litterMates
    type LitterMate = {
      id: string | number
      image: Media | null
      slug: string
      name?: string | null
    } // Añadir name al tipo
    let litterMates: LitterMate[] = [] // Inicializar con tipo explícito
    // @ts-ignore - Acceder a litter, asumiendo que puede existir después de la regeneración de tipos y que depth: 2 lo pobló
    const litterId = puppy.litter?.id

    if (litterId) {
      try {
        const siblingsResult = await payload.find({
          collection: 'puppies',
          depth: 1, // Asegurarse que depth 1 incluye slug y mainImage poblada
          pagination: false,
          where: {
            and: [
              {
                // @ts-ignore - Asumiendo que 'litter.id' es la forma correcta de consultar por ID de relación
                'litter.id': {
                  equals: litterId,
                },
              },
              {
                id: {
                  not_equals: puppy.id, // Excluir al cachorro actual
                },
              },
            ],
          },
          // overrideAccess: false, // Mantener el control de acceso por defecto
        })

        // Mapear para que coincida con la estructura esperada por PuppyParentsTab { id, image }
        // Mapear asegurando que image sea Media o null
        // Mapear los hermanos
        const siblings = siblingsResult.docs.map(
          (sibling): LitterMate => ({
            id: sibling.id,
            image: sibling.mainImage as Media | null,
            slug: sibling.slug as string,
            name: sibling.name, // Incluir el nombre del hermano
          }),
        )

        // Crear objeto para el cachorro actual
        const currentPuppyMate: LitterMate = {
          id: puppy.id,
          image: puppy.mainImage as Media | null,
          slug: puppy.slug as string,
          name: puppy.name, // Incluir el nombre del cachorro actual
        }

        // Añadir el cachorro actual al principio del array
        litterMates = [currentPuppyMate, ...siblings]
      } catch (fetchError) {
        console.error('Error fetching siblings:', fetchError)
        // Mantener litterMates como array vacío en caso de error
      }
    }
    // --- Fin: Obtener hermanos de camada ---

    // Función para extraer texto seguro de posibles objetos complejos
    const getSafeText = (value: any, defaultText: string): string => {
      if (typeof value === 'string') return value
      if (value && typeof value === 'object' && 'root' in value) {
        // Si es un objeto con estructura de rich text, devolver texto por defecto
        return defaultText
      }
      return defaultText
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
        ? 'bg-primary text-white'
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

    // Calcular la edad en semanas
    const calculateAgeInWeeks = () => {
      if (!birthDate) return 'No disponible'

      const birthDateObj = new Date(birthDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

      return `${diffWeeks} semanas`
    }

    const ageInWeeks = calculateAgeInWeeks()

    // Generar un ID único para el cachorro
    const puppyId = `${breed?.name?.substring(0, 2).toUpperCase() || 'XX'}-${new Date(birthDate || '').getFullYear() || 'YYYY'}-${String(puppy.id).padStart(2, '0') || '00'}`

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
              href: '/puppies',
              icon: <Dog className="h-4 w-4" />, // Añadir icono Dog
            },
            {
              label: name || 'Cachorro',
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
          {' '}
          {/* Aumentado gap a 24 */} {/* Aumentado gap aún más (a 16) */}{' '}
          {/* Aumentado gap en pantallas grandes */}
          {/* Imágenes del Cachorro */}
          <div className="w-full lg:w-1/2">
            {' '}
            {/* Reducido de 3/5 a 1/2 */}
            <PuppyGallery
              mainImage={mainImage as Media} // Asegurar tipo para el componente MediaComponent
              gallery={gallery || []}
              puppyName={name || 'Cachorro'}
            />
          </div>
          {/* Información del Cachorro */}
          <div className="w-full lg:w-1/2">
            {' '}
            {/* Ajustado de 2/5 a 1/2 */}
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`mb-2 ${statusBgColor}`}>{statusText}</Badge>
                <h1 className="text-3xl font-bold mb-2">
                  {name || 'Cachorro'} {breed?.name || ''}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  {/*  <span>ID: {puppyId}</span>
                  <span>•</span> */}
                  <span>Nacido: {formattedBirthDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <LikeButton puppyId={puppy.id} initialLikes={likes || 0} />
                <ShareButton
                  title={`Mira este cachorro: ${name || 'Cachorro'}`}
                  text={`¡Echa un vistazo a este ${breed?.name || 'cachorro'} llamado ${name || 'Cachorro'} en Criadero Goizametz!`}
                />
              </div>
            </div>
            <div className="text-3xl font-bold mb-6">
              {price?.toLocaleString('es-ES') || 'Consultar'} €
            </div>
            {/* Renderizar el nuevo componente PuppyTabs */}
            <PuppyTabs
              puppyData={puppy} // Pasar el objeto puppy completo
              litterMates={litterMates}
              ageInWeeks={ageInWeeks}
              // Pasar cualquier otra prop necesaria para las pestañas
            />
            <div className="space-y-4">
              <Button className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold">
                {' '}
                {/* Añadido flex y gap */}
                <Info className="h-4 w-4" /> {/* Icono Info */}
                Solicitar información
              </Button>
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center gap-2 font-semibold"
              >
                {' '}
                {/* Añadido flex y gap */}
                <PhoneForwarded className="h-4 w-4" /> {/* Icono CalendarDays */}
                Contactar
              </Button>
              <p className="text-sm text-muted-foreground">
                Incluye: kit de iniciación, primeras vacunas, microchip, y asesoramiento continuo.
                {/* Esto también debería ser dinámico */}
              </p>
            </div>
          </div>
        </div>
        {/* Sección de Descripción */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Descripción</h2>
          <div className="prose max-w-none text-muted-foreground">
            {/* Usar ExpandableDescription en lugar de RichText directamente */}
            {description ? (
              <ExpandableDescription data={description} />
            ) : (
              <>
                <p>
                  Este hermoso cachorro de {breed?.name || 'raza pura'} proviene de una camada de
                  cachorros nacidos el {formattedBirthDate}. Ha sido criado en un ambiente familiar,
                  con mucho amor y cuidados profesionales desde su nacimiento.
                </p>
                <p className="mt-4">
                  Los {breed?.name || 'perros de esta raza'} son conocidos por su inteligencia,
                  lealtad y temperamento equilibrado, lo que los convierte en excelentes mascotas
                  familiares. Son perros activos que disfrutan de actividades al aire libre, juegos
                  y especialmente de la compañía humana.
                </p>
                <p className="mt-4">
                  Nuestros cachorros crecen en un entorno estimulante, con socialización temprana
                  para garantizar un desarrollo emocional saludable. Están acostumbrados a niños,
                  otros perros y diferentes entornos.
                </p>
              </>
            )}
          </div>
        </div>
        {/* Otros cachorros disponibles - Ahora usa el componente Carrusel */}
        {puppy?.id && <OtherAvailablePuppiesCarousel currentPuppyId={puppy.id} />}
        {/* Sección Por qué elegirnos (Componente Reutilizable) */}
        <WhyChooseUsSection />
        {/* Sección de Opiniones (Componente Reutilizable) */}
        <TestimonialsSection viewAllLink="/opiniones" />{' '}
        {/* Puedes ajustar el enlace si tienes una página dedicada */}
        {/* CTA final */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para conocer a tu nuevo mejor amigo?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contáctanos hoy mismo para agendar una visita y conocer a nuestros cachorros en persona.
            Estaremos encantados de asesorarte en la elección de tu nuevo compañero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Contactar ahora
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Ver más cachorros
            </Button>
          </div>
        </div>
      </div> // Cierre del div.container principal
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

    // Tratar puppy como any para evitar errores de TypeScript si la definición no es completa/correcta
    const puppyData = puppy as any

    return {
      title: `${puppyData.name || 'Cachorro'} ${puppyData.breed?.name || ''} - Criadero Goizametz`,
      description: `Conoce a ${puppyData.name || 'nuestro cachorro'} de ${
        puppyData.breed?.name || 'raza pura'
      }, ${puppyData.gender === 'male' ? 'un macho' : 'una hembra'} disponible para adopción.`,
      // Podrías añadir openGraph images aquí usando mainImage.url si existe
    }
  } catch (error) {
    console.error('Error generating metadata for puppy:', error) // Mensaje de error más específico
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información del cachorro',
    }
  }
}
