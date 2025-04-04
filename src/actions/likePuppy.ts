'use server' // Directiva para Server Actions

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'
import type { CollectionSlug } from 'payload' // Importar CollectionSlug
import type { Puppy } from '@/payload-types' // Importar el tipo Puppy generado

export async function likePuppy(
  puppyId: string,
): Promise<{ success: boolean; newLikes?: number; error?: string }> {
  if (!puppyId) {
    return { success: false, error: 'Puppy ID is required' }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Obtener el documento sin especificar tipo genérico aquí
    const doc = await payload.findByID({
      collection: 'puppies' as CollectionSlug,
      id: puppyId,
      depth: 0, // Solo necesitamos likes y slug
    })

    // Verificar si el documento existe
    if (!doc) {
      return { success: false, error: 'Puppy not found' }
    }

    // ASEVERAR el tipo a Puppy aquí, después de confirmar que existe
    const currentPuppy = doc as Puppy

    // Ahora TypeScript debería permitir acceder a .likes y .slug
    const currentLikes = typeof currentPuppy.likes === 'number' ? currentPuppy.likes : 0
    const newLikes = currentLikes + 1

    // Actualizar el cachorro con el nuevo contador de likes
    await payload.update({
      collection: 'puppies' as CollectionSlug,
      id: puppyId,
      data: {
        likes: newLikes,
      },
    })

    // Revalidar la ruta específica del cachorro usando el slug
    if (currentPuppy.slug) {
      revalidatePath(`/puppies/${currentPuppy.slug}`)
    }
    // Considerar también revalidar la página de listado si muestra los likes
    revalidatePath('/puppies')

    return { success: true, newLikes: newLikes }
  } catch (error) {
    console.error('Error liking puppy:', error)
    // Devolver un mensaje de error genérico al cliente por seguridad
    return { success: false, error: 'An internal error occurred while liking the puppy.' }
  }
}
