import { cn } from '@/utilities/ui'
import React from 'react'

import { PuppyCard } from '@/components/PuppyCard' // Importar la tarjeta original
// import { PuppyCardShadcn, CardPuppyData } from '@/components/Card/PuppyCardShadcn' // Ya no usamos esta

export type Props = {
  puppies: any[] // Usar 'any' temporalmente o importar el tipo correcto si PuppyCard lo exporta
}

export const PuppiesArchive: React.FC<Props> = (props) => {
  const { puppies } = props

  return (
    <div className={cn('container')}>
      <div>
        {/* Ajuste de grid para tarjetas más pequeñas en pantallas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {' '}
          {/* Simplificado y ajustado para 4 columnas en lg */}
          {puppies?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                // El div contenedor ya no es necesario si el grid está en el padre directo
                <PuppyCard key={index} puppy={result} className="h-full" />
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
