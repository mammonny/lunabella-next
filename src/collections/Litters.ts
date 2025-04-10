import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug' // Asumiendo que tienes un slugField reutilizable
import { isAdminOrEditor } from '../access/isAdminOrEditor' // Asumiendo acceso similar a otras colecciones
import { authenticatedOrPublished } from '../access/authenticatedOrPublished' // O el acceso de lectura que prefieras
import { collectionAccess } from '../access/hideFromEditor' // Para ocultar si es necesario

export const Litters: CollectionConfig = {
  slug: 'litters',
  access: {
    create: isAdminOrEditor,
    delete: isAdminOrEditor,
    read: authenticatedOrPublished, // O simplemente 'anyone' si las camadas son públicas
    update: isAdminOrEditor,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'father', 'mother', 'birthDate', 'updatedAt'],
    // hidden: ({ user }) => !collectionAccess('litters')({ user }), // Descomentar si necesitas ocultar por rol
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
