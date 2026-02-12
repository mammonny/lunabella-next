import type { Metadata } from 'next/types'
import Image from 'next/image'
import CTASection from '@/components/CTASection'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'

import { PuppyCard } from '@/components/PuppyCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { cn } from '@/utilities/ui'
import ScrollProgress from '@/components/ScrollProgress'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Obtener todos los Dogs
  const dogs = await payload.find({
    collection: 'dogs',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    select: {
      id: true,
      name: true,
      apodo: true,
      slug: true,
      breed: true,
      gender: true,
      breedingStatus: true,
      mainImage: true,
    },
  })

  // Filtrar por secciones
  const activeMales = dogs.docs.filter(
    (dog) => dog.breedingStatus === 'active' && dog.gender === 'male',
  )
  const activeFemales = dogs.docs.filter(
    (dog) => dog.breedingStatus === 'active' && dog.gender === 'female',
  )
  const retired = dogs.docs.filter((dog) => dog.breedingStatus === 'retired')
  const inMemory = dogs.docs.filter((dog) => dog.breedingStatus === 'deceased')

  return (
    <>
      <ScrollProgress />
      <main className="isolate">
        {/* Hero Section - Compact Editorial Style */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 min-h-[26rem] md:min-h-[30rem] overflow-hidden">
          {/* Background Image - Decorative */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/landscape.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
          {/* Strong gradient overlay for readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                100deg,
                rgba(0, 0, 0, 0.9) 0%,
                rgba(0, 0, 0, 0.75) 40%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
            }}
          />

          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              {/* Ornamental detail */}
              <div className="flex items-center gap-3 mb-5 w-[15rem] animate-fade-in-up">
                <span className="flex-1 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
                <span className="text-[#c9a93d] text-xs font-medium tracking-[0.3em] uppercase">
                  Te presentamos
                </span>
              </div>

              {/* Título principal */}
              <h1 className="mb-5 text-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] animate-fade-in-up delay-100">
                Nuestros{' '}
                <span className="text-gradient-gold">Golden Retriever</span>
              </h1>

              {/* Descripción */}
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl animate-fade-in-up delay-200">
                Seleccionamos los mejores ejemplares para ofrecer cachorros sanos,
                con excelente morfología y carácter equilibrado.
              </p>
            </div>
          </div>
        </section>

        <PageBreadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Nuestros Goldens' },
        ]} />

        {/* Content Sections */}
        <div className="bg-white">
          {/* Seccion: Machos Activos */}
          {activeMales.length > 0 && (
            <DogsSection
              title="Machos"
              subtitle="Permítenos presentarte a nuestros magníficos machos, cada uno de ellos es un verdadero tesoro con características únicas y encantadoras que los distinguen"
              dogs={activeMales}
              accentColor="#5b8fc9"
              index={0}
            />
          )}

          {/* Seccion: Hembras Activas */}
          {activeFemales.length > 0 && (
            <DogsSection
              title="Hembras"
              subtitle="Descubre a nuestras adorables hembras, cada una con su propia belleza y encanto, y todas ellas forman parte de nuestro compromiso por mejorar la raza del Golden Retriever."
              dogs={activeFemales}
              accentColor="#d4a5a0"
              index={1}
            />
          )}

          {/* Seccion: Retirados */}
          {retired.length > 0 && (
            <DogsSection
              title="Retirados"
              subtitle="Ejemplares que ya no se utilizan para la cría pero siguen viviendo con nosotros, disfrutando de su merecido descanso."
              dogs={retired}
              accentColor="#a58a1b"
              index={2}
              isRetired
            />
          )}

          {/* Seccion: En Memoria */}
          {inMemory.length > 0 && (
            <DogsSection
              title="En Memoria"
              subtitle="Perros que ya no están entre nosotros y nunca olvidaremos. Gracias por tanto."
              dogs={inMemory}
              accentColor="#6b6560"
              index={3}
              isMemorial
            />
          )}
        </div>

        <CTASection
          label="¿Te interesa?"
          title={<>¿Buscas un <span className="text-gradient-gold">cachorro</span>?</>}
          description="Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de nuestros cachorros, nos encantaría conocerte."
          primaryLabel="Ver cachorros"
          primaryHref="/cachorros"
          secondaryLabel="Contactar"
          secondaryHref="/contacto"
        />
      </main>
    </>
  )
}

type DogsSectionProps = {
  title: string
  subtitle?: string
  dogs: any[]
  accentColor: string
  index: number
  isRetired?: boolean
  isMemorial?: boolean
}

function DogsSection({ title, subtitle, dogs, accentColor, index, isRetired, isMemorial }: DogsSectionProps) {
  const isEven = index % 2 === 0

  return (
    <section
      className={cn(
        'py-20 md:py-28 relative overflow-hidden',
        isMemorial && 'bg-[#f5f4f2]',
        isEven && !isMemorial && 'bg-white',
        !isEven && !isMemorial && 'bg-[#faf8f5]'
      )}
    >
      {/* Decorative background element */}
      {!isMemorial && (
        <div
          className="absolute top-1/4 right-0 w-64 h-44 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url('/silueta-golden.svg')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: isEven ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        />
      )}

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header con estilo editorial */}
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-20 items-end',
          isEven ? 'lg:text-left' : 'lg:text-left'
        )}>
          {/* Título con ornamento */}
          <div className={cn(
            'lg:col-span-4',
            !isEven && 'lg:order-2 lg:col-start-9'
          )}>
            <div className="flex items-center gap-4 mb-4">
              <span
                className="w-12 h-px transition-all duration-500"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="text-sm font-medium tracking-[0.25em] uppercase"
                style={{ color: accentColor }}
              >
                {isMemorial ? 'Siempre en nuestro corazón' : isRetired ? 'Disfrutando su retiro' : 'Nuestros ejemplares'}
              </span>
            </div>

            <h2 className={cn(
              'text-display text-4xl md:text-5xl lg:text-6xl',
              isMemorial ? 'text-gray-500' : 'text-gray-900'
            )}>
              {title}
            </h2>
          </div>

          {/* Descripción */}
          <div className={cn(
            'lg:col-span-7',
            !isEven && 'lg:order-1 lg:col-start-1'
          )}>
            {subtitle && (
              <p className={cn(
                'text-lg leading-relaxed',
                isMemorial ? 'text-gray-500' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Grid de cards con diseño elegante */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {dogs.map((dog, idx) => (
            <div
              key={dog.id || idx}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <PuppyCard
                puppy={dog}
                collectionType="dogs"
                className={cn(
                  'h-full',
                  isMemorial && 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500'
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section divider - only between sections, not after memorial */}
      {!isMemorial && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#a58a1b]/20 to-transparent" />
      )}
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Nuestros Golden Retriever | LunaBella',
    description:
      'Conoce a nuestra familia de Golden Retrievers. Ejemplares con pedigri completo, certificaciones de salud y un carácter excepcional.',
  }
}
