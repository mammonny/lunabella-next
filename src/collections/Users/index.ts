import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminOnly } from '../../access/adminOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: adminOnly,
    delete: adminOnly,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    hidden: ({ user }) => (user as any)?.roles !== 'admin',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: false,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      admin: {
        description:
          'Selecciona el rol del usuario. Los editores solo pueden acceder a Dogs y Exhibitions.',
        position: 'sidebar',
      },
      access: {
        // Solo los administradores pueden cambiar roles
        update: ({ req }) => {
          return (req.user as any)?.roles === 'admin'
        },
      },
    },
  ],
  timestamps: true,
}
