import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { adminOnly } from '../access/adminOnly'
import { collectionAccess } from '../access/hideFromEditor'

export const Breeds: CollectionConfig = {
  slug: 'razas',
  labels: {
    singular: 'Raza',
    plural: 'Razas',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: authenticatedOrPublished,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('razas')({ user }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la Raza',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información Básica',
          fields: [
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
              name: 'characteristics',
              type: 'array',
              label: 'Características',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
            {
              name: 'temperament',
              type: 'array',
              label: 'Temperamento',
              fields: [
                {
                  name: 'trait',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'size',
              type: 'select',
              options: [
                {
                  label: 'Muy pequeño',
                  value: 'very_small',
                },
                {
                  label: 'Pequeño',
                  value: 'small',
                },
                {
                  label: 'Mediano',
                  value: 'medium',
                },
                {
                  label: 'Grande',
                  value: 'large',
                },
                {
                  label: 'Muy grande',
                  value: 'very_large',
                },
              ],
              label: 'Tamaño',
            },
            {
              name: 'lifeExpectancy',
              type: 'text',
              label: 'Esperanza de Vida',
            },
            {
              name: 'weight',
              type: 'group',
              label: 'Peso Promedio',
              fields: [
                {
                  name: 'min',
                  type: 'number',
                  label: 'Mínimo (kg)',
                },
                {
                  name: 'max',
                  type: 'number',
                  label: 'Máximo (kg)',
                },
              ],
            },
            {
              name: 'height',
              type: 'group',
              label: 'Altura Promedio',
              fields: [
                {
                  name: 'min',
                  type: 'number',
                  label: 'Mínimo (cm)',
                },
                {
                  name: 'max',
                  type: 'number',
                  label: 'Máximo (cm)',
                },
              ],
            },
          ],
        },
        {
          label: 'Cuidados',
          fields: [
            {
              name: 'careInstructions',
              type: 'richText',
              label: 'Cuidados Específicos',
            },
            {
              name: 'groomingNeeds',
              type: 'select',
              options: [
                {
                  label: 'Bajo',
                  value: 'low',
                },
                {
                  label: 'Moderado',
                  value: 'moderate',
                },
                {
                  label: 'Alto',
                  value: 'high',
                },
                {
                  label: 'Muy alto',
                  value: 'very_high',
                },
              ],
              label: 'Necesidades de Aseo',
            },
            {
              name: 'exerciseNeeds',
              type: 'select',
              options: [
                {
                  label: 'Bajo',
                  value: 'low',
                },
                {
                  label: 'Moderado',
                  value: 'moderate',
                },
                {
                  label: 'Alto',
                  value: 'high',
                },
                {
                  label: 'Muy alto',
                  value: 'very_high',
                },
              ],
              label: 'Necesidades de Ejercicio',
            },
            {
              name: 'healthConsiderations',
              type: 'richText',
              label: 'Consideraciones de Salud',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Meta Título',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Meta Descripción',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Meta Imagen',
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
