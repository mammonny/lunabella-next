import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug' // Asumiendo que tienes un slugField reutilizable
import { adminOnly } from '../access/adminOnly'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { collectionAccess } from '../access/hideFromEditor'

export const Litters: CollectionConfig = {
  slug: 'litters',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: authenticatedOrPublished,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'father', 'mother', 'birthDate', 'updatedAt'],
    hidden: ({ user }) => !collectionAccess('litters')({ user }),
    description: 'Colección para gestionar las camadas de cachorros.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre/Identificador de la Camada',
      admin: {
        description: 'Ejemplo: Camada Pastor Alemán 2025-08',
      },
    },
    {
      name: 'father',
      type: 'relationship',
      relationTo: 'dogs',
      required: true,
      label: 'Padre (Macho)',
      filterOptions: {
        // Asegurar que solo se puedan seleccionar machos
        gender: {
          equals: 'male',
        },
      },
      admin: {
        description: 'Selecciona el perro macho padre de la camada.',
      },
    },
    {
      name: 'mother',
      type: 'relationship',
      relationTo: 'dogs',
      required: true,
      label: 'Madre (Hembra)',
      filterOptions: {
        // Asegurar que solo se puedan seleccionar hembras
        gender: {
          equals: 'female',
        },
      },
      admin: {
        description: 'Selecciona la perra hembra madre de la camada.',
      },
    },
    {
      name: 'birthDate',
      type: 'date',
      label: 'Fecha de Nacimiento (Camada)',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    {
      name: 'description',
      type: 'richText', // O 'textarea' si prefieres texto simple
      label: 'Descripción / Notas',
    },
    // Añadimos el campo slug basado en el nombre
    ...slugField('name'), // Usamos el helper slugField, expandiendo el array que devuelve
  ],
  timestamps: true, // Habilita createdAt y updatedAt automáticamente
}
