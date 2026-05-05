import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Access, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Pagina, Publicacione } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const isAdmin: Access = ({ req: { user } }) => (user as any)?.roles === 'admin'
const hideFromEditor = ({ user }: { user: any }) => user?.roles !== 'admin'

const generateTitle: GenerateTitle<Publicacione | Pagina> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Publicacione | Pagina> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['paginas', 'publicaciones'],
    overrides: {
      access: {
        create: isAdmin,
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        hidden: hideFromEditor,
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categorias'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      access: {
        create: isAdmin,
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        hidden: hideFromEditor,
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      access: {
        create: () => true,
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        hidden: hideFromEditor,
      },
    },
  }),
  searchPlugin({
    collections: ['publicaciones'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      access: {
        create: isAdmin,
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        hidden: hideFromEditor,
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
  mcpPlugin({
    collections: {
      paginas: { description: 'Páginas del sitio (layout builder).', enabled: true },
      publicaciones: { description: 'Entradas del blog.', enabled: true },
      razas: { description: 'Razas caninas.', enabled: true },
      ejemplares: { description: 'Ejemplares adultos reproductores.', enabled: true },
      cachorros: { description: 'Cachorros disponibles.', enabled: true },
      camadas: { description: 'Camadas que agrupan cachorros.', enabled: true },
      exposiciones: { description: 'Exposiciones caninas.', enabled: true },
      media: { description: 'Archivos e imágenes subidos.', enabled: true },
      categorias: { description: 'Categorías de blog (anidadas).', enabled: true },
      usuarios: { description: 'Usuarios admin.', enabled: true },
    },
    globals: {
      header: { description: 'Configuración de cabecera del sitio.', enabled: true },
      footer: { description: 'Configuración del pie del sitio.', enabled: true },
      'site-settings': { description: 'Ajustes generales del sitio.', enabled: true },
    },
  }),
]
