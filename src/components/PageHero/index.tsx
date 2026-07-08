import React from 'react'
import Image from 'next/image'
import { renderHeroWords } from '@/components/Hero/heroWords'

interface PageHeroProps {
  /** Etiqueta pequeña sobre el título ("Te presentamos", "Nuevos miembros"…) */
  kicker: string
  /** Título; admite spans con degradado (p. ej. text-gradient-gold) y <br /> */
  title: React.ReactNode
  description?: string
  imageSrc?: string
  /** object-position de la imagen de fondo */
  imagePosition?: string
  /** compact: páginas de listado · large: héroe protagonista (exposiciones) */
  size?: 'compact' | 'large'
  /** Elemento decorativo posicionado de forma absoluta dentro de la sección */
  decoration?: React.ReactNode
  /** Contenido extra bajo la descripción (p. ej. fila de estadísticas) */
  children?: React.ReactNode
}

// Hero interior de página con el mismo tratamiento cinematográfico que el hero
// de la home: imagen optimizada con Ken Burns, reveal palabra a palabra,
// línea dorada dibujada y parallax al hacer scroll.
export function PageHero({
  kicker,
  title,
  description,
  imageSrc = '/images/landscape.jpg',
  imagePosition = 'center 40%',
  size = 'compact',
  decoration,
  children,
}: PageHeroProps) {
  const isLarge = size === 'large'

  return (
    <section
      className={`hero-cinematic relative overflow-hidden ${
        isLarge
          ? 'pt-32 pb-20 md:pt-40 md:pb-24'
          : 'pt-32 pb-16 md:pt-40 md:pb-20 min-h-[18rem] md:min-h-[28rem]'
      }`}
    >
      {/* Imagen de fondo optimizada (LCP) con Ken Burns y parallax al scroll */}
      <div className="hero-parallax-media absolute inset-0">
        <div className="hero-kenburns absolute inset-0">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>
      </div>

      {/* Degradado principal desde abajo */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.3) 30%,
            rgba(0, 0, 0, 0.6) 60%,
            rgba(0, 0, 0, 0.9) 100%
          )`,
        }}
      />

      {/* Degradado lateral para legibilidad del texto */}
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

      {/* Acento dorado cálido */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: 'linear-gradient(180deg, transparent 55%, rgba(165, 138, 27, 0.22) 100%)',
        }}
      />

      {/* Textura de grano sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grain-overlay" />

      {decoration}

      {/* Contenido */}
      <div className="hero-parallax-content relative z-10 container mx-auto px-6 lg:px-12">
        <div className={isLarge ? 'max-w-4xl' : 'max-w-2xl'}>
          {/* Encabezado sutil */}
          <div className={`animate-fade-in-up ${isLarge ? 'mb-8' : 'mb-5'}`}>
            <div className="flex items-center gap-3">
              <span className="hero-line-draw w-12 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
              <span className="golden-silhouette-sm opacity-80" />
              <span
                className="text-[#c9a93d] text-[11px] font-medium tracking-[0.35em] uppercase"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                {kicker}
              </span>
            </div>
          </div>

          {/* Título: reveal palabra a palabra */}
          <h1
            className={`text-display text-white ${
              isLarge
                ? 'mb-8 text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05]'
                : 'mb-5 text-3xl md:text-4xl lg:text-5xl leading-[1.15]'
            }`}
            style={{
              filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.5)) drop-shadow(0 2px 10px rgba(0,0,0,0.3))',
            }}
          >
            {renderHeroWords(title)}
          </h1>

          {/* Descripción */}
          {description && (
            <p
              className={`animate-fade-in-up delay-600 text-white/80 leading-relaxed ${
                isLarge ? 'text-lg md:text-xl max-w-2xl mb-12' : 'text-base md:text-lg max-w-xl'
              }`}
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.6)' }}
            >
              {description}
            </p>
          )}

          {/* Contenido extra (estadísticas, CTAs…) */}
          {children && <div className="animate-fade-in-up delay-800">{children}</div>}
        </div>
      </div>
    </section>
  )
}
