import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración del Sitio',
  access: {
    // Contiene el token de Instagram: nunca debe ser legible por la API pública.
    // Las rutas internas (feed y cron) usan la API local, que ignora este control.
    read: ({ req: { user } }) => (user as any)?.roles === 'admin',
    update: ({ req: { user } }) => (user as any)?.roles === 'admin',
  },
  admin: {
    hidden: ({ user }) => (user as any)?.roles !== 'admin',
  },
  fields: [
    {
      name: 'instagramAccessToken',
      type: 'text',
      label: 'Instagram Access Token',
      access: {
        read: ({ req: { user } }) => (user as any)?.roles === 'admin',
      },
      admin: {
        description:
          'Un cron diario lo verifica y avisa por email a los admins si deja de funcionar o está a punto de caducar.',
        readOnly: true,
      },
    },
    {
      name: 'instagramTokenExpiresAt',
      type: 'date',
      label: 'Instagram Token Expires At',
      admin: {
        description: 'Fecha en la que el token dejará de funcionar (vacío = nunca).',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
