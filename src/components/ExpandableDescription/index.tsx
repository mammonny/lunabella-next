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
  const contentRef = useRef<HTMLDivElement>(null)

  // Comprobar si el contenido realmente necesita el botón "Leer más"
  useEffect(() => {
    const checkOverflow = () => {
      const current = contentRef.current
      if (current) {
        // Compara la altura real del scroll con la altura visible del contenedor
        // Damos un pequeño margen (e.g., 1px) por si acaso hay diferencias mínimas de renderizado
        setIsOverflowing(current.scrollHeight > current.clientHeight + 1)
      } else {
        setIsOverflowing(false)
      }
    }

    // Comprobar inicialmente y al cambiar el tamaño de la ventana
    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    // Limpiar el listener al desmontar
    return () => window.removeEventListener('resize', checkOverflow)
  }, [data, isExpanded, collapsedHeightClass]) // Añadir dependencias a useEffect

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
      {isOverflowing && (
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
