import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { anyone } from '../access/anyone'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { editorAccess, showForEditors } from '../access/editorAccess'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { collectionAccess } from '../access/hideFromEditor'

export const Puppies: CollectionConfig = {
  slug: 'puppies',
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'breed', 'gender', 'price', 'status', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('puppies')({ user }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del Cachorro',
    },
    {
      name: 'breed',
      type: 'relationship',
      relationTo: 'breeds',
      required: true,
      label: 'Raza',
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Macho',
          value: 'male',
        },
        {
          label: 'Hembra',
          value: 'female',
        },
      ],
      label: 'Género',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Precio (€)',
    },
    {
      name: 'disponibilidad',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Disponible',
          value: 'available',
        },
        {
          label: 'Reservado',
          value: 'reserved',
        },
        {
          label: 'Vendido',
          value: 'sold',
        },
      ],
      defaultValue: 'available',
      label: 'Estado',
    },
    {
      name: 'likes',
      type: 'number',
      label: 'Me Gusta',
      defaultValue: 0,
      admin: {
        readOnly: true, // Para que no se edite manualmente en el admin
      },
    },
    {
      name: 'parents',
      type: 'group',
      label: 'Padres',
      fields: [
        {
          name: 'father',
          type: 'relationship',
          relationTo: 'dogs',
          label: 'Padre',
          filterOptions: {
            gender: {
              equals: 'male',
            },
          },
        },
        {
          name: 'mother',
          type: 'relationship',
          relationTo: 'dogs',
          label: 'Madre',
          filterOptions: {
            gender: {
              equals: 'female',
            },
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información Básica',
          fields: [
            {
              name: 'birthDate',
              type: 'date',
              required: true,
              label: 'Fecha de Nacimiento',
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              label: 'Descripción',
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Imagen Principal',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galería de Imágenes',
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
          label: 'Características',
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              label: 'Color',
            },
            {
              name: 'weight',
              type: 'number',
              required: true,
              label: 'Peso (kg)',
            },
            {
              name: 'specialFeatures',
              type: 'array',
              label: 'Características Especiales',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
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
      ({ data }) => {
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
