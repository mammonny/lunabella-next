import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import { Media } from '@/components/Media'

export const DogHero: React.FC<{
  dog: any
}> = ({ dog }) => {
  const { name, breed, mainImage, gender, birthDate, color } = dog

  // Determinar el texto del género
  const genderText = gender === 'male' ? 'Macho' : gender === 'female' ? 'Hembra' : ''

  // Obtener el nombre de la raza
  const breedName =
    typeof breed === 'object' && breed !== null ? breed.name : 'Raza no especificada'

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">{breedName}</div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{name}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {genderText && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Género</p>
                <p>{genderText}</p>
              </div>
            )}
            {birthDate && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Fecha de Nacimiento</p>
                <time dateTime={birthDate}>{formatDateTime(birthDate)}</time>
              </div>
            )}
            {color && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Color</p>
                <p>{color}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {mainImage && typeof mainImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={mainImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
