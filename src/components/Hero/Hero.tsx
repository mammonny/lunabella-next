import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container/container'
import { Gradient } from '@/components/Gradient/gradient'
import { Button } from 'src/components/ui/button'
import { CalendarArrowUp, ArrowRight, Calendar, PhoneOutgoing } from 'lucide-react'
import { Heading, Lead, Subheading } from '@/components/Text/text'
import { Badge } from 'src/components/ui/badge'
import { Arrow } from '@radix-ui/react-popover'

interface HeroProps {
  variant?: 'default' | 'home'
  title: string | React.ReactNode
  description: string
  imageSrc: string
  imageAlt: string
  blurDataURL?: string
  titleClassName?: string
  descriptionClassName?: string
  containerClassName?: string
  additionalText?: string
}

export function Hero({
  variant = 'default',
  title,
  description,
  imageSrc,
  imageAlt,
  blurDataURL,
  titleClassName = 'text-dancing text-4xl font-semibold tracking-tight sm:text-8xl',
  descriptionClassName = 'mt-8 text-pretty text-base font-medium text-slate-600 sm:text-xl/8',
  containerClassName = 'relative py-20',
  additionalText,
}: HeroProps) {
  // Optimización: Props de imagen optimizadas para prevenir CLS y mejorar LCP
  const imageProps = {
    src: imageSrc,
    alt: imageAlt,
    width: 1920,
    height: 1080,
    priority: true, // Optimización LCP: Carga prioritaria para hero images
    ...(blurDataURL && {
      placeholder: 'blur' as const,
      blurDataURL: blurDataURL,
    }),
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1920px',
    // Optimización: CSS classes con aspect-ratio para prevenir CLS
    className:
      'absolute min-h-fit inset-0 border -z-10 h-full w-full object-cover object-center-top rounded-[2rem] aspect-video',
  }

  // Optimización: Componente de imagen reutilizable
  const ImageComponent = (
    <Gradient className="absolute inset-2 bottom-0 rounded-[2rem] ring-1 ring-black/5 ring-inset overflow-hidden">
      {/*
        Optimización SEO y LCP:
        - Server Component permite mejor indexación por buscadores
        - priority={true} mejora LCP (Largest Contentful Paint)
        - Para preloading adicional, añadir en el <head> de la página:
        <link rel="preload" as="image" href={imageSrc} />
      */}
      <Image {...imageProps} />
    </Gradient>
  )

  // Optimización: Renderizado condicional optimizado para Server Components
  if (variant === 'home') {
    return (
      <Container className="relative">
        {/* Optimización: CSS contain property para mejor performance de layout */}
        <div
          className="relative z-10 pt-24 pb-24 sm:pt-24 sm:pb-32 md:pt-60 md:pb-24"
          style={{ contain: 'layout style' }}
        >
          {/* Optimización SEO: Estructura semántica correcta con h1 para mejor indexación */}

          <div className="mx-auto  lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 lg:items-stretch xl:grid-cols-2">
            <div className="row-span-2 flex items-center">
              <div className="flex gap-4 flex-col">
                <div className="flex flex-row gap-2">
                  {/* Badges con colores de tema */}
                  {/* <Badge className="border-transparent bg-primary/15 text-primary">Verde</Badge> */}
                  <Badge className="border-amber-300 bg-amber-100  text-amber-800 shadow-sm lg:text-sm">
                    {description}
                  </Badge>
                </div>
                <div className="flex gap-4 flex-col">
                  {/* Título con fuente heading y peso medio, sin color en puntuación */}
                  {/*    <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-medium">
                    Tecnología Dental
                    <br className="" />{' '}
                    <span className="[text-shadow:-10px_6px_15px_hsla(35,66%,53%,0.5)]">
                      Avanzada{' '}
                    </span>
                  </h1> */}
                  <Heading as="h3" className="mt-2 !text-7xl font-semibold">
                    {title}
                  </Heading>

                  {additionalText && (
                    <Lead className="mt-6 max-w-lg text-lg mb-20">{additionalText}</Lead>
                  )}
                </div>

                <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
                  <Button asChild size="lg" className="gap-4 text-white">
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/puppies"
                      // Optimización SEO: Texto descriptivo para screen readers
                      aria-label="Conoce nuestros cachorros disponibles"
                    >
                      Nuestros cachorros{' '}
                      <ArrowRight className="w-4 h-4 text-white ml-2" strokeWidth={2.25} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-4">
                    <Link
                      href="tel:+34685910377"
                      className="flex items-center gap-2 whitespace-nowrap"
                      // Optimización SEO: Texto descriptivo para mejor accesibilidad
                      aria-label="Contactar con Clínica ENIQ"
                    >
                      +34 619 10 54 89 <PhoneOutgoing className="w-4 h-4" strokeWidth={2} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Modified Image */}
            <a
              href="https://www.youtube.com/watch?v=VS2n0e1kM-I"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              <div className="relative mt-10 aspect-square sm:mt-16 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:max-w-none ">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="transform group-hover:scale-110 transition-all duration-300 cursor-pointer relative">
                    {/* Fondo rojo del logo de YouTube */}
                    {/* <svg
                      className="w-28 h-20 text-white drop-shadow-lg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    </svg> */}
                    {/* Triángulo de play blanco superpuesto */}
                    {/*  <svg
                      className="w-28 h-20 text-sky-700 absolute inset-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg> */}
                  </div>
                </div>
                {/*  <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </div> */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <Image
                    src="/fotos/bichonmaltesraza.webp"
                    alt="Alejandra de la Rosa trabajando en Clínica ENIQ"
                    height={600}
                    width={600}
                    className="rounded-2xl object-cover"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
        {ImageComponent}
      </Container>
    )
  }

  // Optimización: Variante default optimizada para SEO
  return (
    <Container className={containerClassName}>
      {/* Optimización: CSS contain property para mejor performance de layout */}
      <div
        className="relative z-10 pt-28 pb-24 sm:pt-24 sm:pb-32 md:pt-60 md:pb-60"
        style={{ contain: 'layout style' }}
      >
        <div className="mx-auto max-w-2xl text-center">
          {/* Optimización SEO: h1 semánticamente correcto para mejor indexación */}
          <h1 className={titleClassName}>{title}</h1>
          <p className={descriptionClassName}>{description}</p>
        </div>
      </div>
      {ImageComponent}
    </Container>
  )
}
