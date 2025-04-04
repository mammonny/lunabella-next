'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle, CardFooter, CardHeader } from '@/components/ui/card'

export type CardPuppyData = {
  id?: string | number | null
  slug?: string | null
  name?: string | null
  breed?: any
  gender?: 'male' | 'female' | null
  mainImage?: any
  price?: number | null
  disponibilidad?: 'available' | 'reserved' | 'sold' | null
}

export const PuppyCardShadcn: React.FC<{
  className?: string
  doc?: CardPuppyData
  relationTo?: 'puppies'
  showBreed?: boolean
}> = (props) => {
  const { card, link } = useClickableCard<HTMLDivElement>({})
  const { className, doc, relationTo, showBreed } = props

  // Extraemos los datos con valores por defecto para evitar problemas
  const slug = doc?.slug || ''
  const name = doc?.name || 'Sin nombre'
  const gender = doc?.gender
  const mainImage = doc?.mainImage
  const price = doc?.price || 0
  const disponibilidad = doc?.disponibilidad || 'available'

  // Aseguramos que siempre tengamos un nombre de raza
  const breedName =
    doc?.breed && typeof doc.breed === 'object' ? doc.breed?.name : 'Raza no especificada'
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''
  const href = `/${relationTo}/${slug}`

  // Texto y color según el estado
  const statusText =
    disponibilidad === 'available'
      ? 'Disponible'
      : disponibilidad === 'reserved'
        ? 'Reservado'
        : disponibilidad === 'sold'
          ? 'Vendido'
          : ''

  const statusColor =
    disponibilidad === 'available'
      ? 'bg-green-500'
      : disponibilidad === 'reserved'
        ? 'bg-yellow-500'
        : disponibilidad === 'sold'
          ? 'bg-red-500'
          : ''

  return (
    <Card
      className={cn(
        'overflow-hidden hover:shadow-lg transition-shadow hover:cursor-pointer flex flex-col h-full', // Añadido flex flex-col h-full
        className,
      )}
      // @ts-ignore - Ignoramos el error de tipo ya que sabemos que es compatible
      ref={card.ref}
    >
      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden">
        {' '}
        {/* Cambiado a aspect-square */}
        {!mainImage && (
          <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        {mainImage && typeof mainImage !== 'string' && (
          <Media
            resource={mainImage}
            size="card" // Usar un tamaño adecuado si está definido, si no, ajustar
            className="h-full w-full object-cover" // object-cover para llenar el aspect-square
            priority // Priorizar carga si es LCP
          />
        )}
      </div>

      {/* Contenido - Añadido flex-grow para empujar el footer hacia abajo */}
      <div className="flex flex-col flex-grow p-4 space-y-2">
        {' '}
        {/* Padding general y espacio */}
        {/* Badge de Disponibilidad */}
        {statusText && (
          <Badge
            variant="secondary"
            className={`w-fit ${statusColor} hover:${statusColor}`} // w-fit para ajustar al contenido
          >
            {statusText}
          </Badge>
        )}
        {/* Nombre (Enlace) */}
        <CardTitle className="text-lg font-semibold leading-tight">
          {' '}
          {/* Tamaño ajustado */}
          <Link
            href={href}
            ref={link.ref as any}
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          >
            {name}
          </Link>
        </CardTitle>
        {/* Raza y Género */}
        <div className="text-sm text-muted-foreground space-y-1">
          {showBreed && breedName && (
            <p>
              <span className="font-medium">Raza:</span> {breedName}
            </p>
          )}
          {genderText && (
            <p>
              <span className="font-medium">Sexo:</span> {genderText}
              {/* Opcional: Usar un badge pequeño para el género */}
              {/* <Badge variant={gender === 'male' ? 'default' : 'destructive'} className="ml-2 scale-90">{genderText}</Badge> */}
            </p>
          )}
        </div>
        {/* Empujador para el Footer */}
        <div className="flex-grow" />
        {/* Precio */}
        <div className="pt-2">
          {' '}
          {/* Espacio antes del precio */}
          <p className="text-xl font-bold text-primary">
            {price > 0 ? `${price.toLocaleString('es-ES')} €` : 'Consultar'}
          </p>
        </div>
      </div>
    </Card>
  )
}
