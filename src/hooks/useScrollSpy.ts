import { useState, useEffect, useRef } from 'react'

// Función para limitar la frecuencia de ejecución (throttle)
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let lastFunc: ReturnType<typeof setTimeout> | null
  let lastRan: number
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      if (lastFunc) clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  } as T
}

export function useScrollSpy(
  sectionIds: string[],
  options?: {
    offset?: number // Offset adicional (ej. altura del header)
    throttleMs?: number // Milisegundos para el throttle
  },
): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { offset = 0, throttleMs = 100 } = options || {}
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Guardar referencias a los elementos de sección una vez
  useEffect(() => {
    sectionIds.forEach((id) => {
      sectionRefs.current[id] = document.getElementById(id.startsWith('#') ? id.substring(1) : id)
    })
  }, [sectionIds])

  useEffect(() => {
    const handleScroll = throttle(() => {
      let currentActiveSection: string | null = null
      const scrollPosition = window.scrollY + offset + 5 // +5 para un pequeño margen

      // Ordenar IDs por su posición en el DOM para asegurar el orden correcto
      const sortedIds = Object.entries(sectionRefs.current)
        .filter(([, element]) => element)
        .sort(([, a], [, b]) => (a?.offsetTop ?? 0) - (b?.offsetTop ?? 0))
        .map(([id]) => id)

      for (const id of sortedIds) {
        const element = sectionRefs.current[id]
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveSection = id // Se actualiza con la última sección cuya parte superior está por encima o en la posición de scroll
        } else {
          // Si ya encontramos una sección activa y la siguiente está más abajo, nos detenemos
          break
        }
      }

      // Si después de revisar todas, ninguna cumple (estamos muy arriba),
      // o si la primera sección está por debajo de la vista inicial,
      // podemos opcionalmente no activar ninguna o activar la primera.
      // Aquí, si currentActiveSection sigue null, no activamos ninguna.
      // Si queremos activar la primera por defecto al estar arriba del todo:
      if (
        currentActiveSection === null &&
        sortedIds.length > 0 &&
        sortedIds[0] && // Añadir esta comprobación explícita
        window.scrollY < (sectionRefs.current[sortedIds[0]]?.offsetTop ?? Infinity) - offset - 5
      ) {
        // Opcional: podrías querer no activar ninguna aquí: setActiveSection(null);
        // O activar la primera si estás claramente por encima de ella:
        // currentActiveSection = sortedIds[0]; // Descomentar si quieres este comportamiento
      }

      setActiveSection(currentActiveSection)
    }, throttleMs)

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Ejecutar una vez al inicio

    return () => {
      window.removeEventListener('scroll', handleScroll)
      // Limpiar timeouts pendientes del throttle si el componente se desmonta
      // (La implementación de throttle debería manejar esto internamente si es robusta,
      // pero por si acaso, aunque la función throttle simple no lo hace explícitamente)
    }
  }, [sectionIds, offset, throttleMs]) // Dependencias del efecto

  return activeSection
}
