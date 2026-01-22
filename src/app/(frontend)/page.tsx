import Image from 'next/image'
import { Hero } from '@/components/Hero/Hero'
import WhyLunaBella from '@/components/WhyLunaBella'
import ContactSection2 from '@/components/ContactSection2/contact'
import CTAConditional from '@/components/CTAConditional'
import Link from 'next/link'
import TestimonialsGrid from '@/components/Testimonials/testimonialsgrid'
import SectionDivider from '@/components/SectionDivider'
import ScrollProgress from '@/components/ScrollProgress'

// Silueta Golden Retriever dorada para LunaBella
const GoldenIcon = ({ className }: { className?: string }) => (
  <span className={`golden-silhouette-sm ${className || ''}`} />
)

const features = [
  {
    name: 'Salud',
    description: 'criar perros genéticamente testados y sanos',
  },
  {
    name: 'Carácter',
    description: 'socializar excelentes perros de familia',
  },
  {
    name: 'Belleza',
    description: 'fieles al estándar oficial de la raza',
  },
]

const HomePage3 = () => (
  <>
    {/* Scroll Progress Indicator */}
    <ScrollProgress />

    <main className="isolate">
      <Hero
        variant="lunabella"
        title={<>Cría familiar, responsable y exclusiva de <span className="bg-gradient-to-r from-[#c9a93d] to-[#a58a1b] bg-clip-text text-transparent">Golden Retriever</span></>}
        description=""
        imageSrc="/images/lunabella/hero-bg.jpg"
        imageAlt="Golden Retriever en LunaBella"
        quote={{
          text: 'Una forma ética de entender la crianza del Golden Retriever.',
          author: 'María Oruna y Mikel Aldanondo',
        }}
        ctaButtons={{
          primary: { label: 'Nuestros perros', href: '/nuestros-perros' },
          secondary: { label: 'Conócenos', href: '#quiensomos' },
        }}
      />

      {/* Sección Filosofía - Editorial Asymmetric Layout */}
      <section id="quiensomos" className="relative py-32 xl:py-44 bg-white overflow-hidden">
        {/* Decorative background element - Golden Retriever silhouette */}
        <div
          className="absolute top-1/4 right-0 w-80 h-56 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url('/silueta-golden.svg')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20 items-center">
            {/* Imagen con tratamiento editorial */}
            <div className="xl:col-span-5 xl:col-start-1 order-2 xl:order-1">
              <div className="relative">
                {/* Frame decorativo */}
                <div
                  className="absolute -inset-4 border border-[#a58a1b]/20 -z-10 transition-all duration-700 hover:border-[#a58a1b]/40"
                />
                {/* Sombra offset */}
                <div
                  className="absolute inset-0 translate-x-6 translate-y-6 -z-20 transition-transform duration-700"
                  style={{ backgroundColor: '#ece8e1' }}
                />
                <Image
                  src="/images/lunabella/filosofia.jpg"
                  alt="Crianza ética de Golden Retriever en Goiz-Ametz"
                  width={560}
                  height={700}
                  className="relative w-full object-cover aspect-[4/5]"
                />
                {/* Badge flotante */}
                <div
                  className="absolute -bottom-6 -right-6 xl:-right-12 bg-[#a58a1b] text-[#ece8e1] px-6 py-4 z-10"
                >
                  <span className="block text-3xl font-heading font-semibold">+15</span>
                  <span className="text-xs uppercase tracking-[0.2em]">Años</span>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="xl:col-span-6 xl:col-start-7 order-1 xl:order-2">
              {/* Ornamento superior */}
              <div className="flex items-center gap-4 mb-8">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  Nuestra esencia
                </span>
              </div>

              <h2 className="mb-10 text-display text-4xl lg:text-5xl xl:text-6xl text-gray-900">
                Filosofía de{' '}
                <span className="text-gradient-gold">crianza</span>
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Para nosotros, el perro es una parte importantísima en la familia. Nuestra vida es
                  perfecta cuando la compartimos con nuestros Golden Retriever.
                </p>
                <p className="text-editorial text-xl text-gray-800">
                  Criamos para familias como la nuestra; que vivan y disfruten de sus perros tanto
                  o más que nosotros.
                </p>
              </div>

              {/* Features con diseño refinado */}
              <div className="mt-12 space-y-5">
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className="group flex items-start gap-4 p-4 -mx-4 rounded-sm transition-all duration-300 hover:bg-[#faf8f5]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#a58a1b]/30 rounded-full group-hover:bg-[#a58a1b] group-hover:border-[#a58a1b] transition-all duration-300">
                      <span className="text-[#a58a1b] text-xs font-semibold group-hover:text-[#ece8e1] transition-colors duration-300">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="font-heading font-semibold text-lg text-gray-900">
                        {feature.name}
                      </span>
                      <span className="text-gray-500 mx-2">—</span>
                      <span className="text-gray-600">{feature.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-14">
                <Link
                  href="/nosotros"
                  className="group inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-900 hover:text-[#a58a1b] transition-colors duration-300"
                >
                  <span>Conoce nuestra historia</span>
                  <span className="w-12 h-px bg-current transition-all duration-300 group-hover:w-16" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Condicional - muestra según disponibilidad de cachorros/camadas */}
      <CTAConditional />

      <WhyLunaBella />

      {/* Elegant section divider with Golden silhouette */}
      <SectionDivider variant="subtle" />

      <TestimonialsGrid />
      <ContactSection2 />
    </main>
  </>
)
export default HomePage3
