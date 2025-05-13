import Image from 'next/image'
import Link from 'next/link'
import { Media as MediaComponent } from '@/components/Media' // Renombrar import del componente
import type { Media } from '@/payload-types' // Importar tipo Media
import RichText from '@/components/RichText'

// Función para extraer texto seguro de posibles objetos complejos
const getSafeText = (value: any, defaultText: string): string => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'root' in value) {
    // Si es un objeto con estructura de rich text, devolver texto por defecto
    return defaultText
  }
  return defaultText
}

type ParentsTabProps = {
  parents: any
  puppyName: string
  coupleStory?: string | any
  litterPuppies?: Array<{
    id: string | number
    image: Media | null // Usar tipo Media importado
    slug: string
    name?: string | null // Añadir nombre
    isCurrentPuppy?: boolean
  }>
  currentPuppyId?: string | number
}

export const PuppyParentsTab = ({
  parents,
  puppyName,
  coupleStory,
  litterPuppies,
  currentPuppyId,
}: ParentsTabProps) => {
  if (!parents) {
    return (
      <div className="text-center py-4">
        <p>No hay información disponible sobre los padres de este cachorro.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">
        Conoce a los padres de {getSafeText(puppyName, 'este cachorro')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Padre */}
        {parents.father && parents.father.slug ? (
          <Link
            href={`/dogs/${parents.father.slug}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-3 text-center">Padre</h3>
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-3">
                {parents.father.mainImage && typeof parents.father.mainImage === 'object' ? (
                  <MediaComponent
                    resource={parents.father.mainImage}
                    size="thumbnail"
                    className="h-full w-full object-cover"
                    alt={`Padre de ${getSafeText(puppyName, 'cachorro')}`}
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Padre del cachorro"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">Información</h4>
                <p className="text-sm">
                  <strong>Nombre:</strong> {getSafeText(parents?.father?.name, 'No disponible')}
                </p>
                <p className="text-sm mt-1">
                  <strong>Descripción:</strong>{' '}
                  {getSafeText(parents?.father?.description, 'Información no disponible')}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3 text-center">Padre</h3>
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Padre del cachorro"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <h4 className="font-medium text-sm mb-1">Información</h4>
              <p className="text-sm">
                <strong>Nombre:</strong> No disponible
              </p>
              <p className="text-sm mt-1">
                <strong>Descripción:</strong> Información no disponible
              </p>
            </div>
          </div>
        )}
        {/* Elemento central - Anillos de unión */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
          <div className="bg-white rounded-full p-1 ">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-400"
              >
                <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-400 absolute left-1/2 transform -translate-x-1/2"
              >
                <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Madre */}
        {parents.mother && parents.mother.slug ? (
          <Link
            href={`/dogs/${parents.mother.slug}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-3 text-center">Madre</h3>
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-3">
                {parents.mother.mainImage && typeof parents.mother.mainImage === 'object' ? (
                  <MediaComponent
                    resource={parents.mother.mainImage}
                    size="thumbnail"
                    className="h-full w-full object-cover"
                    alt={`Madre de ${getSafeText(puppyName, 'cachorro')}`}
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Madre del cachorro"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">Información</h4>
                <p className="text-sm">
                  <strong>Nombre:</strong> {getSafeText(parents?.mother?.name, 'No disponible')}
                </p>
                <p className="text-sm mt-1">
                  <strong>Descripción:</strong>{' '}
                  {getSafeText(parents?.mother?.description, 'Información no disponible')}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3 text-center">Madre</h3>
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden mb-3">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Madre del cachorro"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <h4 className="font-medium text-sm mb-1">Información</h4>
              <p className="text-sm">
                <strong>Nombre:</strong> No disponible
              </p>
              <p className="text-sm mt-1">
                <strong>Descripción:</strong> Información no disponible
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Elemento de unión para móviles */}
      <div className="md:hidden flex justify-center items-center py-2">
        <div className="bg-white rounded-full p-2 shadow-sm border">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-amber-400"
            >
              <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-amber-400 absolute left-1/2 transform -translate-x-1/2"
            >
              <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      {/* Historia de la pareja */}
      {coupleStory && (
        <div className="bg-amber-50 rounded-lg p-4 text-center mt-4">
          <h3 className="font-medium mb-2">Historia de la pareja</h3>
          {typeof coupleStory === 'string' ? (
            <p className="text-sm">{coupleStory}</p>
          ) : (
            <div className="text-sm">
              <RichText data={coupleStory} enableGutter={false} />
            </div>
          )}
        </div>
      )}

      {/* Camada resultante */}
      {litterPuppies && litterPuppies.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-3 text-center">Camada actual</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {litterPuppies.map((puppy) =>
              // No enlazar si es el cachorro actual
              puppy.id === currentPuppyId ? (
                <div
                  key={puppy.id}
                  className="relative aspect-square bg-muted rounded-2xl overflow-hidden border opacity-50" // Añadir opacidad para el actual
                >
                  {/* Contenido del div (imagen y texto 'Este cachorro') */}
                  {puppy.image && typeof puppy.image === 'object' ? (
                    <MediaComponent
                      resource={puppy.image}
                      size="square" // Añadir tamaño square
                      fill
                      className="object-cover"
                      alt={`Cachorro de la camada (actual)`}
                    />
                  ) : (
                    <Image
                      src={`/placeholder.svg?height=100&width=100`}
                      alt={`Cachorro de la camada (actual)`}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-amber-100 text-amber-800 text-xs text-center py-1">
                    Este cachorro
                  </div>
                </div>
              ) : (
                // Enlazar si es un hermano
                <Link
                  href={`/puppies/${puppy.slug}#padres`} // Añadir fragmento #padres
                  key={puppy.id}
                  className="block relative aspect-square bg-muted rounded-2xl overflow-hidden border cursor-pointer transition-opacity hover:opacity-80"
                >
                  {puppy.image && typeof puppy.image === 'object' ? (
                    <MediaComponent
                      resource={puppy.image} // Ya es tipo Media | null
                      size="square" // Añadir tamaño square
                      fill
                      className="object-cover"
                      alt={`Cachorro de la camada`}
                    />
                  ) : (
                    <Image
                      src={`/placeholder.svg?height=100&width=100`}
                      alt={`Cachorro de la camada`}
                      fill
                      className="object-cover"
                    />
                  )}
                  {/* Mostrar nombre del hermano */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 truncate px-1">
                    {puppy.name || 'Cachorro'}
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
