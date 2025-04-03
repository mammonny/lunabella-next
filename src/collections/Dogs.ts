import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { anyone } from '../access/anyone'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { editorAccess, showForEditors } from '../access/editorAccess'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { collectionAccess } from '../access/hideFromEditor'

export const Dogs: CollectionConfig = {
  slug: 'dogs',
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'breed', 'gender', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('dogs')({ user }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del Ejemplar',
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
              name: 'height',
              type: 'number',
              required: true,
              label: 'Altura (cm)',
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
        {
          label: 'Pedigree',
          fields: [
            {
              name: 'pedigreeNumber',
              type: 'text',
              label: 'Número de Pedigree',
            },
            {
              name: 'pedigreeDocument',
              type: 'upload',
              relationTo: 'media',
              label: 'Documento de Pedigree',
            },
            {
              name: 'parents',
              type: 'group',
              label: 'Padres',
              fields: [
                {
                  name: 'father',
                  type: 'text',
                  label: 'Padre',
                },
                {
                  name: 'mother',
                  type: 'text',
                  label: 'Madre',
                },
              ],
            },
            {
              name: 'breeder',
              type: 'text',
              label: 'Criador',
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
