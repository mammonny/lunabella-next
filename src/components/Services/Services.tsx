'use client'
import {
  Heart,
  Venus,
  Mars,
  Baby,
  Sparkles,
  TestTube2,
  Activity,
  LucideProps,
  Dna,
  Zap,
  Users,
  Stethoscope,
} from 'lucide-react'
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useState,
  useEffect,
} from 'react'
import { Heading, Lead, Subheading } from '@/components/Text/text'
import Image from 'next/image'
import useClickableCard from '@/utilities/useClickableCard'

// Define explicit types for the icon object
type IconInfo =
  | {
      type: 'lucide'
      component: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    }
  | { type: 'svg'; path: string }

// Define the type for a feature
interface Feature {
  name: string
  description: string
  href: string
  icon: IconInfo
  iconSize?: number // Nuevo campo opcional
  backgroundImage?: string // Nueva propiedad para imagen de fondo
}

const features: Feature[] = [
  {
    name: 'Shih Tzu',
    description:
      'Dulce y tranquilo, criado para ser compañero real. Perfecto para familias que buscan un amigo fiel y sereno.',
    href: '/shih-tzu',
    icon: { type: 'svg', path: '/icons/suelo-pelvico.png' },
    iconSize: 42,
    backgroundImage: '/fotos/Shih-Tzu.jpg',
  },

  {
    name: 'Lou Lou Pomerania',
    description:
      'Esponjoso y encantador, con gran personalidad en tamaño pequeño. Perfecto para familias que buscan alegría.',
    href: '/pomerania',
    icon: { type: 'svg', path: '/icons/ginecoestetica.png' },
    iconSize: 42,
    backgroundImage: '/fotos/loulou.webp',
  },
  {
    name: 'Bichón Maltés',
    description:
      'Elegante y cariñoso, con pelaje blanco como la seda. Compañero ideal para hogares tranquilos y amorosos.',
    href: '/bichon-maltes',
    icon: { type: 'svg', path: '/icons/salud-hormonal.png' },
    iconSize: 42,
    backgroundImage: '/fotos/bichonmaltesraza.webp',
  },
  {
    name: 'Yorkshire Terrier',
    description:
      'Pequeño pero valiente, con pelaje sedoso y personalidad vivaz. Ideal como compañero leal y guardián alerta.',
    href: '/yorkshire-terrier',
    icon: { type: 'svg', path: '/icons/ginecologia-regenerativa.png' },
    iconSize: 42,
    backgroundImage: '/fotos/yorkshire-terrier.jpg',
  },
]

