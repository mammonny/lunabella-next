import { Mail, Phone, TrainFrontTunnel, MapPin, QrCode, SquareParking } from 'lucide-react'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { companyInfo } from '@/config/company'
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
    <div id="encuentranos" className="relative isolate bg-white py-24 sm:py-32">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-stone-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-64}
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-64} className="overflow-visible fill-stone-50">
          <path
            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
      <Container>
        <h2 className="text-pretty text-4xl font-semibold tracking-tight  sm:text-5xl">
          Contáctanos
        </h2>
        <p className="mt-2 text-lg/8 text-stone-600 text-lg">
          Ponte en contacto conmigo para conocer más sobre nuestros cachorros.
        </p>
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          {/* Sección de información de contacto - se mantiene intacta */}
          <div className="mb-20 sm:mb-0 lg:mt-6 lg:w-auto lg:flex-row">
            <img alt="" src="/logo-criadero-goizametz.png" className="h-12 w-auto mt-10" />
            <figure className="mt-10">
              <blockquote className="text-lg/8 font-semibold text-pink-950">
                <p>
                  "Cada cachorro que criamos es parte de nuestra familia. Me dedico con pasión a
                  criar cachorros sanos y felices que se convertirán en compañeros leales para toda
                  la vida."
                </p>
              </blockquote>
              <figcaption className="mt-10 flex gap-x-6">
                <img
                  alt=""
                  src="/fotos/elena-uribe.jpg"
                  className="size-12 flex-none rounded-full bg-stone-50"
                />
                <div>
                  <div className="text-base font-semibold text-pink-950">Elena Uribe</div>
                  <div className="text-sm/6 text-stone-600">
                    Criadora profesional de cachorros - Criadero Goiz-Ametz
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>

          {/* Reemplazar el formulario HTML por FormBlock */}
          {/* Reducido padding en móvil (px-4 pt-16 pb-16), ajustado para sm+ */}
          <div className="">
            {contactForm ? (
              <FormBlock enableIntro={false} form={contactForm} blockType="formBlock" />
            ) : (
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <p className="text-stone-500">
                  No se pudo cargar el formulario. Por favor, inténtalo de nuevo más tarde.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
