'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Media } from '@/components/Media'
import { X } from 'lucide-react'
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
      <DialogContent
        className="max-w-screen-lg p-0 border-none bg-transparent shadow-none"
        hideCloseButton
      >
        {/* Título accesible pero visualmente oculto */}
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>

        {/* Header: título visible + botón cerrar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-sm font-medium text-white/90 tracking-wide">
            {title}
            <span className="ml-2 text-white/50 text-xs font-normal">
              {currentIndex + 1} / {images.length}
            </span>
          </h2>
          <DialogClose className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40">
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
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
                  <div className="text-center px-6 pb-4">
                    <p className="text-sm text-white/80 bg-black/30 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full">
                      {image.imageCaption || image.caption}
                    </p>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-4 bg-black/60 hover:bg-black/80 border-none h-10 w-10 text-white"
            aria-label="Imagen anterior"
          />
          <CarouselNext
            className="right-4 bg-black/60 hover:bg-black/80 border-none h-10 w-10 text-white"
            aria-label="Imagen siguiente"
          />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}
