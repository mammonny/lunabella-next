import type { Metadata } from 'next'
import { PageBreadcrumbs } from '@/components/Breadcrumbs'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: 'Politica de Privacidad | LunaBella Golden Retriever',
    description:
      'Politica de privacidad del Criadero de Golden Retriever LunaBella. Informacion sobre el tratamiento de datos personales conforme al RGPD.',
  }
}

export default function PoliticaPrivacidadPage() {
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
              Politica de privacidad
            </h1>
          </div>
        </div>
      </section>

      <PageBreadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Política de Privacidad' },
      ]} />

      {/* Contenido */}
      <section className="py-16 md:py-24 bg-[#ece8e1]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Responsable */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                1. Responsable del tratamiento
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
                <p>
                  <strong>Telefono:</strong>{' '}
                  <a href="tel:+34670004089" className="text-[#a58a1b] hover:underline">
                    670 004 089
                  </a>
                </p>
                <p>
                  <strong>Actividad:</strong> Crianza y comercializacion de perros Golden Retriever
                </p>
              </div>
            </div>

            {/* Finalidad */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                2. Finalidad del tratamiento
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Los datos personales que nos facilite a traves de nuestros formularios de contacto o
                  por correo electronico seran tratados con las siguientes finalidades:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Gestionar las consultas recibidas sobre nuestros cachorros y ejemplares disponibles.
                  </li>
                  <li>Atender las solicitudes enviadas a traves del formulario de contacto.</li>
                  <li>
                    Enviar informacion relacionada con nuestras camadas y servicios, siempre que usted
                    haya dado su consentimiento para ello.
                  </li>
                </ul>
              </div>
            </div>

            {/* Base legal */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                3. Base legal del tratamiento
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  La base legal para el tratamiento de sus datos es el <strong>consentimiento</strong>{' '}
                  que usted nos otorga al enviarnos sus datos a traves de los formularios de contacto o
                  al comunicarse con nosotros por correo electronico o telefono.
                </p>
                <p>
                  Usted puede retirar su consentimiento en cualquier momento, sin que ello afecte a la
                  licitud del tratamiento basado en el consentimiento previo a su retirada.
                </p>
              </div>
            </div>

            {/* Destinatarios */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                4. Destinatarios de los datos
              </h2>
              <div className="text-neutral-700 leading-relaxed">
                <p>
                  Sus datos personales no seran cedidos a terceros, salvo obligacion legal. No se
                  realizan transferencias internacionales de datos fuera del Espacio Economico Europeo.
                </p>
              </div>
            </div>

            {/* Derechos */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                5. Derechos del interesado
              </h2>
              <div className="text-neutral-700 leading-relaxed space-y-3">
                <p>
                  De conformidad con el Reglamento General de Proteccion de Datos (RGPD), usted tiene
                  derecho a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Acceso:</strong> Solicitar informacion sobre los datos personales que
                    tratamos sobre usted.
                  </li>
                  <li>
                    <strong>Rectificacion:</strong> Solicitar la correccion de datos inexactos o
                    incompletos.
                  </li>
                  <li>
                    <strong>Supresion:</strong> Solicitar la eliminacion de sus datos cuando ya no sean
                    necesarios para la finalidad para la que fueron recogidos.
                  </li>
                  <li>
                    <strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso
                    comun.
                  </li>
                  <li>
                    <strong>Oposicion:</strong> Oponerse al tratamiento de sus datos en determinadas
                    circunstancias.
                  </li>
                  <li>
                    <strong>Limitacion:</strong> Solicitar la limitacion del tratamiento de sus datos en
                    los supuestos previstos en la normativa.
                  </li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, puede dirigirse a nosotros enviando un
                  correo electronico a{' '}
                  <a href="mailto:maria@lunabella.es" className="text-[#a58a1b] hover:underline">
                    maria@lunabella.es
                  </a>
                  , indicando el derecho que desea ejercer y acompanando una copia de su documento de
                  identidad.
                </p>
              </div>
            </div>

            {/* Autoridad de control */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                6. Autoridad de control
              </h2>
              <div className="text-neutral-700 leading-relaxed">
                <p>
                  Si considera que el tratamiento de sus datos personales no se ajusta a la normativa
                  vigente, tiene derecho a presentar una reclamacion ante la{' '}
                  <strong>Agencia Espanola de Proteccion de Datos (AEPD)</strong>, con sede en C/ Jorge
                  Juan, 6 - 28001 Madrid, o a traves de su sede electronica:{' '}
                  <a
                    href="https://www.aepd.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#a58a1b] hover:underline"
                  >
                    www.aepd.es
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Conservacion */}
            <div>
              <h2 className="font-serif text-2xl text-gray-900 mb-4">
                7. Conservacion de los datos
              </h2>
              <div className="text-neutral-700 leading-relaxed">
                <p>
                  Los datos personales proporcionados se conservaran mientras se mantenga la relacion
                  comercial o durante el tiempo necesario para cumplir con las obligaciones legales. Una
                  vez cumplida la finalidad, los datos seran suprimidos conforme a lo dispuesto en la
                  normativa de proteccion de datos.
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
