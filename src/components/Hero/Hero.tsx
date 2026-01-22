import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container/container'
import { Gradient } from '@/components/Gradient/gradient'
import { Button } from 'src/components/ui/button'
import { CalendarArrowUp, ArrowRight, Calendar, PhoneOutgoing } from 'lucide-react'
import { Heading, Lead, Subheading } from '@/components/Text/text'
import { Badge } from 'src/components/ui/badge'

interface HeroProps {
  variant?: 'default' | 'home' | 'lunabella'
  title: string | React.ReactNode
  description: string
  imageSrc: string
  imageAlt: string
  blurDataURL?: string
  titleClassName?: string
  descriptionClassName?: string
  containerClassName?: string
  additionalText?: string
  quote?: {
    text: string
    author: string
  }
  ctaButtons?: {
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
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
  quote,
  ctaButtons,
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

  // Variante LunaBella: Diseño editorial luxury con elementos premium
  if (variant === 'lunabella') {
    return (
      <section className="relative min-h-[85vh] flex flex-col justify-center py-24 overflow-hidden">
        {/* Background Image with cinematic gradient */}
        <div
          className="absolute inset-0 animate-image-reveal bg-cover bg-[position:85%_top] md:bg-[position:center_top]"
          style={{
            backgroundImage: `url(${imageSrc})`,
          }}
        />

        {/* Primary gradient - strong from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.35) 0%,
              rgba(0, 0, 0, 0.25) 30%,
              rgba(0, 0, 0, 0.55) 60%,
              rgba(0, 0, 0, 0.92) 100%
            )`,
          }}
        />

        {/* Left side gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.75) 0%,
              rgba(0, 0, 0, 0.5) 40%,
              rgba(0, 0, 0, 0.15) 65%,
              transparent 85%
            )`,
          }}
        />

        {/* Warm golden accent overlay */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, rgba(165, 138, 27, 0.25) 100%)',
          }}
        />

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grain-overlay" />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            {/* Encabezado sutil */}
            <div className="animate-fade-in-up mb-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
                <span className="golden-silhouette-sm opacity-80" />
                <span
                  className="text-[#c9a93d] text-[11px] font-medium tracking-[0.35em] uppercase"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  LunaBella
                </span>
              </div>
            </div>

            {/* Título principal */}
            <h1
              className="animate-fade-in-up delay-100 mb-10 text-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.08]"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}
            >
              {title}
            </h1>

            {/* Cita */}
            {quote && (
              <blockquote className="animate-fade-in-up delay-200 mb-12 max-w-xl">
                <p
                  className="text-editorial text-white/90 text-lg md:text-xl leading-relaxed"
                  style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
                  <span
                    className="text-white/70 text-sm tracking-wide"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                  >
                    {quote.author}
                  </span>
                </footer>
              </blockquote>
            )}

            {/* Botones */}
            {ctaButtons && (
              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4">
                <Link
                  href={ctaButtons.primary.href}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-4 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out hover:shadow-[0_20px_50px_-15px_rgba(236,232,225,0.4)] hover:-translate-y-1"
                  style={{ backgroundColor: '#ece8e1', color: '#000000' }}
                >
                  {ctaButtons.primary.label}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href={ctaButtons.secondary.href}
                  className="inline-flex items-center justify-center px-10 py-4 text-[13px] font-medium uppercase tracking-[0.2em] border transition-all duration-500 ease-out hover:bg-white/10 hover:border-white/50"
                  style={{ borderColor: 'rgba(236, 232, 225, 0.35)', color: '#ece8e1' }}
                >
                  {ctaButtons.secondary.label}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up delay-500">
          <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>
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
