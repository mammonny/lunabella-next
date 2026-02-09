import Link from 'next/link'

const features = [
  {
    title: 'Tranquilidad garantizada',
    description:
      'Tu cachorro viene con todas las pruebas genéticas realizadas y garantía de salud. Podrás disfrutarlo sin preocupaciones desde el primer día.',
  },
  {
    title: 'Listo para tu hogar',
    description:
      'Desde que nacen, nuestros cachorros conviven con niños, otros animales y estímulos del día a día. Llegan a tu casa preparados para integrarse en la familia.',
  },
  {
    title: 'Siempre a tu lado',
    description:
      'No te dejamos solo después de la entrega. Estaremos disponibles para resolver dudas, dar consejos y acompañarte durante toda la vida de tu Golden.',
  },
  {
    title: 'Ven a conocernos',
    description:
      'Te abrimos las puertas de nuestra casa. Conoce a los padres, el entorno donde crecen y comprueba de primera mano cómo trabajamos.',
  },
]

export default function WhyLunaBella() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-lunabella-diagonal">
      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-16 h-px bg-[#a58a1b]" />
            <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
              Nuestro compromiso
            </span>
          </div>

          <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
            ¿Por qué elegir{' '}
            <span className="text-gradient-gold">LunaBella</span>?
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
            Elegir un cachorro es una decisión importante. Queremos que lo hagas con total confianza, sabiendo exactamente qué esperar de nosotros.
          </p>
        </div>

        {/* Refined cards with subtle backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white/80 backdrop-blur-sm p-8 lg:p-10 border border-gray-100 transition-all duration-300 hover:border-[#a58a1b]/30 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)]"
            >
              {/* Subtle gold accent */}
              <div className="w-10 h-0.5 bg-[#a58a1b] mb-6 transition-all duration-300 group-hover:w-14" />

              <h3 className="text-xl lg:text-2xl font-heading font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/nosotros"
            className="inline-flex items-center justify-center px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] bg-black text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
          >
            Conoce nuestra historia
          </Link>
        </div>
      </div>
    </section>
  )
}
