import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Puppy } from '@/payload-types'
import { Button } from '@/components/ui/button' // Importar Button
import { ArrowLeft, ArrowRight } from 'lucide-react' // Importar iconos
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel' // Importar componentes del carrusel
import { PuppyCard } from '@/components/PuppyCard' // Volver a usar la tarjeta original
// import { PuppyCardShadcn, CardPuppyData } from '@/components/Card/PuppyCardShadcn' // Ya no usamos esta

interface OtherAvailablePuppiesCarouselProps {
  currentPuppyId: string
  limit?: number // Prop opcional para limitar resultados
  title?: string // Prop opcional para el título de la sección
}

export const OtherAvailablePuppiesCarousel: React.FC<OtherAvailablePuppiesCarouselProps> = async ({
  currentPuppyId,
  limit = 8, // Valor por defecto para el límite
  title = 'Otros cachorros disponibles', // Título por defecto
}) => {
  const payload = await getPayload({ config: configPromise })
  let otherPuppies: Puppy[] = []

  try {
    const result = await payload.find({
      collection: 'puppies',
      where: {
        and: [
          {
            disponibilidad: {
              equals: 'available',
            },
          },
          {
            id: {
              not_equals: currentPuppyId,
            },
          },
        ],
      },
      limit: limit,
      depth: 1, // Asegurar que se obtienen datos de relaciones como breed y mainImage
      sort: '-birthDate', // Mostrar los más recientes primero
    })
    // Asegurarse de que docs es un array antes de asignarlo
    otherPuppies = Array.isArray(result.docs) ? (result.docs as Puppy[]) : []
  } catch (error) {
    console.error('Error fetching other available puppies:', error)
    // Devolver null o un mensaje de error si falla la carga
    return (
      <div className="mt-16 text-center text-muted-foreground">
        No se pudieron cargar otros cachorros disponibles.
      </div>
    )
  }

  // Si no hay otros cachorros, mostrar un mensaje
  if (otherPuppies.length === 0) {
    return (
      <div className="mt-16 text-center text-muted-foreground">
        No hay otros cachorros disponibles en este momento.
      </div>
    )
  }

  // Ajustar título según el número de cachorros
  const sectionTitle = otherPuppies.length === 1 ? 'Otro cachorro disponible' : title

  // Renderizado condicional
  return (
    <div className="mt-16">
      {/* Contenedor para título y botones de navegación (si aplica) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        {/* Botones de navegación movidos dentro del Carousel si hay más de un cachorro */}
      </div>

      {/* Condición: Si solo hay un cachorro */}
      {otherPuppies.length === 1 && (
        <div className="max-w-xs sm:max-w-none sm:w-1/2 md:w-1/3 lg:w-1/4">
          {' '}
          {/* Ancho similar a item de carrusel, alineado a la izquierda */}
          <PuppyCard puppy={otherPuppies[0]} />
        </div>
      )}

      {/* Condición: Si hay más de un cachorro */}
      {otherPuppies.length > 1 && (
        <Carousel
          opts={{
            align: 'start',
            loop: otherPuppies.length > 4, // Activar loop si hay más de 4 (ajustar según diseño)
          }}
          // Ajustar max-width según el diseño deseado y número de items visibles
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl relative" // Removed mx-auto
        >
          <CarouselContent className="-ml-4">
            {otherPuppies.map((puppy) => (
              // Ajustar basis para controlar cuántos items se ven por slide
              <CarouselItem key={puppy.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  {' '}
                  {/* Mantener h-full si PuppyCard lo soporta */}
                  <PuppyCard puppy={puppy} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Botones de navegación (visibles solo si hay más de un cachorro) */}
          {otherPuppies.length > 1 && ( // Keep parenthesis
            // Restore wrapper div for positioning, override internal absolute positioning of buttons
            <div className="absolute -top-12 right-0 flex gap-2">
              <CarouselPrevious className="hidden sm:inline-flex !relative !top-auto !left-auto !right-auto" />
              <CarouselNext className="hidden sm:inline-flex !relative !top-auto !left-auto !right-auto" />
            </div>
          )}
        </Carousel>
      )}
    </div>
  )
}
