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
    defaultColumns: ['name', 'gender', 'breedingStatus', 'updatedAt'],
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
      admin: {
        hidden: true,
      },
    },
    {
      name: 'breedingStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Retirado', value: 'retired' },
        { label: 'En Memoria', value: 'deceased' },
      ],
      defaultValue: 'active',
      label: 'Estado',
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
      async ({ data, req }) => {
        // Auto-asignar Golden Retriever si no hay breed
        if (!data.breed) {
          const goldenRetriever = await req.payload.find({
            collection: 'breeds',
            where: { slug: { equals: 'golden-retriever' } },
            limit: 1,
          })
          if (goldenRetriever.docs[0]) {
            data.breed = goldenRetriever.docs[0].id
          }
        }

        // Establecer publishedAt cuando se publica
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
