import Image from 'next/image'
import type { Metadata } from 'next'
import CTASection from '@/components/CTASection'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'
import SectionDivider from '@/components/SectionDivider'
import ScrollProgress from '@/components/ScrollProgress'
import TestimonialsGrid from '@/components/Testimonials/testimonialsgrid'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: 'Nosotros - LunaBella Golden Retriever',
    description:
      'Conoce nuestra filosofía de crianza familiar y responsable del Golden Retriever. Más de 15 años dedicados a criar perros sanos, con excelente carácter y fieles al estándar de raza.',
  }
}

const valores = [
  {
    title: 'Crianza familiar',
    description:
      'Nuestros perros viven con nosotros como parte de la familia. No son animales de criadero, son miembros de nuestro hogar.',
  },
  {
    title: 'Selección rigurosa',
    description:
      'Cada cruce está cuidadosamente planificado. Estudiamos genética, morfología y temperamento para garantizar cachorros excepcionales.',
  },
  {
    title: 'Acompañamiento continuo',
    description:
      'Mantenemos contacto con todas las familias. Nos importa el bienestar de cada cachorro durante toda su vida.',
  },
  {
    title: 'Transparencia total',
    description:
      'Abrimos las puertas de nuestra casa. Conoce nuestras instalaciones, nuestros perros y nuestra forma de trabajar.',
  },
]

