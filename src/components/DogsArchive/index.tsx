import { cn } from '@/utilities/ui'
import React from 'react'

import { DogCard, CardDogData } from '@/components/Card/DogCard'

export type Props = {
  dogs: CardDogData[]
}

export const DogsArchive: React.FC<Props> = (props) => {
  const { dogs } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {dogs?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <DogCard className="h-full" doc={result} relationTo="dogs" showBreed />
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
