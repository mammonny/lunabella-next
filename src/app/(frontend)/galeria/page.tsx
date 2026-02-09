import Link from 'next/link'
import type { Metadata } from 'next'
import InstagramFeed from '@/components/InstagramFeed'

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
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-[#1a1a1a]">
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(165, 138, 27, 0.2) 100%
            )`,
          }}
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Ornamental detail */}
            <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
              <span className="w-10 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
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

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#a58a1b] transition-colors">
              Inicio
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Galería</span>
          </nav>
        </div>
      </div>

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

      {/* CTA Section */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-lunabella-diagonal">
        <div className="relative container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="w-16 h-px bg-[#a58a1b]" />
              <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                ¿Te gustaría conocernos?
              </span>
              <span className="w-16 h-px bg-[#a58a1b]" />
            </div>

            <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
              ¿Buscas un <span className="text-gradient-gold">cachorro</span>?
            </h2>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Si estás interesado en formar parte de nuestra familia y darle un hogar a uno de
              nuestros cachorros, nos encantaría conocerte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cachorros"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundColor: '#000000', color: '#ece8e1' }}
              >
                Ver cachorros disponibles
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
              <Link href="/contacto" className="btn-lunabella-outline">
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
