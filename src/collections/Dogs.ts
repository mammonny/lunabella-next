import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  Where,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { slugField } from '@/fields/slug'
import { anyone } from '../access/anyone'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { editorAccess, showForEditors } from '../access/editorAccess'
import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { collectionAccess } from '../access/hideFromEditor'
import type { Ejemplare } from '../payload-types'

const autolinkOrphanAwards: CollectionAfterChangeHook<Ejemplare> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc
  if (doc._status !== 'published') return doc

  const candidateNames = [doc.name, doc.apodo].filter(
    (n): n is string => typeof n === 'string' && n.trim().length > 0,
  )
  if (candidateNames.length === 0) return doc

  const where: Where = {
    or: candidateNames.flatMap((n) => [
      { 'awards.dogName': { equals: n } },
      { 'awards.dogName': { like: n } },
    ]),
  }

  const orphanExhibitions = await payload.find({
    collection: 'exposiciones',
    where,
    depth: 0,
    limit: 100,
  })

  for (const exh of orphanExhibitions.docs) {
    let mutated = false
    const newAwards = (exh.awards ?? []).map((award) => {
      if (award.dog) return award
      const free = (award.dogName ?? '').trim().toLowerCase()
      if (!free) return award
      const matches = candidateNames.some((n) => n.trim().toLowerCase() === free)
      if (!matches) return award
      mutated = true
      return { ...award, dog: doc.id }
    })

    if (!mutated) continue

    const ambiguousNames = await payload.find({
      collection: 'ejemplares',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { name: { in: candidateNames } },
        ],
      },
      depth: 0,
      limit: 5,
    })
    if (ambiguousNames.totalDocs > 1) {
      payload.logger.warn(
        `[autolinkOrphanAwards] Multiple Ejemplares match "${candidateNames.join(', ')}", skipping autolink for exhibition "${exh.slug}"`,
      )
      continue
    }

    await payload.update({
      collection: 'exposiciones',
      id: exh.id,
      data: { awards: newAwards },
      context: { disableRevalidate: true },
    })
    payload.logger.info(
      `[autolinkOrphanAwards] Linked ${candidateNames[0]} into exhibition "${exh.slug}"`,
    )
  }

  return doc
}

const revalidateDog: CollectionAfterChangeHook<Ejemplare> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const indexPath = '/nuestros-goldens'

    if (doc._status === 'published') {
      const path = `/nuestros-goldens/${doc.slug}`
      payload.logger.info(`Revalidating dog at path: ${path}`)
      revalidatePath(path)
      revalidatePath(indexPath)
      revalidateTag('dogs-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/nuestros-goldens/${previousDoc.slug}`
      payload.logger.info(`Revalidating old dog at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidatePath(indexPath)
      revalidateTag('dogs-sitemap')
    }
  }
  return doc
}

const revalidateDogDelete: CollectionAfterDeleteHook<Ejemplare> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/nuestros-goldens/${doc?.slug}`)
    revalidatePath('/nuestros-goldens')
    revalidateTag('dogs-sitemap')
  }
  return doc
}

export const Dogs: CollectionConfig = {
  slug: 'ejemplares',
  labels: {
    singular: 'Ejemplar',
    plural: 'Ejemplares',
  },
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished,
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'gender', 'breedingStatus', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('ejemplares')({ user }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del Ejemplar',
    },
    {
      name: 'apodo',
      type: 'text',
      label: 'Apodo',
      admin: {
        description: 'Nombre cariñoso o apodo del perro (opcional)',
      },
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
              label: 'Fecha de Nacimiento',
            },
            {
              name: 'description',
              type: 'richText',
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
              label: 'Color',
            },
            {
              name: 'weight',
              type: 'number',
              label: 'Peso (kg)',
            },
            {
              name: 'height',
              type: 'number',
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
    afterChange: [revalidateDog, autolinkOrphanAwards],
    afterDelete: [revalidateDogDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
