import { User } from '../payload-types'

export const isEditor = (user?: User): boolean => {
  return Boolean(user && (user as any).roles === 'editor')
}
