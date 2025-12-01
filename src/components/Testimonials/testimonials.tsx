import { Star } from 'lucide-react'
export default function Testimonials() {
  return (
    <section className="bg-white py-30 sm:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">
            <div className="flex gap-x-1 text-indigo-600">
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />
            </div>
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-stone-700">
                <p>
                  "El pasado 2 de enero Dama, una cachorro d ShihTzu pasó a formar parte d mi
                  familia. Elena nos la entregó preciosa y con todas las instrucciones referentes a
                  sus cuidados y un kit para los primeros días con comida, mantita, cepillo. Es muy
                  juguetona y alegre. Elena me escribe para interesarse x su evolución y x si tengo
                  dudas."
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  className="h-14 w-14 rounded-full bg-stone-50"
                  src="/avatares/elena-navaridas.jpg"
                  alt="Avatar de Elena Navaridas"
                />
                <div className="text-base">
                  <div className="font-semibold text-stone-700">Elena Navaridas</div>
                  <div className="mt-1 text-stone-500">Cliente</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col border-t border-stone-700/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
            <div className="flex gap-x-1 text-indigo-600">
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />{' '}
              <Star
                style={{ fill: 'gold', stroke: 'gold' }}
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />
            </div>
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-stone-700">
                <p>
                  "Hace 18 años confíe en Elena para comprar a mi primer Shi-tzu y creí que no se
                  podía mejorar, pues sí! He comprado el segundo hace 1 semana y se me ha puesto
                  malito, Elena me ha atendido en todo momento, incluso me ha estado llamando y
                  preocupándose por mi cachorro continuamente. De verdad, la confianza y
                  tranquilidad que te da es inmejorable!"
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  className="h-14 w-14 rounded-full bg-stone-50"
                  src="/avatares/noemi-aguirregabiria.jpg"
                  alt="Avatar de Noemi Aguirregabiria"
                />
                <div className="text-base">
                  <div className="font-semibold text-stone-700">Noemi Aguirregabiria</div>
                  <div className="mt-1 text-stone-500">Cliente</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
