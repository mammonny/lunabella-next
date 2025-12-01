import { Star } from 'lucide-react'
import { Heading, Lead, Subheading } from '@/components/Text/text'
import { GradientBackgroundTestimonials } from '../Gradient/gradient'
import Image from 'next/image'
import { useMemo, useCallback, memo } from 'react'

// Componente StarRating optimizado
const StarRating = memo(({ size = 'h-5 w-5' }: { size?: string }) => {
  return (
    <div className="flex gap-x-1 text-amber-400">
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

const featustoneTestimonial = {
  body: 'El pasado 2 de enero Dama, una cachorro d ShihTzu pasó a formar parte d mi familia. Elena nos la entregó preciosa y con todas las instrucciones referentes a sus cuidados y un kit para los primeros días con comida, mantita, cepillo. Es muy juguetona y alegre. Elena me escribe para interesarse x su evolución y x si tengo dudas.',
  author: {
    name: 'Elena Navaridas',
    handle: 'Cliente',
    imageUrl: '/fotos/avatares/claudia.png',
  },
}
const testimonials = [
  [
    [
      {
        body: 'Hace 18 años confíe en Elena para comprar a mi primer Shi-tzu y creí que no se podía mejorar, pues sí! He comprado el segundo hace 1 semana y se me ha puesto malito, Elena me ha atendido en todo momento, incluso me ha estado llamando y preocupándose por mi cachorro continuamente. De verdad, la confianza y tranquilidad que te da es inmejorable!',
        author: {
          name: 'Noemi Aguirregabiria',
          handle: 'Cliente',
          imageUrl: '/fotos/avatares/cristina.jpg',
        },
      },
      {
        body: 'Nuestra experiencia ha sido de sobresaliente. La propietaria, Elena, es encantadora en el trato y muy profesional. Ya llevamos una semana con Ludo, un shit tzu precioso, cariñoso y lleno de energía, nos tiene enamorados. Mi recomendación es totalmente positiva al 100%.',
        author: {
          name: 'Mar Rodríguez Ibáñez',
          handle: 'Cliente',
          imageUrl: '/fotos/avatares/testimonio-debora.jpg',
        },
      },
    ],
    [
      {
        body: 'Elena, su propietaria es una persona encantadísima. Se nota que ama a las criaturas que tiene y muy entendida. Nos vendió un bichón maltés y es de lo más cariñoso. Cuando lo trajimos a casa, se amoldó a su nueva casa en dos días. Nos sigue a todas partes, es una maravilla y un miembro más de la familia.',
        author: {
          name: 'Alberto Javier Dios',
          handle: 'Cliente',
          imageUrl: '/fotos/avatares/jaime.png',
        },
      },
    ],
  ],
  [
    [
      {
        body: 'Muy recomendable si estás buscando una de las razas que ofrecen. En nuestro caso, nos llevamos un pomerania precioso que aparte de bonito es un solete. No podríamos estar más contentos con su carácter. Es muy sociable, cariñoso y avispado. Lo que verdaderamente me hizo decidirme fue la confianza que me dio Elena.',
        author: {
          name: 'Miriam Calvo Ortiz',
          handle: 'Cliente',
          imageUrl: '/fotos/avatares/testimonio-irene.jpg',
        },
      },
    ],
    [
      {
        body: 'Hace muchos años, exactamente 13 me acerqué sin ningún tipo de referencia a donde Elena, y un 11 de noviembre conocí a la que luego fue Ara, la perrita más maravillosa que he conocido. Lo que Ara me ha dado no se paga con dinero. Es una opción segura, y sé que no me voy a arrepentir, porque son perritas sanas, y de un carácter magnífico.',
        author: {
          name: 'Estefania Unciti',
          handle: 'Cliente',
          imageUrl: '/fotos/avatares/testimonio-ruth.jpg',
        },
      },
      {
        body: 'Elena una mujer maravillosa desde el primer momento que hablé con ella me causó muchísima confianza te explica todo super bien y es sincera con todo. Fuimos a ver los perritos que tiene y nos enamoramos de un pomerania chiquitín. Una mujer encantadora atenta te deja tu tiempo con los perritos y sobretodo se ve toda la dedicación que tiene con sus perros, cuidados con muchísimo amor.',
        author: {
          name: 'Verónica Caballero',
          handle: 'Cliente',
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
  const memoizedFeatustoneTestimonial = useMemo(() => featustoneTestimonial, [])
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
    <div className="relative isolate bg-white pb-24 pt-24 sm:pt-14">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#fcfa89]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#fc89ac] xl:ml-0 xl:mr-[calc(50%-12rem)]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading as="h3" className="mt-2">
          Testimonios
        </Heading>

        <Lead className="mt-6 max-w-3xl text-lg ">
          Estamos orgullosos de cada testimonio que nuestros clientes comparten, porque son el
          reflejo de nuestro compromiso.
        </Lead>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-stone-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-primary/10 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-pink-950">
              <p>{`"${memoizedFeatustoneTestimonial.body}"`}</p>
              <div className="mt-4">
                <StarRating size="h-5 w-5" />
                zm
              </div>
            </blockquote>
            <figcaption className="flex items-center gap-x-4 border-t border-primary/15 px-6 py-4">
              <Image
                width={40}
                height={40}
                className="h-10 w-10 flex-none rounded-full bg-stone-50"
                src={memoizedFeatustoneTestimonial.author.imageUrl}
                loading="lazy"
                alt={`Avatar de ${memoizedFeatustoneTestimonial.author.name}`}
              />
              <div className="flex-auto">
                <div className="font-semibold text-pink-950">
                  {memoizedFeatustoneTestimonial.author.name}
                </div>
                <div className="text-stone-600">{`@${memoizedFeatustoneTestimonial.author.handle}`}</div>
              </div>
            </figcaption>
          </figure>
          {memoizedTestimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={`column-group-${columnGroupIdx}`}
              className="space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={`column-${columnGroupIdx}-${columnIdx}`}
                  className={getColumnClassName(columnGroupIdx, columnIdx, columnGroup)}
                >
                  {column.map((testimonial, testimonialIdx) => (
                    <figure
                      key={`testimonial-${columnGroupIdx}-${columnIdx}-${testimonialIdx}`}
                      className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-primary/10"
                    >
                      <blockquote className="text-stone-900">
                        <p>{`"${testimonial.body}"`}</p>
                        <div className="mt-3">
                          <StarRating size="h-4 w-4" />
                        </div>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full bg-stone-50"
                          src={testimonial.author.imageUrl}
                          loading="lazy"
                          alt={`Avatar de ${testimonial.author.name}`}
                        />
                        <div>
                          <div className="font-semibold text-pink-950">
                            {testimonial.author.name}
                          </div>
                          <div className="text-stone-600">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
