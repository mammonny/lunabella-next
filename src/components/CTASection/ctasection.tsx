import { CheckCircle } from 'lucide-react'
import { Badge } from '../ui/badge'

const benefits = [
  'Secretaria SEGERF (Sociedad Española de Ginecología Estetica, regenerativa y Funcional)',
  'Máster en Sexología y en Suelo Pélvico',
  'Experta en Hormonas bioidenticas',
  'Experta en Labioplastia y Ginecoestética',
  'Especialización en dolor uroginecológico',
  'Ponente en múltiples Congresos Nacionales e Internacionales',
]

export default function CTASection() {
  return (
    <div className="bg-secondary/15 py-24 sm:py-24">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex bg-primary max-w-2xl flex-col gap-16 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
            <img
              className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm"
              src="/team/dra_marta_recio.jpg"
              alt="Dra. Marta Recio"
            />
            <div className="w-full flex-auto">
              <Badge className="border-transparent mb-4 bg-[#f9efe1] text-secondary lg:text-sm">
                Nuestra Fundadora
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Dra. Marta Recio
              </h2>
              <p className="mt-6 text leading-8 text-stone-200">
                Ginecóloga especializada en medicina integrativa y regenerativa femenina y fundadora
                de InnovaCare. Con más de 15 años de experiencia, lidera un equipo de profesionales
                con una misión clara: cuidar desde la raíz.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-1"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-secondary" aria-hidden="true" />
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
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#ffc480] to-[#e5a046] opacity-25"
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
