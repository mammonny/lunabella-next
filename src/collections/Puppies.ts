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
import type { Cachorro } from '../payload-types'

const revalidatePuppy: CollectionAfterChangeHook<Cachorro> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const indexPath = '/cachorros'

    if (doc._status === 'published') {
      const path = `/cachorros/${doc.slug}`
      payload.logger.info(`Revalidating puppy at path: ${path}`)
      revalidatePath(path)
      revalidatePath(indexPath)
      revalidateTag('puppies-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/cachorros/${previousDoc.slug}`
      payload.logger.info(`Revalidating old puppy at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidatePath(indexPath)
      revalidateTag('puppies-sitemap')
    }
  }
  return doc
}

const revalidatePuppyDelete: CollectionAfterDeleteHook<Cachorro> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/cachorros/${doc?.slug}`)
    revalidatePath('/cachorros')
    revalidateTag('puppies-sitemap')
  }
  return doc
}

export const Puppies: CollectionConfig = {
  slug: 'cachorros',
  labels: {
    singular: 'Cachorro',
    plural: 'Cachorros',
  },
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'gender', 'price', 'disponibilidad', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('cachorros')({ user }),
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
      relationTo: 'razas',
      required: true,
      label: 'Raza',
      admin: {
        hidden: true,
      },
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
          relationTo: 'ejemplares',
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
          relationTo: 'ejemplares',
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
      name: 'litter',
      type: 'relationship',
      relationTo: 'camadas',
      required: false, // Opcional, como se definió en el plan
      label: 'Camada',
      admin: {
        description: 'Selecciona la camada a la que pertenece este cachorro (opcional).',
      },
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
      label: 'Publicado el',
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
            collection: 'razas',
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
    afterChange: [revalidatePuppy],
    afterDelete: [revalidatePuppyDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
