import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Container } from '../Container/container'

export default async function ContactSection2() {
  // Consultar el formulario de contacto
  let contactForm = null
  try {
    const payload = await getPayload({ config: configPromise })
    const forms = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Contact Form',
        },
      },
    })

    if (forms.docs && forms.docs.length > 0) {
      // Asegurarse de que confirmationType sea un valor válido
      const formData = forms.docs[0]
      // Verificar que formData existe antes de acceder a sus propiedades
      if (formData) {
        // Crear una copia del objeto para evitar modificar el original
        const formDataCopy = { ...formData }
        if (formDataCopy.confirmationType === null || formDataCopy.confirmationType === undefined) {
          formDataCopy.confirmationType = 'message'
        }
        contactForm = formDataCopy as unknown as FormType
      }
    }
  } catch (error) {
    console.error('Error al obtener el formulario de contacto:', error)
  }

  return (
    <section id="contacto" className="relative isolate py-28 md:py-40 overflow-hidden bg-[#faf8f5]">
      {/* Subtle decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0v100M0 50h100' stroke='%23a58a1b' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }}
      />

      <Container>
        {/* Header with editorial style */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-16 h-px bg-[#a58a1b]" />
            <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
              Contacto
            </span>
          </div>

          <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
            ¿Quieres saber más sobre{' '}
            <span className="text-gradient-gold">LunaBella</span>?
          </h2>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
            Ponte en contacto con nosotros para conocer más sobre nuestros Golden Retriever,
            cachorros disponibles o próximas camadas.
          </p>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Información de contacto - LunaBella */}
          <div>
            {/* Logo LunaBella */}
            <div className="mb-12">
              <span
                className="font-heading text-4xl text-gray-900 tracking-tight"
              >
                LunaBella<sup className="text-xs align-super ml-0.5">®</sup>
              </span>
            </div>

            <figure className="relative pl-8 border-l-2 border-[#a58a1b]/30">
              <blockquote className="text-xl font-heading italic text-gray-800 leading-relaxed">
                <p>
                  &ldquo;Cada cachorro que criamos es parte de nuestra familia. Nos dedicamos con
                  pasión a criar Golden Retriever sanos, equilibrados y felices que se convertirán
                  en compañeros leales para toda la vida.&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-10 flex gap-x-5 items-center">
                <div
                  className="w-14 h-14 flex-none flex items-center justify-center"
                  style={{ backgroundColor: '#a58a1b' }}
                >
                  <span className="font-heading text-xl text-[#ece8e1]">LB</span>
                </div>
                <div>
                  <div className="font-heading font-semibold text-lg text-gray-900">
                    María Oruna y Mikel Aldanondo
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Criadores de Golden Retriever
                  </div>
                </div>
              </figcaption>
            </figure>

            {/* Contact details */}
            <div className="mt-14 space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <svg className="w-5 h-5 text-[#a58a1b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>País Vasco, España</span>
              </div>
              <a href="tel:+34670004089" className="flex items-center gap-4 text-gray-600 hover:text-[#a58a1b] transition-colors duration-300">
                <svg className="w-5 h-5 text-[#a58a1b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span>670 004 089</span>
              </a>
              <a href="mailto:maria@lunabella.es" className="flex items-center gap-4 text-gray-600 hover:text-[#a58a1b] transition-colors duration-300">
                <svg className="w-5 h-5 text-[#a58a1b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span>maria@lunabella.es</span>
              </a>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div
            className="relative bg-white p-8 sm:p-10 lg:p-12"
            style={{
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(165,138,27,0.08)'
            }}
          >
            {/* Golden corner accent */}
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden pointer-events-none">
              <div
                className="absolute top-0 left-0 w-[1px] h-16 origin-top"
                style={{ backgroundColor: '#a58a1b' }}
              />
              <div
                className="absolute top-0 left-0 w-16 h-[1px] origin-left"
                style={{ backgroundColor: '#a58a1b' }}
              />
            </div>

            {/* Bottom right corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
              <div
                className="absolute bottom-0 right-0 w-[1px] h-16 origin-bottom"
                style={{ backgroundColor: '#a58a1b' }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-[1px] origin-right"
                style={{ backgroundColor: '#a58a1b' }}
              />
            </div>

            {/* Form header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="golden-silhouette-sm opacity-60" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.3em] uppercase">
                  Formulario
                </span>
              </div>
              <h2 className="text-display text-2xl sm:text-3xl text-gray-900 mb-3">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Completa el formulario y te responderemos en las próximas 24-48 horas.
              </p>
            </div>

            {contactForm ? (
              <div className="contact-form-wrapper">
                <FormBlock enableIntro={false} form={contactForm} blockType="formBlock" />
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="golden-silhouette mx-auto mb-6 opacity-20" />
                <p className="text-gray-500 mb-6">
                  El formulario no está disponible en este momento.
                </p>
                <a
                  href="mailto:maria@lunabella.es"
                  className="inline-flex items-center gap-3 text-[#a58a1b] hover:gap-4 transition-all duration-300"
                >
                  <span className="text-sm font-medium tracking-wider uppercase">
                    Escríbenos directamente
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
