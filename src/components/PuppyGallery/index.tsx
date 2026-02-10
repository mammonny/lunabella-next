'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Media } from '@/components/Media'
import { ImageLightbox } from '@/components/ImageLightbox'

interface PuppyGalleryProps {
  mainImage: any
  gallery: any[]
  puppyName?: string
}

export function PuppyGallery({
  mainImage,
  gallery = [],
  puppyName = 'Cachorro',
}: PuppyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [initialImageIndex, setInitialImageIndex] = useState(0)

  // Función para extraer texto de un posible objeto rich text
  const extractRichText = (richText: any): string | undefined => {
    if (!richText) return undefined

    // Si es un string, devolverlo directamente
    if (typeof richText === 'string') return richText

    // Si es un objeto con estructura de rich text
    if (typeof richText === 'object') {
      // Si tiene una propiedad 'root' (formato típico de rich text)
      if (richText.root) {
        // Intentar extraer el texto del primer nodo de texto
        try {
          const firstParagraph = richText.root.children?.[0]
          if (firstParagraph && firstParagraph.children) {
            const firstTextNode = firstParagraph.children[0]
            if (firstTextNode && firstTextNode.text) {
              return firstTextNode.text
            }
          }
        } catch (e) {
          console.error('Error extracting text from rich text:', e)
        }
      }

      // Si tiene una propiedad 'children' directamente
      if (richText.children && Array.isArray(richText.children)) {
        try {
          const texts = richText.children
            .filter((child: any) => child.type === 'text' && child.text)
            .map((child: any) => child.text)

          if (texts.length > 0) {
            return texts.join(' ')
          }
        } catch (e) {
          console.error('Error extracting text from children:', e)
        }
      }
    }

    return undefined
  }

  // Preparar las imágenes para el lightbox (incluir la imagen principal y la galería)
  const allImages = [
    {
      image: mainImage,
      alt: `Imagen principal de ${puppyName}`,
      galleryCaption: `Galería de ${puppyName}`, // Caption para el título del diálogo
      imageCaption: extractRichText(mainImage?.caption), // Extraer el caption de la imagen principal
    },
    ...(gallery?.map((item: any, index: number) => {
      // El caption a nivel de galería es un string, lo usamos directamente
      const galleryCaption = item.caption

      // El caption a nivel de imagen es un objeto rich text, necesitamos extraer el texto
      const imageCaption = extractRichText(item.image?.caption)

      return {
        image: item.image,
        alt: `Imagen ${index + 1} de ${puppyName}`,
        galleryCaption: galleryCaption, // Caption para el título del diálogo
        imageCaption: imageCaption, // Caption para la leyenda de la imagen
      }
    }) || []),
  ]

  return (
    <div className="w-full">
      {/* Imagen Principal */}
      <div
        className="relative aspect-square mb-4 bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => {
          setInitialImageIndex(0)
          setLightboxOpen(true)
        }}
      >
        {mainImage ? (
          <Media resource={mainImage} fill size="square" className="object-contain" priority />
        ) : (
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt={puppyName}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Galería de Miniaturas (solo si hay imágenes en la galería) */}
      {gallery && gallery.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {gallery.slice(0, 4).map((item: any, index: number) => (
            <div
              key={index}
              className="relative aspect-square bg-muted overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setInitialImageIndex(index + 1) // +1 porque la imagen principal es la primera
                setLightboxOpen(true)
              }}
            >
              <Media resource={item.image} fill size="square" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        initialIndex={initialImageIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        title={`Galería de ${puppyName}`} // Título personalizado para el lightbox
      />
    </div>
  )
}
