import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Ejemplare } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { PuppyCard } from '@/components/PuppyCard'

interface OtherDogsCarouselProps {
  currentDogId: string
  limit?: number
  title?: string
  showTitle?: boolean
}

export const OtherDogsCarousel: React.FC<OtherDogsCarouselProps> = async ({
  currentDogId,
  limit = 8,
  title = 'Otros ejemplares',
  showTitle = true,
}) => {
  const payload = await getPayload({ config: configPromise })
  let otherDogs: Ejemplare[] = []

  try {
    const result = await payload.find({
      collection: 'ejemplares',
      where: {
        and: [
          {
            breedingStatus: {
              equals: 'active',
            },
          },
          {
            id: {
              not_equals: currentDogId,
            },
          },
        ],
      },
      limit: limit,
      depth: 1,
      sort: '-birthDate',
    })
    otherDogs = Array.isArray(result.docs) ? (result.docs as Ejemplare[]) : []
  } catch (error) {
    console.error('Error fetching other dogs:', error)
    return (
      <div className="mt-16 text-center text-muted-foreground">
        No se pudieron cargar otros ejemplares.
      </div>
    )
  }

  if (otherDogs.length === 0) {
    return (
      <div className="mt-16 text-center text-muted-foreground">
        No hay otros ejemplares disponibles en este momento.
      </div>
    )
  }

  const sectionTitle = otherDogs.length === 1 ? 'Otro ejemplar' : title

  return (
    <div className={showTitle ? "mt-16" : ""}>
      {showTitle && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        </div>
      )}

      {otherDogs.length === 1 && (
        <div className="max-w-xs sm:max-w-none sm:w-1/2 md:w-1/3 lg:w-1/4">
          <PuppyCard puppy={otherDogs[0] as any} collectionType="ejemplares" />
        </div>
      )}

      {otherDogs.length > 1 && (
        <Carousel
          opts={{
            align: 'start',
            loop: otherDogs.length > 4,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl relative"
        >
          <CarouselContent className="-ml-4">
            {otherDogs.map((dog) => (
              <CarouselItem key={dog.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  <PuppyCard puppy={dog as any} collectionType="ejemplares" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {otherDogs.length > 1 && (
            <div className="absolute -top-12 right-0 flex gap-3">
              <CarouselPrevious
                className="hidden sm:inline-flex !relative !top-auto !left-auto !right-auto !h-10 !w-10 !rounded-none !border-[#a58a1b]/30 !bg-transparent hover:!bg-[#a58a1b]/5 hover:!border-[#a58a1b] !text-[#a58a1b] transition-all duration-300"
              />
              <CarouselNext
                className="hidden sm:inline-flex !relative !top-auto !left-auto !right-auto !h-10 !w-10 !rounded-none !border-[#a58a1b]/30 !bg-transparent hover:!bg-[#a58a1b]/5 hover:!border-[#a58a1b] !text-[#a58a1b] transition-all duration-300"
              />
            </div>
          )}
        </Carousel>
      )}
    </div>
  )
}
