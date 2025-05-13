'use client'

import { useRef, useState, useEffect } from 'react' // Añadir useEffect
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
type NavItem = [label: string, href: string]

// Altura estimada del header (h-16 = 4rem = 64px) + un pequeño margen
const HEADER_OFFSET = 70

export function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const navItems: NavItem[] = [
    ['Quién somos', '#quiensomos'],
    ['Ejemplares', '/dogs'],
    ['Cachorros', '/puppies'],
    ['Contáctanos', '#encuentranos'],
  ]

  // Extraer los IDs para el hook
  const sectionIds = navItems.map((item) => item[1]).filter(Boolean) as string[]

  // Usar el hook useScrollSpy
  const activeSection = useScrollSpy(sectionIds, { offset: HEADER_OFFSET })

  return navItems.map(([label, href], index) => {
    const isActive = activeSection === href

    return (
      <Link
        key={label}
        href={href}
        className={`relative -mx-3 -my-2 font-medium rounded-lg px-3 py-2 text-sm  transition-colors delay-150 hover:text-stone-900 hover:delay-0 ${
          isActive ? 'text-primary' : 'text-stone-00' // Aplicar estilo si está activo
        }`}
        onMouseEnter={() => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current)
          }
          setHoveredIndex(index)
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setHoveredIndex(null)
          }, 200)
        }}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-secondary/10"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{label}</span>
      </Link>
    )
  })
}
