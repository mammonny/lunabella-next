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

/**
 * Función para controlar la visibilidad de colecciones en el panel de administración
 *
 * @param collection Nombre de la colección
 * @returns Función que determina si la colección debe ser visible para el usuario
 */
export const collectionAccess = (collection: string) => {
  return ({ user }: PayloadAdminUIProps): boolean => {
    // Si no hay usuario, ocultar todo
    if (!user) return false

    // Si el usuario es admin, mostrar todo
    if (user.roles === 'admin') return true

    // Si el usuario es editor, mostrar Dogs, Breeds y Exhibitions
    if (user.roles === 'editor') {
      return collection === 'dogs' || collection === 'breeds' || collection === 'exhibitions'
    }

    // Para otros usuarios, ocultar todo
    return false
  }
}
