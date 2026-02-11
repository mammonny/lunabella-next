import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'instagramAccessToken',
      type: 'text',
      label: 'Instagram Access Token',
      admin: {
        description: 'Se renueva automáticamente via cron. No editar manualmente.',
        readOnly: true,
      },
    },
    {
      name: 'instagramTokenExpiresAt',
      type: 'date',
      label: 'Instagram Token Expires At',
      admin: {
        description: 'Fecha de expiración del token de Instagram.',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
