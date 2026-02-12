import type { Metadata } from 'next'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'
import InstagramFeed from '@/components/InstagramFeed'
import CTASection from '@/components/CTASection'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: 'Galería - LunaBella Golden Retriever',
    description:
      'Descubre los momentos más especiales de nuestros Golden Retrievers. Galería de fotos y actualizaciones de Instagram de LunaBella.',
    openGraph: {
      title: 'Galería - LunaBella Golden Retriever',
      description:
        'Descubre los momentos más especiales de nuestros Golden Retrievers. Galería de fotos y actualizaciones de Instagram.',
    },
  }
}

export default function GaleriaPage() {
  return (
    <main className="isolate">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 min-h-[26rem] md:min-h-[30rem] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/landscape.jpg')`,
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
                Echa un vistazo
              </span>
            </div>

            {/* Título principal */}
            <h1 className="mb-5 text-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] animate-fade-in-up delay-100">
              Momentos <span className="text-gradient-gold">LunaBella</span>
            </h1>

            {/* Descripción */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl animate-fade-in-up delay-200">
              Últimas actualizaciones de nuestras redes sociales. Descubre el día a día de nuestros
              Golden Retrievers.
            </p>
          </div>
        </div>
      </section>

      <PageBreadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Galería' },
      ]} />

      {/* Instagram Feed Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-16">
            <div className="flex items-center gap-4">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-[#a58a1b]/20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900">
                <span className="text-gradient-gold font-bold">#</span>lunabella
              </h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed md:ml-auto max-w-xl">
              Síguenos en Instagram para ver más fotos y videos de nuestros Golden Retrievers.
            </p>
          </div>

          {/* Instagram Feed */}
          <InstagramFeed />

          {/* Instagram CTA */}
          <div className="mt-16 flex justify-center">
            <a
              href="https://www.instagram.com/lunabella_goldenretriever/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      <CTASection
        label="¿Te gustaría conocernos?"
        title={<>¿Buscas un <span className="text-gradient-gold">cachorro</span>?</>}
        description="Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de nuestros cachorros, nos encantaría conocerte."
        primaryLabel="Ver cachorros disponibles"
        primaryHref="/cachorros"
        secondaryLabel="Contactar"
        secondaryHref="/contacto"
      />
    </main>
  )
}
