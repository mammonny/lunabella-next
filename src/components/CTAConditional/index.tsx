import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type CTAType = 'puppies' | 'litters' | 'dogs'

interface CTAConfig {
  title: string
  description: string
  buttonLabel: string
  href: string
}

const ctaConfigs: Record<CTAType, CTAConfig> = {
  puppies: {
    title: 'Echa un vistazo a nuestros cachorros disponibles',
    description:
      'Actualmente tenemos cachorros disponibles, échales un vistazo, te enamorarán.',
    buttonLabel: 'Ver cachorros',
    href: '/cachorros',
  },
  litters: {
    title: 'Echa un vistazo a nuestras camadas programadas',
    description:
      'Actualmente no disponemos de cachorros, pero puedes solicitar información a alguna de nuestras camadas programadas.',
    buttonLabel: 'Ver camadas',
    href: '/camadas',
  },
  dogs: {
    title: 'Echa un vistazo a nuestros ejemplares',
    description:
      'Actualmente no disponemos de cachorros o camadas programadas, pero puedes ver nuestros maravillosos ejemplares y apuntarte a la lista de espera.',
    buttonLabel: 'Ver ejemplares',
    href: '/nuestros-perros',
  },
}

async function getCTAType(): Promise<CTAType> {
  try {
    const payload = await getPayload({ config: configPromise })

    // Verificar si hay cachorros disponibles
    const puppiesResult = await payload.find({
      collection: 'puppies',
      where: {
        disponibilidad: {
          equals: 'available',
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 1,
    })

    if (puppiesResult.totalDocs > 0) {
      return 'puppies'
    }

    // Verificar si hay camadas
    const littersResult = await payload.find({
      collection: 'litters',
      limit: 1,
    })

    if (littersResult.totalDocs > 0) {
      return 'litters'
    }

    // Por defecto mostrar perros
    return 'dogs'
  } catch (error) {
    console.error('Error fetching CTA type:', error)
    return 'dogs'
  }
}

export default async function CTAConditional() {
  const ctaType = await getCTAType()
  const config = ctaConfigs[ctaType]

  return (
    <section className="relative py-32 md:py-44 overflow-hidden grain-overlay">
      {/* Background with cinematic treatment */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/lunabella/cta-cachorros.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }}
      />
      {/* Warm cream gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(215, 200, 175, 0.70) 0%,
            rgba(230, 215, 190, 0.60) 50%,
            rgba(240, 230, 210, 0.55) 100%
          )`,
        }}
      />
      {/* Subtle warm vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(140, 120, 90, 0.30) 100%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Card with refined design */}
          <div className="relative bg-white/95 backdrop-blur-sm p-10 md:p-16">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#a58a1b]/30" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#a58a1b]/30" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Content */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="golden-silhouette-sm opacity-70" />
                  <span className="text-[#a58a1b] text-xs font-medium tracking-[0.25em] uppercase">
                    Disponible ahora
                  </span>
                </div>

                <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6">
                  {config.title.split(' ').map((word, i) => {
                    if (['cachorros', 'camadas', 'ejemplares'].includes(word.toLowerCase())) {
                      return (
                        <span key={i} className="text-gradient-gold">
                          {word}{' '}
                        </span>
                      )
                    }
                    return word + ' '
                  })}
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                  {config.description}
                </p>
              </div>

              {/* CTA */}
              <div className="lg:col-span-5 flex lg:justify-end">
                <Link
                  href={config.href}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-[13px] font-medium uppercase tracking-[0.2em] bg-black text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
                >
                  {config.buttonLabel}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: '#a58a1b' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
