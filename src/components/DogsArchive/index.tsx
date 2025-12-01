import { cn } from '@/utilities/ui'
import React from 'react'

import { PuppyCard } from '@/components/PuppyCard'

export type Props = {
  dogs: any[]
}

export const DogsArchive: React.FC<Props> = (props) => {
  const { dogs } = props

  return (
    <div className={cn('container')}>
      <div>
        {/* Grid idéntico al de PuppiesArchive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {dogs?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <PuppyCard key={index} puppy={result} collectionType="dogs" className="h-full" />
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