export default function NosotrosPage() {
  return (
    <>
      <ScrollProgress />

      <main className="isolate">
        {/* Hero Section - Compact Editorial Style (same as nuestros-perros) */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 min-h-[18rem] md:min-h-[28rem] overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/nosotros/cria-etica-golden.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
          {/* Strong gradient overlay for readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                100deg,
                rgba(0, 0, 0, 0.9) 0%,
                rgba(0, 0, 0, 0.75) 40%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
            }}
          />

          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              {/* Ornamental detail */}
              <div className="flex items-center gap-3 mb-5 w-[15rem] animate-fade-in-up">
                <span className="flex-1 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
                <span className="text-[#c9a93d] text-xs font-medium tracking-[0.3em] uppercase">
                  Nuestra historia
                </span>
              </div>

              {/* Título principal */}
              <h1 className="mb-5 text-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] animate-fade-in-up delay-100">
                Nuestra{' '}
                <span className="text-gradient-gold">filosofía</span>
              </h1>

              {/* Descripción */}
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl animate-fade-in-up delay-200">
                Para nosotros ningún perro es &laquo;solo una mascota&raquo;, es el mejor amigo de
                la familia. Por ello críamos Golden Retriever con pasión y un trato familiar.
              </p>
            </div>
          </div>
        </section>

        <PageBreadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Nosotros' },
        ]} />

        {/* Sección Pasión por los Golden Retriever */}
        <section className="relative py-28 md:py-40 bg-white overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20 items-center">
              {/* Imágenes - Layout asimétrico limpio */}
              <div className="xl:col-span-6 order-2 xl:order-1 animate-fade-in-up">
                <div className="flex gap-4 md:gap-6">
                  {/* Columna izquierda - offset hacia abajo */}
                  <div className="flex-1 space-y-4 md:space-y-6 mt-12 md:mt-20">
                    <div className="overflow-hidden">
                      <Image
                        src="/images/nosotros/perros-familiares.jpg"
                        alt="Golden Retriever en familia"
                        width={300}
                        height={400}
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <Image
                        src="/images/nosotros/crianza-familiar.jpg"
                        alt="Crianza familiar de Golden Retriever"
                        width={300}
                        height={250}
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="overflow-hidden">
                      <Image
                        src="/images/nosotros/sociabilizacion2.jpg"
                        alt="Socialización de cachorros Golden"
                        width={300}
                        height={350}
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <Image
                        src="/images/nosotros/golden-retriever-show-ganador.jpg"
                        alt="Golden Retriever campeón en exposición"
                        width={300}
                        height={400}
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div
                className="xl:col-span-5 xl:col-start-8 order-1 xl:order-2 animate-fade-in-up"
                style={{ animationDelay: '0.15s' }}
              >
                {/* Ornamento superior */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-16 h-px bg-[#a58a1b]" />
                  <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                    Nuestra esencia
                  </span>
                </div>

                <h2 className="mb-10 text-display text-4xl lg:text-5xl xl:text-6xl text-gray-900">
                  Pasión por los{' '}
                  <span className="text-gradient-gold">Golden Retriever</span>
                </h2>

                <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Nos dedicamos a la cría familiar del Golden Retriever por nuestra pasión por
                    esta raza. Nos centramos únicamente en ellos: su maravilloso carácter lleno de
                    dulzura y nobleza, sus excelentes cualidades para la convivencia familiar y su
                    gran elegancia y belleza.
                  </p>
                  <p className="text-editorial text-xl text-gray-800">
                    Cada uno de nuestros perros es cruzado bajo un estudio profundamente realizado
                    para que salgan perros sanos y de alta calidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Entorno de Ensueño */}
        <section className="relative py-40 md:py-56 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/nosotros/cria-etica-golden.jpg"
              alt="Entorno natural de LunaBella"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient - matching site style */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  100deg,
                  rgba(0, 0, 0, 0.85) 0%,
                  rgba(0, 0, 0, 0.6) 50%,
                  rgba(165, 138, 27, 0.4) 100%
                )`,
              }}
            />
          </div>

          <div className="relative z-10 container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Ornament */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  Nuestro hogar
                </span>
                <span className="w-16 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-white mb-8">
                Entorno de ensueño
              </h2>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                El caserío donde vivimos está situado en las laderas del Txindoki, un monte
                conocido en el País Vasco donde nuestros perros pueden jugar y ejercitarse en
                libertad.
              </p>
            </div>
          </div>
        </section>

        {/* Sección Valores - Cards como WhyLunaBella */}
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
                Lo que nos{' '}
                <span className="text-gradient-gold">diferencia</span>
              </h2>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                Más de quince años dedicados a la cría responsable del Golden Retriever. Nuestra
                pasión se refleja en cada cachorro que sale de nuestra familia.
              </p>
            </div>

            {/* Cards grid - same style as WhyLunaBella */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {valores.map((valor, idx) => (
                <div
                  key={valor.title}
                  className="group relative bg-white/80 backdrop-blur-sm p-8 lg:p-10 border border-gray-100 transition-all duration-300 hover:border-[#a58a1b]/30 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Subtle gold accent */}
                  <div className="w-10 h-0.5 bg-[#a58a1b] mb-6 transition-all duration-300 group-hover:w-14" />

                  <h3 className="text-xl lg:text-2xl font-heading font-semibold text-gray-900 mb-4">
                    {valor.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-[15px]">{valor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Filosofía - Texto largo */}
        <section className="py-28 md:py-40 bg-white relative overflow-hidden">
          {/* Decorative element */}
          <div
            className="absolute -left-20 top-1/3 w-[300px] h-[210px] opacity-[0.02] pointer-events-none hidden xl:block"
            style={{
              backgroundImage: `url('/silueta-golden.svg')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transform: 'scaleX(-1)',
            }}
          />

          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              {/* Ornamento superior */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  Nuestra historia
                </span>
                <span className="w-16 h-px bg-[#a58a1b]" />
              </div>

              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-12 text-center">
                Nuestra filosofía
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Nuestra forma de disfrutar de la vida parte de la convivencia con nuestros
                  adorados Golden Retrievers. Nos encanta ir de paseo por el monte, visitar San
                  Sebastián y permitir que disfruten del mar y las calles. En muchas ocasiones, no
                  solo nosotros disfrutamos de su belleza y fantástico carácter, sino que muchas
                  personas se nos unen queriendo acercarse y acariciar a estos perros tan empáticos
                  y dulces.
                </p>

                <p>
                  En todo nuestro tiempo libre, ya sean exposiciones o vacaciones, siempre estamos
                  acompañados por nuestros perros, y tratamos de transmitir a las familias que
                  adoptan a uno de nuestros cachorros que deben incorporar a un Golden Retriever en
                  todos los momentos de sus vidas, incluyendo las vacaciones si el viaje lo permite.
                </p>

                {/* Cita destacada - style from site */}
                <div className="my-12 relative">
                  <div className="bg-[#faf8f5] border-l-4 border-[#a58a1b] p-8 md:p-10 relative overflow-hidden">
                    {/* Watermark */}
                    <div
                      className="absolute right-4 bottom-4 w-16 h-11 opacity-[0.06]"
                      style={{
                        backgroundImage: `url('/silueta-golden.svg')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                    <p className="text-editorial text-xl md:text-2xl text-gray-800 leading-relaxed m-0 relative z-10">
                      &ldquo;Tratamos de transmitir a las familias que adoptan a uno de nuestros
                      cachorros que deben incorporarlos en todos los momentos de sus vidas.&rdquo;
                    </p>
                  </div>
                </div>

                <p>
                  Algo que hemos aprendido en nuestros viajes es que el Golden Retriever es muy bien
                  recibido, y nos ha sorprendido muchas veces que incluso en restaurantes o centros
                  comerciales nos han permitido entrar con tres o cuatro Golden Retrievers. Si se
                  educan adecuadamente, los Golden Retrievers tienen la peculiaridad de comportarse
                  como &ldquo;perros alfombra&rdquo; porque se tumban y se comportan de manera muy
                  formal.
                </p>

                <p>
                  Siempre hemos pensado que el Golden Retriever es una raza que solo le falta
                  hablar, aunque nos lo digan todo con su tierna mirada. Creemos firmemente que
                  tienen un gran poder terapéutico y que empatizan como nadie con las personas. La
                  parte que más nos llena de intentar criar esta raza con toda nuestra pasión es que
                  en muchas ocasiones, nuestros cachorros están destinados a niños con autismo o
                  problemas de socialización que encuentran en un Golden Retriever todo el cariño y
                  compañía que necesitan.
                </p>

                <p className="pb-8 border-b border-gray-200">
                  En definitiva, damos mucho valor a conocer a las familias a las que van destinados
                  nuestros perros. Nos gusta saber noticias de las familias. Es una manera de
                  acompañarles en la distancia, siempre desde el cariño que ponemos en todo lo que
                  hacemos.
                </p>

                {/* Imagen de Marco */}
                <div className="my-12 group">
                  <div className="relative">
                    <div className="absolute -inset-4 border border-[#a58a1b]/20 -z-10 transition-all duration-700 group-hover:border-[#a58a1b]/40" />
                    <div
                      className="absolute inset-0 translate-x-6 translate-y-6 -z-20 transition-transform duration-700 group-hover:translate-x-8 group-hover:translate-y-8"
                      style={{ backgroundColor: '#ece8e1' }}
                    />
                    <Image
                      src="/images/nosotros/Golden-Retriever-Marco.jpg"
                      alt="Marco, Golden Retriever de LunaBella en la playa"
                      width={800}
                      height={600}
                      className="w-full object-cover"
                    />
                  </div>
                  <p className="mt-6 text-sm text-gray-500 italic text-center">
                    Marco en uno de nuestros muchos paseos por la playa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección ¿Cómo surge esta dedicación? */}
        <section className="py-28 md:py-40 bg-[#faf8f5] relative overflow-hidden">
          {/* Decorative element */}
          <div
            className="absolute -right-10 bottom-1/4 w-64 h-44 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url('/silueta-golden.svg')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              {/* Ornamento superior */}
              <div className="flex items-center gap-4 mb-12">
                <span className="w-16 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                  Nuestros orígenes
                </span>
              </div>

              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-12">
                ¿Cómo surge esta{' '}
                <span className="text-gradient-gold">dedicación</span>?
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Nuestra dedicación surge por nuestro amor hacia los animales, especialmente por
                  esta raza en particular. Mi marido y yo compartimos la pasión por disfrutar de la
                  vida acompañados de nuestros perros. Cada uno tiene un papel en casa: a Mikel
                  siempre le ha gustado exponer perros, por lo que se ha preocupado por mejorar y
                  aprender más sobre la raza, realizando cursos y documentándose constantemente para
                  dar lo mejor a nuestros perros.
                </p>

                <p>
                  De joven estudié magisterio y siempre me gustó el mundo de la psicología, por lo
                  que disfruto mucho conociendo a las familias que quieren un cachorro Lunabella e
                  intentando empatizar con las diferentes personas que visitan nuestra casa.
                </p>

                <p>
                  Esta dedicación surge en mí debido a mi especial sensibilidad hacia la naturaleza,
                  los animales, el arte, como el ballet y la moda, cosas que me apasionan. Queremos
                  transmitir a nuestros hijos Mateo y Gabriela estos principios y valores
                  familiares. Ellos tienen la suerte de crecer en un entorno lleno de amor, en gran
                  parte gracias a nuestros amados Golden Retrievers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider variant="subtle" />

        {/* Testimonials */}
        <TestimonialsGrid />

        <CTASection
          label="¿Te interesa?"
          title={<>¿Buscas un <span className="text-gradient-gold">cachorro</span>?</>}
          description="Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de nuestros cachorros, nos encantaría conocerte."
          primaryLabel="Ver cachorros"
          primaryHref="/cachorros"
          secondaryLabel="Nuestros Goldens"
          secondaryHref="/nuestros-goldens"
        />
      </main>
    </>
  )
}
