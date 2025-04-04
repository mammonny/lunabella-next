import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Home } from 'lucide-react' // Iconos movidos a WhyChooseUsSection

import { Media } from '@/components/Media'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { PuppyGallery } from '@/components/PuppyGallery'
import { PuppyParentsTab } from '@/components/PuppyParentsTab'
import RichText from '@/components/RichText'
import { ShareButton } from '@/components/ShareButton'
import { LikeButton } from '@/components/LikeButton'
import { OtherAvailablePuppiesCarousel } from '@/components/OtherAvailablePuppiesCarousel' // Importar el carrusel
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card' // CardContent no se usa aquí, pero lo dejo por si acaso
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
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

    // Función para generar datos de camada de ejemplo si no existen
    const generatePlaceholderLitter = (currentPuppyId: string | number, galleryImages?: any[]) => {
      // Usar imágenes de la galería si están disponibles, o crear placeholders
      const images =
        galleryImages && galleryImages.length > 0
          ? galleryImages.slice(0, 6).map((item) => item.image)
          : Array(6).fill(null)

      return Array.from({ length: 6 }).map((_, i) => ({
        id: i === 0 ? currentPuppyId : `placeholder-${i}`,
        image: images[i] || null,
        isCurrentPuppy: i === 0,
      }))
    }

    return (
      <div className="container mx-auto py-8">
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
            },
            {
              label: name || 'Cachorro',
            },
          ]}
        />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imágenes del Cachorro */}
          <div className="w-full lg:w-3/5">
            <PuppyGallery
              mainImage={mainImage}
              gallery={gallery || []}
              puppyName={name || 'Cachorro'}
            />
          </div>

          {/* Información del Cachorro */}
          <div className="w-full lg:w-2/5">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`mb-2 ${statusBgColor}`}>{statusText}</Badge>
                <h1 className="text-3xl font-bold mb-2">
                  {name || 'Cachorro'} {breed?.name || ''}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <span>ID: {puppyId}</span>
                  <span>•</span>
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

            <Tabs defaultValue="detalles" className="mb-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="detalles">Detalles</TabsTrigger>
                <TabsTrigger value="salud">Salud</TabsTrigger>
                <TabsTrigger value="padres">Padres</TabsTrigger>
              </TabsList>
              <TabsContent value="detalles" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground">Raza</h3>
                    <p>{breed?.name || 'No disponible'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Sexo</h3>
                    <p>{gender === 'male' ? 'Macho' : 'Hembra'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Edad</h3>
                    <p>{ageInWeeks}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Color</h3>
                    <p>{color || 'No disponible'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Peso actual</h3>
                    <p>{weight ? `${weight} kg` : 'No disponible'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">Tamaño adulto est.</h3>
                    <p>25-30 kg</p> {/* Esto debería ser dinámico probablemente */}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Temperamento</h3>
                  <p>
                    Juguetón, sociable, cariñoso y muy inteligente. Excelente con niños y otros
                    animales. {/* Esto también debería ser dinámico */}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="salud">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Vacunas</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Primera vacuna polivalente (6 semanas)</li>
                      <li>Segunda vacuna polivalente (8 semanas)</li>
                      <li>Desparasitación completa</li>
                      {/* Esto también debería ser dinámico */}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Certificados</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Certificado veterinario de salud</li>
                      <li>Microchip</li>
                      <li>Pedigree oficial</li>
                      {/* Esto también debería ser dinámico */}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Garantías</h3>
                    <p>
                      Ofrecemos garantía de salud por 2 años contra enfermedades genéticas
                      hereditarias. {/* Esto también debería ser dinámico */}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="padres">
                <div className="space-y-4">
                  <PuppyParentsTab
                    parents={parents}
                    puppyName={name}
                    coupleStory={
                      puppy.coupleStory ||
                      'Esta unión cuidadosamente seleccionada combina las mejores características de ambos padres: la inteligencia y nobleza del padre con la dulzura y belleza de la madre. El resultado es una camada excepcional de cachorros con excelente genética y temperamento.'
                    }
                    litterPuppies={
                      puppy.litterPuppies || generatePlaceholderLitter(puppy.id, gallery)
                    }
                    currentPuppyId={puppy.id}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <Button className="w-full">Solicitar información</Button>
              <Button variant="outline" className="w-full">
                Agendar visita
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Incluye: kit de iniciación, primeras vacunas, microchip, y asesoramiento continuo{' '}
                {/* Esto también debería ser dinámico */}
              </p>
            </div>
          </div>
        </div>
        {/* Sección de Descripción */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Descripción</h2>
          <div className="prose max-w-none">
            {description ? (
              <RichText data={description} enableGutter={false} />
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
