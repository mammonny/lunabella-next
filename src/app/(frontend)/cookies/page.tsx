import type { Metadata } from 'next'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: 'Politica de Cookies | LunaBella Golden Retriever',
    description:
      'Politica de cookies del Criadero de Golden Retriever LunaBella. Informacion sobre el uso de cookies en nuestro sitio web.',
  }
}

export default function CookiesPage() {
  return (
    <main className="isolate">
      {/* Hero compacto */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-[#ece8e1]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
              <span className="text-[#a58a1b] text-xs font-medium tracking-[0.3em] uppercase">
                Legal
              </span>
            </div>
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-[1.15]">
              Politica de cookies
            </h1>
          </div>
        </div>
      </section>

      <PageBreadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Política de Cookies' },
      ]} />

      {/* Contenido */}
      <section className="py-16 md:py-24 bg-[#ece8e1]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Que son las cookies */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                1. Que son las cookies
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Las cookies son pequenos archivos de texto que los sitios web almacenan en su
                  dispositivo (ordenador, tablet o movil) cuando los visita. Su funcion principal es
                  permitir que el sitio web recuerde sus preferencias y mejorar su experiencia de
                  navegacion.
                </p>
                <p>
                  Las cookies no contienen virus ni programas maliciosos, y no pueden acceder a la
                  informacion almacenada en su dispositivo.
                </p>
              </div>
            </div>

            {/* Cookies que utilizamos */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                2. Cookies que utilizamos
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-2">
                    Cookies tecnicas o necesarias
                  </h3>
                  <p>
                    Son imprescindibles para el correcto funcionamiento del sitio web. Permiten la
                    navegacion y el uso de funciones basicas como el acceso a areas seguras. Sin estas
                    cookies, el sitio web no puede funcionar correctamente.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-2">
                    Cookies analiticas
                  </h3>
                  <p>
                    Nos permiten conocer como interactuan los usuarios con el sitio web, recopilando
                    informacion de forma anonima. Esta informacion nos ayuda a mejorar el
                    funcionamiento y los contenidos del sitio. Si se utilizan servicios de analitica de
                    terceros (como Google Analytics), estos podrian establecer sus propias cookies.
                  </p>
                </div>
              </div>
            </div>

            {/* Como gestionar las cookies */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                3. Como gestionar las cookies
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Usted puede configurar su navegador para aceptar, rechazar o eliminar las cookies.
                  A continuacion le indicamos como hacerlo en los navegadores mas habituales:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google Chrome:</strong> Configuracion &gt; Privacidad y seguridad &gt;
                    Cookies y otros datos de sitios.
                  </li>
                  <li>
                    <strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt;
                    Cookies y datos del sitio.
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Gestionar datos de
                    sitios web.
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong> Configuracion &gt; Privacidad, busqueda y
                    servicios &gt; Cookies.
                  </li>
                </ul>
                <p>
                  Tenga en cuenta que si deshabilita las cookies, es posible que algunas funciones del
                  sitio web no esten disponibles o no funcionen correctamente.
                </p>
              </div>
            </div>

            {/* Responsable */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                4. Responsable del tratamiento
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>
                  <strong>Razon social:</strong> GAMA KALITATE SL
                </p>
                <p>
                  <strong>NIF:</strong> B72663669
                </p>
                <p>
                  <strong>Domicilio:</strong> Barrio Elbarrena 31, 20247 Zaldibia (Gipuzkoa), Espana
                </p>
                <p>
                  <strong>Email de contacto:</strong>{' '}
                  <a href="mailto:maria@lunabella.es" className="text-[#a58a1b] hover:underline">
                    maria@lunabella.es
                  </a>
                </p>
              </div>
            </div>

            {/* Mas informacion */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                5. Mas informacion
              </h2>
              <div className="text-neutral-700 leading-relaxed">
                <p>
                  Para obtener mas informacion sobre como tratamos sus datos personales, consulte
                  nuestra{' '}
                  <Link
                    href="/politica-privacidad"
                    className="text-[#a58a1b] hover:underline"
                  >
                    Politica de Privacidad
                  </Link>
                  . Si tiene alguna duda o consulta, puede contactarnos en{' '}
                  <a href="mailto:maria@lunabella.es" className="text-[#a58a1b] hover:underline">
                    maria@lunabella.es
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Actualizacion */}
            <div className="pt-8 border-t border-gray-300">
              <p className="text-neutral-500 text-sm">
                Ultima actualizacion: febrero de 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
