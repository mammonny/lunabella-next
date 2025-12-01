import { Mail, Phone, TrainFrontTunnel, MapPin, QrCode, SquareParking } from 'lucide-react'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { companyInfo } from '@/config/company'

export default async function FormularioPayload() {
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
    <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
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
  )
}
