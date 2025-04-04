'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

type ImageType = {
  image: any
  alt?: string
  galleryCaption?: string // Caption para el título del diálogo
  imageCaption?: string // Caption para la leyenda de la imagen
  caption?: string // Mantener compatibilidad con implementación anterior
}

interface ImageLightboxProps {
  images: ImageType[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  title = 'Galería de imágenes',
}: ImageLightboxProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Actualizar el índice actual cuando cambia el carrusel
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (!images || images.length === 0) return null

  // Obtener la leyenda de la imagen actual para el título del diálogo
  const currentGalleryCaption =
    images[currentIndex]?.galleryCaption ||
    images[currentIndex]?.alt ||
    `Imagen ${currentIndex + 1} de ${images.length}`

  // Título dinámico para el diálogo (accesible pero no visible)
  const dialogTitle = `${title} - ${currentGalleryCaption}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg p-0 border-none bg-transparent">
        {/* Título accesible pero visualmente oculto */}
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>

        {/* Título visible para todos los usuarios - estilo más sutil */}
        <div className="text-center p-1.5 bg-background/20 backdrop-blur-sm rounded-md mx-6 mt-2 mb-1">
          <h2 className="text-base font-medium text-foreground/80">{title}</h2>
        </div>

        <Carousel
          setApi={setApi}
          className="w-full max-h-[80vh]"
          opts={{
            align: 'center',
            loop: true,
            startIndex: initialIndex,
            skipSnaps: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="flex flex-col items-center justify-center">
                {/* Contenedor de la imagen */}
                <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center p-6">
                  {image.image ? (
                    <Media
                      resource={image.image}
                      className="object-contain max-h-[65vh] w-auto"
                      alt={image.alt || `Imagen ${index + 1}`}
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt={image.alt || `Imagen ${index + 1}`}
                      width={600}
                      height={600}
                      className="object-contain max-h-[65vh]"
                    />
                  )}
                </div>

                {/* Leyenda de la imagen - solo se muestra si existe un imageCaption o caption específico */}
                {(image.imageCaption || image.caption) && (
                  <div className="text-center p-2 bg-background/80 backdrop-blur-sm rounded-md mx-6 mb-4">
                    <p className="text-sm text-foreground">{image.imageCaption || image.caption}</p>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 border-none h-10 w-10"
            aria-label="Imagen anterior"
          />
          <CarouselNext
            className="right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 border-none h-10 w-10"
            aria-label="Imagen siguiente"
          />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
