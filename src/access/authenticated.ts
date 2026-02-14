import type { AccessArgs } from 'payload'

import type { Usuario } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<Usuario>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
