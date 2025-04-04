import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Puppy } from '@/payload-types' // Asegúrate de que este tipo incluya los campos necesarios
import { Media } from '@/components/Media' // Usar Media si es el componente preferido para imágenes de Payload

// --- Helper Functions ---

// Calcula la edad en semanas
const calculateAgeInWeeks = (birthDate: string | null | undefined): string => {
  if (!birthDate) return 'Edad desc.' // Retorna texto descriptivo si no hay fecha
  try {
    const birthDateObj = new Date(birthDate)
    const today = new Date()
    // Asegurarse de que la fecha es válida
    if (isNaN(birthDateObj.getTime())) return 'Fecha inv.'
    const diffTime = Math.abs(today.getTime() - birthDateObj.getTime())
    // Evitar división por cero o resultados extraños si las fechas son iguales
    if (diffTime < 1000 * 60 * 60 * 24) return 'Menos de 1 día'
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} sem.`
  } catch (error) {
    console.error('Error calculating age:', error)
    return 'Edad err.'
  }
}

// Devuelve el Badge de estado apropiado
const getStatusBadge = (disponibilidad: Puppy['disponibilidad']) => {
  switch (disponibilidad) {
    case 'available':
      return (
        <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-300 shadow-sm">
          Disponible
        </Badge>
      )
    case 'reserved':
      return (
        <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm">
          Reservado
        </Badge>
      )
    case 'sold':
      return (
        <Badge className="absolute top-2 right-2 bg-red-100 text-red-800 border-red-300 shadow-sm">
          Vendido
        </Badge>
      )
    default:
      // No mostrar nada si el estado no es uno de los esperados o es undefined
      return null
  }
}

// --- Component Props Interface ---

interface PuppyCardProps {
  puppy: Puppy | null | undefined // Permitir puppy nulo o indefinido
  className?: string
}

// --- PuppyCard Component ---

export const PuppyCard: React.FC<PuppyCardProps> = ({ puppy, className }) => {
  // Si no hay datos del cachorro, no renderizar nada o un placeholder
  if (!puppy) {
    // Opcionalmente, renderizar un esqueleto/placeholder aquí
    return null
  }

  const {
    id,
    slug,
    name = 'Cachorro sin nombre', // Valores por defecto
    breed,
    price,
    mainImage,
    disponibilidad,
    birthDate,
    gender,
  } = puppy

  // Extraer nombre de la raza (puede ser objeto relacionado o ID)
  const breedName =
    typeof breed === 'object' && breed !== null && 'name' in breed ? breed.name : 'Raza desc.'

  // Calcular edad y texto de género
  const age = calculateAgeInWeeks(birthDate)
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

  // Construir URL del enlace (usar slug si existe, si no, id)
  const puppyUrl = `/puppies/${slug || id}`

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {/* Enlace en la imagen */}
      <Link href={puppyUrl} className="block group relative aspect-square bg-muted overflow-hidden">
        {/* Usar Media si mainImage es un objeto completo, si no, Image */}
        {typeof mainImage === 'object' && mainImage !== null && 'url' in mainImage ? (
          <Media
            resource={mainImage}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
            imgClassName="object-cover w-full h-full"
          />
        ) : (
          <Image
            // Usar url si existe, si no, placeholder
            src={(typeof mainImage === 'object' && mainImage?.url) || '/placeholder.svg'}
            alt={(typeof mainImage === 'object' && mainImage?.alt) || `Imagen de ${name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Ajustar según el layout del carrusel/grid
          />
        )}
        {/* Badge de estado */}
        {getStatusBadge(disponibilidad)}
      </Link>

      {/* Contenido de la tarjeta */}
      <CardContent className="p-3 md:p-4 flex-grow flex flex-col justify-between">
        {/* Sección superior: Nombre y detalles */}
        <div>
          <h3
            className="font-semibold text-base md:text-lg mb-1 truncate"
            title={`${name} ${breedName}`}
          >
            <Link href={puppyUrl} className="hover:underline">
              {name} {breedName}
            </Link>
          </h3>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2 flex-wrap">
            {' '}
            {/* Usar flex para alinear Badge y edad */}
            {/* Mostrar género como Badge si está disponible */}
            {genderText && (
              <Badge
                variant="outline" // Usar outline o secondary para menos énfasis
                className={
                  gender === 'male'
                    ? 'border-blue-500 text-blue-700 dark:text-blue-400' // Colores para macho
                    : gender === 'female'
                      ? 'border-pink-500 text-pink-700 dark:text-pink-400' // Colores para hembra
                      : ''
                }
              >
                {genderText}
              </Badge>
            )}
            {/* Mostrar edad si está disponible y es válida */}
            {age !== 'Edad desc.' && age !== 'Fecha inv.' && age !== 'Edad err.' && (
              // Añadir separador solo si también hay género
              <>
                {genderText && <span className="text-muted-foreground/50">•</span>}
                <span>{age}</span>
              </>
            )}
          </div>
        </div>

        {/* Sección inferior: Precio y botón */}
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-base md:text-lg">
            {/* Mostrar precio formateado o 'Consultar' */}
            {typeof price === 'number' ? `${price.toLocaleString('es-ES')} €` : 'Consultar'}
          </span>
          {/* Botón como enlace */}
          <Button variant="ghost" size="sm" className="text-xs md:text-sm" asChild>
            <Link href={puppyUrl}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
