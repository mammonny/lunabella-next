import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useCallback, memo } from 'react'

// Componente StarRating optimizado
const StarRating = memo(({ size = 'h-5 w-5' }: { size?: string }) => {
  return (
    <div className="flex gap-x-1 text-amber-500">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          style={{ fill: 'currentColor' }}
          className={`${size} flex-none`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
})

StarRating.displayName = 'StarRating'

// Testimonios de LunaBella Golden Retriever (placeholders - actualizar con testimonios reales)
const featuredTestimonial = {
  body: 'Desde el primer momento que contactamos con María y Mikel supimos que habíamos encontrado el lugar perfecto para nuestra familia. El cariño con el que crían a sus Golden es evidente, y nuestro Max es el perro más feliz y equilibrado que hemos conocido. La atención post-venta ha sido excepcional.',
  author: {
    name: 'Familia García',
    handle: 'Madrid',
    imageUrl: '/fotos/avatares/claudia.png',
  },
}

const testimonials = [
  [
    [
      {
        body: 'LunaBella nos entregó a Luna, nuestra Golden, con toda la documentación, vacunas al día y un seguimiento que nos hizo sentir muy tranquilos. Se nota el amor que ponen en cada cachorro.',
        author: {
          name: 'Carlos y Ana',
          handle: 'Barcelona',
          imageUrl: '/fotos/avatares/cristina.jpg',
        },
      },
      {
        body: 'La transparencia y profesionalidad de María y Mikel es admirable. Pudimos conocer a los padres de nuestro cachorro y ver las condiciones en las que se crían. Totalmente recomendable.',
        author: {
          name: 'Patricia Ruiz',
          handle: 'Bilbao',
          imageUrl: '/fotos/avatares/testimonio-debora.jpg',
        },
      },
    ],
    [
      {
        body: 'Nuestro Golden de LunaBella tiene un carácter excepcional. Se nota el trabajo de socialización que hacen desde cachorros. Es un perro equilibrado, cariñoso y perfecto con los niños.',
        author: {
          name: 'David Martínez',
          handle: 'Valencia',
          imageUrl: '/fotos/avatares/jaime.png',
        },
      },
    ],
  ],
  [
    [
      {
        body: 'Después de mucho buscar, encontramos LunaBella y fue la mejor decisión. La salud de los reproductores está testada y nos dieron todas las garantías. Nuestro Thor es un campeón.',
        author: {
          name: 'Marta López',
          handle: 'Sevilla',
          imageUrl: '/fotos/avatares/testimonio-irene.jpg',
        },
      },
    ],
    [
      {
        body: 'Lo que más me impresionó fue el seguimiento. Meses después de llevarnos a Nala, siguen preguntando cómo está y nos dan consejos. Se nota que les importa el bienestar de cada cachorro.',
        author: {
          name: 'Roberto Sánchez',
          handle: 'Zaragoza',
          imageUrl: '/fotos/avatares/testimonio-ruth.jpg',
        },
      },
      {
        body: 'Criadores de verdad, no un negocio. María y Mikel aman lo que hacen y eso se refleja en la calidad de sus Golden. Nuestro Simba es pura alegría.',
        author: {
          name: 'Laura y Miguel',
          handle: 'San Sebastián',
          imageUrl: '/fotos/avatares/testimonio-ruxandra.jpg',
        },
      },
    ],
  ],
]

// Función classNames movida fuera del componente para evitar recreación
const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ')
}

export default function TestimonialsGrid() {
  // Memoizar los datos para evitar recreación en cada render
  const memoizedFeaturedTestimonial = useMemo(() => featuredTestimonial, [])
  const memoizedTestimonials = useMemo(() => testimonials, [])

  // Función para calcular className de columnas memoizada
  const getColumnClassName = useCallback(
    (columnGroupIdx: number, columnIdx: number, columnGroup: any[]) => {
      const isFirstColumn = columnGroupIdx === 0 && columnIdx === 0
      const isLastColumn =
        columnGroupIdx === memoizedTestimonials.length - 1 && columnIdx === columnGroup.length - 1

      return classNames(
        isFirstColumn || isLastColumn ? 'xl:row-span-2' : 'xl:row-start-1',
        'space-y-8',
      )
    },
    [memoizedTestimonials.length],
  )
  return (
    <section className="relative isolate py-28 md:py-40 bg-white overflow-hidden">
      {/* Subtle decorative background - Golden Retriever silhouette */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full overflow-hidden"
      >
        <div
          className="absolute top-1/4 right-0 w-80 h-56 opacity-[0.04]"
          style={{
            backgroundImage: `url('/silueta-golden.svg')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header with editorial style */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-16 h-px bg-[#a58a1b]" />
            <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
              Testimonios
            </span>
          </div>

          <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
            Lo que dicen nuestras{' '}
            <span className="text-gradient-gold">familias</span>
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
            Estamos orgullosos de cada testimonio que nuestros clientes comparten, porque son el
            reflejo de nuestro compromiso con la excelencia.
          </p>
        </div>
        <div className="grid max-w-2xl grid-cols-1 grid-rows-1 gap-6 lg:gap-8 text-sm leading-6 text-stone-900 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {/* Featured testimonial */}
          <figure className="group col-span-2 hidden sm:block bg-[#faf8f5] p-10 xl:col-start-2 xl:row-end-1 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(165,138,27,0.12)] quote-watermark">
            {/* Quote mark */}
            <div className="mb-6 text-5xl font-heading text-[#a58a1b]/20 relative z-10">"</div>
            <blockquote className="text-xl font-medium leading-relaxed text-gray-900 relative z-10">
              <p>{memoizedFeaturedTestimonial.body}</p>
            </blockquote>
            <div className="mt-6">
              <StarRating size="h-4 w-4" />
            </div>
            <figcaption className="mt-8 flex items-center gap-x-4 pt-6 border-t border-[#a58a1b]/10">
              <Image
                width={48}
                height={48}
                className="h-12 w-12 flex-none rounded-full bg-stone-50 ring-2 ring-[#a58a1b]/20"
                src={memoizedFeaturedTestimonial.author.imageUrl}
                loading="lazy"
                alt={`Avatar de ${memoizedFeaturedTestimonial.author.name}`}
              />
              <div className="flex-auto">
                <div className="font-heading font-semibold text-gray-900">
                  {memoizedFeaturedTestimonial.author.name}
                </div>
                <div className="text-gray-500 text-sm">{memoizedFeaturedTestimonial.author.handle}</div>
              </div>
            </figcaption>
          </figure>

          {/* Other testimonials */}
          {memoizedTestimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={`column-group-${columnGroupIdx}`}
              className="space-y-6 lg:space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={`column-${columnGroupIdx}-${columnIdx}`}
                  className={getColumnClassName(columnGroupIdx, columnIdx, columnGroup)}
                >
                  {column.map((testimonial, testimonialIdx) => (
                    <figure
                      key={`testimonial-${columnGroupIdx}-${columnIdx}-${testimonialIdx}`}
                      className="group bg-[#faf8f5] p-6 lg:p-8 transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(165,138,27,0.1)]"
                    >
                      <blockquote className="text-gray-800 leading-relaxed">
                        <p>{`"${testimonial.body}"`}</p>
                      </blockquote>
                      <div className="mt-4">
                        <StarRating size="h-3.5 w-3.5" />
                      </div>
                      <figcaption className="mt-6 flex items-center gap-x-4 pt-4 border-t border-[#a58a1b]/10">
                        <Image
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full bg-stone-50 ring-2 ring-[#a58a1b]/10"
                          src={testimonial.author.imageUrl}
                          loading="lazy"
                          alt={`Avatar de ${testimonial.author.name}`}
                        />
                        <div>
                          <div className="font-heading font-semibold text-gray-900 text-sm">
                            {testimonial.author.name}
                          </div>
                          <div className="text-gray-500 text-xs">{testimonial.author.handle}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: '#000000', color: '#ece8e1' }}
          >
            Contactar con LunaBella
          </Link>
        </div>
      </div>
    </section>
  )
}
