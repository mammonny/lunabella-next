import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { collectionAccess } from '../access/hideFromEditor'

export const Exhibitions: CollectionConfig = {
  slug: 'exhibitions',
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('exhibitions')({ user }),
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
              fields: [
                {
                  name: 'dog',
                  type: 'relationship',
                  relationTo: 'dogs',
                  required: true,
                  label: 'Ejemplar',
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
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