export default function Services() {
  return (
    <div id="servicios" className="bg-primary/10 relative overflow-hidden">
      {/* Logo decorativo de fondo */}
      <div className="absolute opacity-10 pointer-events-none -rotate-12 right-[-20%] top-[5%] w-[min(450px,40vw)] h-[min(450px,40vw)] lg:right-[-15%] lg:top-[-10%] lg:w-[min(800px,50vw)] lg:h-[min(800px,50vw)]">
        <img
          src="/icono-color.png"
          alt="Decoración Dra. Marta Recio"
          className="w-full h-full object-contain"
        />
      </div>

      <div className=" max-w-7xl py-24 sm:py-32 container relative z-10">
        <div className="mx-auto ">
          <div className="mx-auto lg:mx-0">
            <Subheading>Nuestras Razas</Subheading>
            <Heading as="h3" className="mt-2">
              Razas que criamos
            </Heading>
            <Lead className="mt-6 max-w-3xl text-lg">
              Criamos con amor y dedicación estas hermosas razas de perros pequeños. Cada cachorro
              nace en un ambiente familiar, con cuidados especializados y mucho cariño.
            </Lead>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const FeatureCard = () => {
                  const { card, link } = useClickableCard<HTMLDivElement>({ external: false })

                  return (
                    <div
                      ref={card.ref}
                      key={feature.name}
                      className="group relative flex flex-col bg-white ring-1 shadow-md ring-[#D15052]/15 after:absolute after:inset-0 after:rounded-xl after:shadow-[inset_0_0_2px_1px_#ffffff4d] transition-all overflow-hidden rounded-xl cursor-pointer hover:shadow-lg hover:scale-[1.02]"
                    >
                      {/* Imagen de fondo - solo parte superior */}
                      {feature.backgroundImage && (
                        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                          <Image
                            src={feature.backgroundImage}
                            alt={`Fondo ${feature.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          {/* Gradiente sutil solo en la parte inferior de la imagen */}
                          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                      )}

                      {/* Contenido en zona blanca */}
                      <div className="flex flex-col items-center p-4 bg-white rounded-b-xl">
                        {/* Icono centrado */}
                        {/* <div className="mb-4 flex size-10 flex-none items-center justify-center rounded-lg bg-stone-50 group-hover:bg-white">
                      {feature.icon.type === 'lucide' ? (
                        <feature.icon.component
                          className="size-5 text-stone-600 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      ) : (
                        <Image
                          src={feature.icon.path}
                          alt={feature.name}
                          width={20}
                          height={20}
                          className="text-stone-600 group-hover:text-primary transition-all duration-300"
                          loading="lazy"
                          priority={false}
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            filter:
                              'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(1000%) hue-rotate(309deg) brightness(95%) contrast(85%)',
                          }}
                        />
                      )}
                    </div> */}

                        {/* Contenido centrado */}
                        <div className="text-center">
                          <h3 className="font-semibold mb-2">{feature.name}</h3>
                          <p className="text-stone-600 text-sm">{feature.description}</p>

                          {/* Enlace opcional */}
                          {/* {feature.href && (
                        <div className="mt-3">
                          <a
                            href={feature.href}
                            className="text-sm font-medium text-primary hover:text-primary/80"
                          >
                            Saber más <span aria-hidden="true">→</span>
                          </a>
                        </div>
                      )} */}
                        </div>
                      </div>

                      {/* Link oculto para navegación */}
                      <a
                        ref={link.ref}
                        href={feature.href}
                        className="hidden"
                        aria-label={`Ver más sobre ${feature.name}`}
                      />
                    </div>
                  )
                }

                return <FeatureCard key={feature.name} />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Función alternativa con layout minimalista basado en la imagen
export function ServicesAlternative() {
  return (
    <div
      id="servicios-alt"
      className="bg-gradient-to-b from-primary/5 via-primary/5 to-secondary/5 relative overflow-hidden"
    >
      {/* Logo decorativo de fondo */}
      <div className="absolute opacity-10 pointer-events-none -rotate-12 right-[-20%] top-[5%] w-[min(450px,40vw)] h-[min(450px,40vw)] lg:right-[-15%] lg:top-[-10%] lg:w-[min(800px,50vw)] lg:h-[min(800px,50vw)]">
        <img
          src="/icono-color.png"
          alt="Decoración Dra. Marta Recio"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-7xl py-24 sm:py-32 container relative z-10">
        <div className="mx-auto">
          <div className="mx-auto lg:mx-0">
            <Subheading>Nuestras Razas</Subheading>
            <Heading as="h3" className="mt-2 text-pink-950">
              Razas que criamos con amor
            </Heading>
            <Lead className="mt-6 max-w-3xl text-lg">
              Cada una de nuestras razas es seleccionada por su temperamento, salud y belleza.
              Criamos con pasión para ofrecerte el compañero perfecto.
            </Lead>
          </div>

          <div className="mx-auto mt-16  sm:mt-20 lg:mt-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const FeatureCard = () => {
                  const { card, link } = useClickableCard<HTMLDivElement>({ external: false })

                  return (
                    <div
                      ref={card.ref}
                      key={feature.name}
                      className="group relative flex flex-col bg-white ring-1 shadow-md ring-primary/10 rounded-3xl hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
                    >
                      {/* Imagen de fondo - solo parte superior */}
                      {feature.backgroundImage && (
                        <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
                          <Image
                            src={feature.backgroundImage}
                            alt={`Fondo ${feature.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          {/* Gradiente sutil solo en la parte inferior de la imagen */}
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                      )}

                      {/* Contenido en zona blanca */}
                      <div className="flex flex-col h-full p-6 bg-white rounded-b-3xl">
                        {/* Ícono */}
                        <div className="mb-6 flex size-12 flex-none items-center justify-center">
                          {feature.icon.type === 'lucide' ? (
                            <feature.icon.component
                              className="size-8 text-primary"
                              aria-hidden="true"
                            />
                          ) : (
                            <Image
                              src={feature.icon.path}
                              alt={feature.name}
                              width={42}
                              height={42}
                              loading="lazy"
                              priority={false}
                              placeholder="blur"
                              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="
                              className="text-primary transition-all duration-300"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                filter:
                                  'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(800%) hue-rotate(300deg) brightness(100%) contrast(90%)',
                              }}
                            />
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-pink-950 mb-3">
                            {feature.name}
                          </h3>
                          <p className="text-stone-600 text-sm leading-relaxed mb-4">
                            {feature.description}
                          </p>

                          {/* Enlace "Más información" - Solo se muestra si href es válido */}
                          {feature.href && feature.href !== '#' && (
                            <div className="mt-auto">
                              <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-all duration-300 border-b-2 border-primary/20 bg-transparent px-0 pb-1 rounded-none">
                                Más información
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Link oculto para navegación */}
                      <a
                        ref={link.ref}
                        href={feature.href}
                        className="hidden"
                        aria-label={`Ver más sobre ${feature.name}`}
                      />
                    </div>
                  )
                }

                return <FeatureCard key={feature.name} />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
