import { Access } from 'payload'
import { Usuario } from '../payload-types'

// Tipo específico para el admin UI de Payload
type PayloadAdminUIProps = {
  user: {
    email?: string
    collection?: string
    roles?: string
    [key: string]: any
  } | null
}

// Esta función permite acceso a admins y editores
export const editorAccess: Access = ({ req: { user } }) => {
  // Si no hay usuario, denegar acceso
  if (!user) return false

  // Permitir acceso a admins y editores
  const userRoles = (user as any).roles
  return userRoles === 'admin' || userRoles === 'editor'
}

// Esta función muestra elementos en el admin UI para admins y editores
export const showForEditors = ({ user }: PayloadAdminUIProps): boolean => {
  // Mostrar si es admin o editor
  return Boolean(user && (user.roles === 'admin' || user.roles === 'editor'))
}
