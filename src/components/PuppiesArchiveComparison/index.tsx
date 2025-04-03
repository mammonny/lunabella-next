import { cn } from '@/utilities/ui'
import React from 'react'

import { PuppyCard, CardPuppyData } from '@/components/Card/PuppyCard'
import { PuppyCardShadcn } from '@/components/Card/PuppyCardShadcn'

export type Props = {
  puppies: CardPuppyData[]
}

export const PuppiesArchiveComparison: React.FC<Props> = (props) => {
  const { puppies } = props

  return (
    <div className={cn('container')}>
      {/* Sección de tarjetas originales */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Tarjetas Originales</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {puppies?.slice(0, 3).map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={`original-${index}`}>
                  <PuppyCard className="h-full" doc={result} relationTo="puppies" showBreed />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Sección de tarjetas con shadcn/ui */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Tarjetas con shadcn/ui</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {puppies?.slice(0, 3).map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={`shadcn-${index}`}>
                  <PuppyCardShadcn className="h-full" doc={result} relationTo="puppies" showBreed />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
