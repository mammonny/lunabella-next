'use client'

import { useState, useEffect } from 'react'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  text: string
  className?: string
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
  const [canShare, setCanShare] = useState(false)
  const [canCopy, setCanCopy] = useState(false) // Estado para saber si se puede copiar
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // navigator.share solo está disponible en contextos seguros (HTTPS) y en el cliente
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href) // Establecer URL siempre en el cliente
      if (typeof navigator.share === 'function') {
        setCanShare(true)
      }
      // Comprobar también si se puede copiar al portapapeles
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        setCanCopy(true)
      }
    }
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: currentUrl,
        })
        console.log('Contenido compartido con éxito')
      } catch (error) {
        console.error('Error al compartir:', error)
        // Mostrar un toast si el usuario cancela o hay un error
        // No mostraremos error si el usuario cancela manualmente (AbortError)
        // Verificar si error es una instancia de Error antes de acceder a .name
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('No se pudo compartir el contenido.')
        } else if (!(error instanceof Error)) {
          // Si no es un Error estándar, mostrar un mensaje genérico
          toast.error('Ocurrió un error inesperado al compartir.')
        }
        // Si es AbortError, no mostramos nada (el usuario canceló)
      }
    } else {
      // Fallback si navigator.share no está disponible (aunque el botón debería estar deshabilitado)
      // Podríamos copiar al portapapeles como alternativa
      try {
        await navigator.clipboard.writeText(currentUrl)
        toast.success('Enlace copiado al portapapeles')
      } catch (err) {
        toast.error('No se pudo copiar el enlace')
        console.error('Error al copiar al portapapeles:', err)
      }
    }
  }

  // Deshabilitar el botón si la API Web Share no está disponible
  // Opcionalmente, podríamos ocultarlo completamente: if (!canShare) return null;
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      disabled={!canShare && !canCopy} // Usar los estados canShare y canCopy
      aria-label="Compartir cachorro"
      className={className}
      title={
        canShare
          ? 'Compartir este cachorro'
          : 'La función de compartir no está disponible en este navegador o contexto. Se copiará el enlace.'
      }
    >
      <Share2 className="h-5 w-5" />
    </Button>
  )
}
