import { Access } from 'payload'
import { Usuario } from '../payload-types'

// Esta función verifica si el usuario es admin o editor
export const isAdminOrEditor: Access = ({ req }) => {
  // Si no hay usuario, no tiene acceso
  if (!req.user) return false

  // Verificamos el rol del usuario
  const userRoles = (req.user as any).roles

  // Permitir acceso a usuarios con rol admin o editor
  return userRoles === 'admin' || userRoles === 'editor'
}
