'use client' // Este componente necesita interactuar con el navegador (localStorage, estado)

import React, { useState, useEffect, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { likePuppy } from '@/actions/likePuppy' // Importar la Server Action

interface LikeButtonProps {
  puppyId: string
  initialLikes: number
}

// Helper para gestionar localStorage de forma segura en el cliente
const getLikedPuppies = (): string[] => {
  if (typeof window === 'undefined') return [] // No hacer nada en el servidor
  const likedPuppiesRaw = localStorage.getItem('likedPuppies')
  if (likedPuppiesRaw) {
    try {
      const likedPuppies: unknown = JSON.parse(likedPuppiesRaw)
      if (Array.isArray(likedPuppies) && likedPuppies.every((item) => typeof item === 'string')) {
        return likedPuppies as string[]
      }
    } catch (e) {
      console.error('Error parsing likedPuppies from localStorage', e)
      localStorage.removeItem('likedPuppies') // Limpiar si está corrupto
    }
  }
  return []
}

const addLikedPuppy = (puppyId: string): void => {
  if (typeof window === 'undefined') return
  const likedPuppies = getLikedPuppies()
  if (!likedPuppies.includes(puppyId)) {
    likedPuppies.push(puppyId)
    localStorage.setItem('likedPuppies', JSON.stringify(likedPuppies))
  }
}

export const LikeButton: React.FC<LikeButtonProps> = ({ puppyId, initialLikes }) => {
  const [likeCount, setLikeCount] = useState<number>(initialLikes)
  const [hasLiked, setHasLiked] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  // Efecto para comprobar localStorage al montar el componente
  useEffect(() => {
    const likedPuppies = getLikedPuppies()
    if (likedPuppies.includes(puppyId)) {
      setHasLiked(true)
    }
  }, [puppyId]) // Dependencia puppyId

  const handleLike = () => {
    // No hacer nada si ya le dio like o si la acción está pendiente
    if (hasLiked || isPending) return

    startTransition(async () => {
      const result = await likePuppy(puppyId)
      if (result.success && result.newLikes !== undefined) {
        setLikeCount(result.newLikes)
        setHasLiked(true)
        addLikedPuppy(puppyId) // Guardar en localStorage
      } else {
        // Manejar error (e.g., mostrar toast) - Por ahora solo log
        console.error('Failed to like:', result.error)
        // Podríamos añadir un estado de error para mostrar un mensaje al usuario
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleLike}
      disabled={hasLiked || isPending}
      aria-label={hasLiked ? 'Ya te gusta este cachorro' : 'Dar me gusta a este cachorro'}
      className={`flex items-center p-1 gap-1 ${hasLiked ? 'text-red-500 border-red-300 hover:bg-red-50' : ''}`}
    >
      <Heart
        className={`h-5 w-5 ${hasLiked ? 'fill-red-500' : 'fill-none'}`}
        // fill={hasLiked ? 'currentColor' : 'none'} // Alternativa usando currentColor
      />
      {/* Mostrar contador junto al icono */}
      <span className="text-sm font-medium">{likeCount}</span>
    </Button>
  )
}
