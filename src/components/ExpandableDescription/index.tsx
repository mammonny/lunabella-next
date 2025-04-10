'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText' // Asumiendo que RichText puede ser usado en cliente
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface ExpandableDescriptionProps {
  data: any // El objeto de datos para RichText
  collapsedHeightClass?: string // Clase Tailwind para la altura colapsada (ej. 'max-h-40')
}

export function ExpandableDescription({
  data,
  collapsedHeightClass = 'max-h-40', // Altura por defecto colapsada
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [needsExpansionButton, setNeedsExpansionButton] = useState(false) // Nuevo estado
  const contentRef = useRef<HTMLDivElement>(null)
  const initialCheckDone = useRef(false) // Ref para controlar la comprobación inicial

  // Comprobar si el contenido realmente necesita el botón "Leer más"
  useEffect(() => {
    // Usamos un temporizador para dar tiempo al DOM a renderizar completamente, especialmente el RichText
    const timer = setTimeout(() => {
      const current = contentRef.current
      if (current) {
        const doesOverflow = current.scrollHeight > current.clientHeight + 1
        setIsOverflowing(doesOverflow)

        // Establecer si el botón es necesario solo en la comprobación inicial
        if (!initialCheckDone.current) {
          setNeedsExpansionButton(doesOverflow)
          initialCheckDone.current = true
        }
      } else {
        setIsOverflowing(false)
        if (!initialCheckDone.current) {
          setNeedsExpansionButton(false)
          initialCheckDone.current = true
        }
      }
    }, 100) // Pequeño retraso (100ms) para asegurar renderizado

    const handleResize = () => {
      // Al redimensionar, solo actualizamos isOverflowing, no needsExpansionButton
      const current = contentRef.current
      if (current) {
        setIsOverflowing(current.scrollHeight > current.clientHeight + 1)
      } else {
        setIsOverflowing(false)
      }
    }

    // Comprobar inicialmente y al cambiar el tamaño de la ventana
    // Ejecutar al montar y limpiar temporizador
    // No necesitamos checkOverflow aquí porque el timer lo hace
    window.addEventListener('resize', handleResize)

    // Limpiar el listener y el temporizador al desmontar
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
    // Ejecutar solo al montar y cuando cambian los datos o la altura colapsada,
    // pero NO cuando cambia isExpanded para evitar recalcular needsExpansionButton
  }, [data, collapsedHeightClass])

  // Comprobación más robusta: asegurarse de que data tiene la estructura esperada por RichText
  const hasValidRichTextData =
    data && data.root && Array.isArray(data.root.children) && data.root.children.length > 0

  // Si no hay datos válidos, no renderizar nada
  if (!hasValidRichTextData) {
    // Podríamos devolver el fallback de la página aquí, pero es más simple no renderizar nada desde el componente
    // Opcionalmente, podrías mostrar un mensaje como <p>Descripción no disponible.</p>
    return null
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={cn(
          'prose max-w-none overflow-hidden transition-all duration-300 ease-in-out',
          !isExpanded && collapsedHeightClass, // Aplica altura máxima solo si no está expandido
          isExpanded ? 'max-h-[1000px]' : collapsedHeightClass, // Usa una altura máxima grande al expandir
        )}
      >
        <RichText data={data} enableGutter={false} />
      </div>

      {/* Gradiente y botón solo si hay overflow y no está expandido */}
      {!isExpanded && isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      )}

      {/* Botón solo si el contenido es más largo que la altura colapsada */}
      {/* Mostrar botón si originalmente era necesario */}
      {needsExpansionButton && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={toggleExpand}
            className="inline-flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                Leer menos <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Leer más <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
