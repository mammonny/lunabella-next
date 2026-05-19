import type { Metadata } from 'next'
import Link from 'next/link'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: 'Aviso Legal | LunaBella Golden Retriever',
    description:
      'Aviso legal del Criadero de Golden Retriever LunaBella. Datos identificativos del titular y condiciones de uso conforme a la LSSI-CE.',
  }
}

export default function AvisoLegalPage() {
  return (
    <main className="isolate">
      {/* Hero compacto */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-[#ece8e1]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-[1px] bg-gradient-to-r from-[#c9a93d] to-transparent" />
              <span className="text-[#7a6210] text-xs font-medium tracking-[0.3em] uppercase">
                Legal
              </span>
            </div>
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-[1.15]">
              Aviso legal
            </h1>
          </div>
        </div>
      </section>

      <PageBreadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Aviso Legal' },
      ]} />

      {/* Contenido */}
      <section className="py-16 md:py-24 bg-[#ece8e1]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Datos identificativos */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                1. Datos identificativos del titular
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio, de Servicios
                  de la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE), se ponen a
                  disposicion de los usuarios los siguientes datos identificativos del titular del
                  sitio web:
                </p>
                <ul className="space-y-1 pl-1">
                  <li><strong>Razon social:</strong> GAMA KALITATE SL</li>
                  <li><strong>Nombre comercial:</strong> LunaBella Golden Retriever</li>
                  <li><strong>NIF:</strong> B72663669</li>
                  <li><strong>Domicilio social:</strong> Barrio Elbarrena 31, 20247 Zaldibia (Gipuzkoa), Espana</li>
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:maria@lunabella.es" className="text-[#7a6210] hover:underline">
                      maria@lunabella.es
                    </a>
                  </li>
                  <li>
                    <strong>Telefono:</strong>{' '}
                    <a href="tel:+34670004080" className="text-[#7a6210] hover:underline">
                      670 004 080
                    </a>
                  </li>
                  <li><strong>Actividad:</strong> Crianza y comercializacion de perros Golden Retriever</li>
                </ul>
              </div>
            </div>

            {/* Objeto */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                2. Objeto del sitio web
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El presente sitio web tiene como finalidad ofrecer informacion sobre la actividad
                  de cria de Golden Retriever de GAMA KALITATE SL, asi como facilitar el contacto
                  con personas interesadas en nuestros ejemplares y camadas. El acceso al sitio web
                  es gratuito y no requiere registro previo, sin perjuicio de los formularios de
                  contacto que pudieran habilitarse para consultas concretas.
                </p>
              </div>
            </div>

            {/* Condiciones de uso */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                3. Condiciones de uso
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El acceso al sitio web atribuye la condicion de usuario, que acepta las presentes
                  condiciones de uso. El usuario se compromete a hacer un uso adecuado de los
                  contenidos y servicios y a no emplearlos para incurrir en actividades ilicitas,
                  lesivas de derechos o intereses de terceros, o que de cualquier forma puedan
                  danar, inutilizar o sobrecargar el sitio web o impedir su normal utilizacion.
                </p>
                <p>
                  El titular se reserva el derecho a retirar el acceso al sitio web, sin necesidad
                  de previo aviso, a cualquier usuario que contravenga lo dispuesto en este aviso
                  legal.
                </p>
              </div>
            </div>

            {/* Propiedad intelectual */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                4. Propiedad intelectual e industrial
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Todos los contenidos del sitio web (textos, fotografias, logotipos, marcas,
                  graficos, codigo fuente y cualquier otro elemento) son titularidad de GAMA
                  KALITATE SL o de terceros que han autorizado su uso, y estan protegidos por la
                  normativa de propiedad intelectual e industrial.
                </p>
                <p>
                  Queda prohibida la reproduccion, distribucion, comunicacion publica,
                  transformacion o cualquier otra forma de explotacion de los contenidos sin
                  autorizacion expresa por escrito del titular.
                </p>
              </div>
            </div>

            {/* Responsabilidad */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                5. Exclusion de responsabilidad
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El titular realiza sus mejores esfuerzos para que la informacion publicada en el
                  sitio web sea veraz y este actualizada, pero no garantiza la inexistencia de
                  errores ni la disponibilidad continua del servicio. El titular no sera
                  responsable de los danos o perjuicios derivados de interrupciones, virus
                  informaticos, averias telefonicas o desconexiones que impidan temporalmente el
                  acceso al sitio web.
                </p>
              </div>
            </div>

            {/* Enlaces */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                6. Politica de enlaces
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El sitio web puede contener enlaces a paginas de terceros. El titular no asume
                  responsabilidad alguna por el contenido, informaciones o servicios que pudieran
                  aparecer en dichos sitios, que tendran caracter exclusivamente informativo y que
                  en ningun caso implican relacion alguna entre el titular y los responsables de
                  esos sitios web.
                </p>
              </div>
            </div>

            {/* Proteccion de datos */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                7. Proteccion de datos
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El tratamiento de los datos personales que el usuario facilite a traves del sitio
                  web se rige por la{' '}
                  <Link href="/politica-privacidad" className="text-[#7a6210] hover:underline">
                    Politica de Privacidad
                  </Link>
                  . Para informacion sobre el uso de cookies, consulte la{' '}
                  <Link href="/cookies" className="text-[#7a6210] hover:underline">
                    Politica de Cookies
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Modificaciones */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                8. Modificaciones
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  El titular se reserva el derecho a efectuar, sin previo aviso, las modificaciones
                  que considere oportunas en el sitio web, pudiendo cambiar, suprimir o anadir
                  tanto los contenidos y servicios como la forma en que estos aparezcan presentados
                  o localizados.
                </p>
              </div>
            </div>

            {/* Legislacion */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                9. Legislacion aplicable y jurisdiccion
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Las presentes condiciones se rigen por la legislacion espanola. Para la
                  resolucion de cualquier controversia que pudiera derivarse del acceso o uso del
                  sitio web, las partes se someten a los Juzgados y Tribunales del domicilio del
                  titular, salvo que la normativa aplicable disponga otra cosa.
                </p>
              </div>
            </div>

            {/* Actualizacion */}
            <div className="pt-8 border-t border-gray-300">
              <p className="text-neutral-500 text-sm">
                Ultima actualizacion: abril de 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
