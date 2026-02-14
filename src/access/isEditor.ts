import { Usuario } from '../payload-types'

export const isEditor = (user?: Usuario): boolean => {
  return Boolean(user && (user as any).roles === 'editor')
}
