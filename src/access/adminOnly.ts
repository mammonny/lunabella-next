import { Access } from 'payload'
import { User } from '../payload-types'

// Tipo específico para el admin UI de Payload
type PayloadAdminUIProps = {
  user: {
    email?: string
    collection?: string
    roles?: string
    [key: string]: any
  } | null
}

// Esta función restringe el acceso solo a administradores
export const adminOnly: Access = ({ req: { user } }) => {
  // Si no hay usuario, denegar acceso
  if (!user) return false

  // Solo permitir acceso a usuarios con rol admin
  return (user as any).roles === 'admin'
}

// Esta función oculta elementos en el admin UI para no-admins
export const hideFromNonAdmin = ({ user }: PayloadAdminUIProps): boolean => {
  // Si no hay usuario o no es admin, ocultar
  return !user || user.roles !== 'admin'
}
