import { CheckCircle } from 'lucide-react'
import { Badge } from '../ui/badge'

const benefits = [
  'Especialista en 4 razas: Bichón maltés, Shih Tzu, Yorkshire Terrier y Lou Lou Pomerania',
  'Cría responsable con pruebas genéticas y controles veterinarios exhaustivos',
  'Impronta temprana y socialización desde las primeras semanas de vida',
  'Entorno natural sin jaulas, con espacio para correr y socializar libremente',
  'Educación integral a futuros propietarios sobre las necesidades de cada raza',
  'Reputación internacional - familias vienen del extranjero por nuestros cachorros',
]

export default function CTASection2() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex bg-primary max-w-2xl flex-col gap-16 px-6 py-16 ring-1 ring-black/20 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
            <img
              className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-auto lg:h-auto lg:max-w-sm"
              src="/fotos/elena-uribe.jpg"
              alt="Elena Uribe"
            />
            <div className="w-full flex-auto">
              <Badge className="border-amber-300 mb-4 bg-amber-100 text-amber-800 shadow-sm lg:text-sm">
                Fundadora Criadero Goiz Ametz
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Elena Uribe
              </h2>
              <p className="mt-6 text leading-8 text-white">
                Desde nuestro hogar en Ollauri, La Rioja, rodeado de campo y naturaleza, he dedicado
                mi vida a la cría responsable y ética de cachorros. Mi filosofía es simple: "Aquí
                nacen con amor". Para mí, la salud y el bienestar de cada cachorro están siempre por
                encima de cualquier beneficio económico.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-1"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-amber-200" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              {/* <div className="mt-10 flex">
                <a href="#" className="text-sm font-semibold leading-6 text-secondary">
                  Conócela <span aria-hidden="true">&rarr;</span>
                </a>
              </div> */}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#ff80b1] to-[#e5a046] opacity-40"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
