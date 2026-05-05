import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { slugField } from '@/fields/slug'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { collectionAccess } from '../access/hideFromEditor'
import type { Exposicione } from '../payload-types'

const revalidateExhibition: CollectionAfterChangeHook<Exposicione> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const indexPath = '/exposiciones'

    if (doc._status === 'published') {
      const path = `/exposiciones/${doc.slug}`
      payload.logger.info(`Revalidating exhibition at path: ${path}`)
      revalidatePath(path)
      revalidatePath(indexPath)
      revalidateTag('exhibitions-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/exposiciones/${previousDoc.slug}`
      payload.logger.info(`Revalidating old exhibition at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidatePath(indexPath)
      revalidateTag('exhibitions-sitemap')
    }
  }
  return doc
}

const revalidateExhibitionDelete: CollectionAfterDeleteHook<Exposicione> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/exposiciones/${doc?.slug}`)
    revalidatePath('/exposiciones')
    revalidateTag('exhibitions-sitemap')
  }
  return doc
}

export const Exhibitions: CollectionConfig = {
  slug: 'exposiciones',
  labels: {
    singular: 'Exposición',
    plural: 'Exposiciones',
  },
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('exposiciones')({ user }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la Exposicion',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Fecha de la Exposicion',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informacion Basica',
          fields: [
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Imagen Principal',
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              label: 'Descripcion',
            },
            {
              name: 'location',
              type: 'text',
              label: 'Ubicacion',
            },
            {
              name: 'juez',
              type: 'text',
              label: 'Juez',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galeria de Imagenes',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Premios',
          fields: [
            {
              name: 'awards',
              type: 'array',
              label: 'Premios Obtenidos',
              validate: ((value: unknown) => {
                if (!Array.isArray(value)) return true
                for (let i = 0; i < value.length; i++) {
                  const row = value[i] as { dog?: unknown; dogName?: string } | undefined
                  const hasDog = !!row?.dog
                  const hasDogName = typeof row?.dogName === 'string' && row.dogName.trim().length > 0
                  if (!hasDog && !hasDogName) {
                    return `Fila ${i + 1}: indica un Ejemplar o un Nombre del perro (texto libre).`
                  }
                }
                return true
              }) as any,
              fields: [
                {
                  name: 'dog',
                  type: 'relationship',
                  relationTo: 'ejemplares',
                  label: 'Ejemplar',
                  admin: {
                    description:
                      'Selecciona el Ejemplar premiado. Déjalo vacío si el perro no está en el sistema y usa el campo de texto.',
                  },
                },
                {
                  name: 'dogName',
                  type: 'text',
                  label: 'Nombre del perro (texto libre)',
                  admin: {
                    description:
                      'Usar cuando el Ejemplar no esté creado en el sistema. Si más adelante se crea un Ejemplar con este nombre, se enlazará automáticamente.',
                    condition: (_data, siblingData) => !siblingData?.dog,
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titulo/Premio',
                  admin: {
                    description: 'Ej: Mejor de Raza, CAC, CACIB, etc.',
                  },
                },
                {
                  name: 'position',
                  type: 'select',
                  label: 'Posicion',
                  options: [
                    { label: '1er Lugar', value: 'first' },
                    { label: '2do Lugar', value: 'second' },
                    { label: '3er Lugar', value: 'third' },
                    { label: 'Mencion Especial', value: 'special' },
                    { label: 'Otro', value: 'other' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('name'),
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data._status === 'published' && !data.publishedAt) {
          return {
            ...data,
            publishedAt: new Date(),
          }
        }
        return data
      },
    ],
    afterChange: [revalidateExhibition],
    afterDelete: [revalidateExhibitionDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
