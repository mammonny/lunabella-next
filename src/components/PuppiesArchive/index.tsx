import { cn } from '@/utilities/ui'
import React from 'react'

import { PuppyCardShadcn, CardPuppyData } from '@/components/Card/PuppyCardShadcn'

export type Props = {
  puppies: CardPuppyData[]
}

export const PuppiesArchive: React.FC<Props> = (props) => {
  const { puppies } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {puppies?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
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
