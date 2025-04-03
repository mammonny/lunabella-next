import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/components/Media'

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
}

export const PuppyParentsTab = ({ parents, puppyName }: ParentsTabProps) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Padre */}
        {parents.father && parents.father.slug ? (
          <Link
            href={`/dogs/${parents.father.slug}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-3 text-center">Padre</h3>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                {parents.father.mainImage && typeof parents.father.mainImage === 'object' ? (
                  <Media
                    resource={parents.father.mainImage}
                    fill
                    className="object-cover"
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
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
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

        {/* Madre */}
        {parents.mother && parents.mother.slug ? (
          <Link
            href={`/dogs/${parents.mother.slug}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-3 text-center">Madre</h3>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                {parents.mother.mainImage && typeof parents.mother.mainImage === 'object' ? (
                  <Media
                    resource={parents.mother.mainImage}
                    fill
                    className="object-cover"
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
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
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
    </div>
  )
}
