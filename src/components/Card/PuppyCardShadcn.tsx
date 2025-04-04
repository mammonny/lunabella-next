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
        'overflow-hidden hover:shadow-lg transition-shadow hover:cursor-pointer',
        className,
      )}
      // @ts-ignore - Ignoramos el error de tipo ya que sabemos que es compatible
      ref={card.ref}
    >
      <div className="relative h-48 w-full">
        {!mainImage && (
          <div className="h-48 bg-gray-800 dark:bg-gray-800 flex items-center justify-center">
            No image
          </div>
        )}
        {mainImage && typeof mainImage !== 'string' && (
          <div className="relative w-full h-full overflow-hidden">
            <Media resource={mainImage} size="thumbnail" className="h-full w-full object-fill" />
            <div className="absolute top-2 right-2">
              {genderText && (
                <Badge
                  variant="secondary"
                  className={
                    gender === 'male'
                      ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                      : 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700'
                  }
                >
                  {genderText}
                </Badge>
              )}
            </div>
            {statusText && (
              <Badge
                variant="secondary"
                className={`absolute top-2 left-2 ${statusColor} hover:${statusColor}`}
              >
                {statusText}
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          <Link href={href} ref={link.ref as any}>
            {name}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2">
        {showBreed && breedName && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Raza:</span> {breedName}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-lg font-bold text-primary">{price.toLocaleString('es-ES')} €</p>
      </CardFooter>
    </Card>
  )
}
