import Link from 'next/link'

const features = [
  {
    title: 'Salud genética',
    description:
      'Todos nuestros reproductores están testados genéticamente y libres de las enfermedades hereditarias más comunes en la raza.',
  },
  {
    title: 'Socialización temprana',
    description:
      'Los cachorros crecen en un ambiente familiar, con contacto humano diario y exposición a diferentes estímulos desde las primeras semanas.',
  },
  {
    title: 'Estándar de raza',
    description:
      'Criamos siguiendo el estándar oficial de la FCI, buscando la excelencia morfológica sin comprometer la salud ni el carácter.',
  },
  {
    title: 'Acompañamiento',
    description:
      'Ofrecemos asesoramiento personalizado antes, durante y después de la adopción. Tu cachorro siempre tendrá nuestro apoyo.',
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
            Más de quince años dedicados a la cría responsable del Golden Retriever. Nuestra pasión
            se refleja en cada cachorro que sale de nuestra familia.
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
            className="inline-flex items-center justify-center px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: '#000000', color: '#ece8e1' }}
          >
            Conoce nuestra historia
          </Link>
        </div>
      </div>
    </section>
  )
}
