import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Heart, Share2, ArrowLeft, ArrowRight } from 'lucide-react'

import { Media } from '@/components/Media'
import { PuppyGallery } from '@/components/PuppyGallery'
import { PuppyParentsTab } from '@/components/PuppyParentsTab'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
      <div className="container mx-auto px-4 py-8">
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
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
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
                    <p>25-30 kg</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Temperamento</h3>
                  <p>
                    Juguetón, sociable, cariñoso y muy inteligente. Excelente con niños y otros
                    animales.
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
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Certificados</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Certificado veterinario de salud</li>
                      <li>Microchip</li>
                      <li>Pedigree oficial</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Garantías</h3>
                    <p>
                      Ofrecemos garantía de salud por 2 años contra enfermedades genéticas
                      hereditarias.
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
                Incluye: kit de iniciación, primeras vacunas, microchip, y asesoramiento continuo
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

        {/* Otros cachorros disponibles */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Otros cachorros disponibles</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={`/placeholder.svg?height=300&width=300`}
                    alt={`Cachorro ${i}`}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800">
                    Disponible
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">
                    Cachorro{' '}
                    {i === 1
                      ? 'Golden Retriever'
                      : i === 2
                        ? 'Labrador'
                        : i === 3
                          ? 'Pastor Alemán'
                          : 'Beagle'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {i === 1 ? 'Macho' : i === 2 ? 'Hembra' : i === 3 ? 'Macho' : 'Hembra'}, {6 + i}{' '}
                    semanas
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">€{900 + i * 100}</span>
                    <Button variant="ghost" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Por qué elegirnos */}
        <div className="mt-16 bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Crianza con amor</h3>
              <p className="text-sm text-muted-foreground">
                Nuestros cachorros crecen en un ambiente familiar con atención personalizada.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Salud garantizada</h3>
              <p className="text-sm text-muted-foreground">
                Control veterinario riguroso y garantía de salud por escrito.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Asesoramiento continuo</h3>
              <p className="text-sm text-muted-foreground">
                Soporte post-venta para ayudarte con la adaptación y cuidados de tu cachorro.
              </p>
            </div>
          </div>
        </div>

        {/* Opiniones */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Opiniones de familias adoptantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={`/placeholder.svg?height=50&width=50`}
                      alt={`Cliente ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {i === 1 ? 'Familia Rodríguez' : 'Familia Martínez'}
                    </h3>
                    <div className="flex text-amber-500 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <svg
                          key={j}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {i === 1
                        ? 'Nuestro Golden ha sido la mejor adición a nuestra familia. Llegó perfectamente socializado y saludable. El asesoramiento post-adopción ha sido excelente.'
                        : 'Estamos encantados con nuestro cachorro. Es exactamente como nos lo describieron: juguetón, cariñoso e inteligente. El proceso de adopción fue muy profesional.'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">Ver todas las opiniones</Button>
          </div>
        </div>

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

    // Tratar puppy como any para evitar errores de TypeScript
    const puppyData = puppy as any

    return {
      title: `${puppyData.name || 'Cachorro'} ${puppyData.breed?.name || ''} - Criadero Goizametz`,
      description: `Conoce a ${puppyData.name || 'nuestro cachorro'} de ${
        puppyData.breed?.name || 'raza pura'
      }, ${puppyData.gender === 'male' ? 'un macho' : 'una hembra'} disponible para adopción.`,
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información del cachorro',
    }
  }
}
