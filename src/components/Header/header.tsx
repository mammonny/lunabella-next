'use client'

import Link from 'next/link'
import * as React from 'react'
import { useState, useEffect } from 'react' // Importar useState y useEffect
import { Menu, X, PhoneOutgoing } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { Button } from '@/components/ui/button'
import { Logo } from '../Logo/Logo'
import { NavLinks } from '../NavLinks/NavLinks'
import { companyInfo } from '@/config/company'

// Container (igual que antes)
const Container = ({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) => <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Definir los items de navegación móvil aquí también para usar el hook
  const mobileNavItems = [
    ['Quién somos', '#quiensomos'],
    ['Servicios', '#servicios'],
    ['Equipo', '#equipo'],
    ['Encuéntranos', '#encuentranos'],
  ]
  const mobileSectionIds = mobileNavItems.map((item) => item[1]).filter(Boolean) as string[]
  // Usar el hook useScrollSpy para el menú móvil (offset 0 ya que el panel está encima)
  const activeMobileSection = useScrollSpy(mobileSectionIds, { offset: 0 })

  // Establecer isClient a true solo en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    // Envolvemos todo en un fragmento
    <>
      {/* Header con z-index fijo */}
      <header className="sticky top-0 z-[61] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <nav>
          <Container className="relative flex h-16 items-center justify-between">
            {/* Left Side */}
            <div className="relative z-10 flex items-center gap-8 lg:gap-16">
              <Link href="/" aria-label="Home" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="h-8 w-auto lg:h-10" />
              </Link>
              <div className="hidden lg:flex lg:gap-6">
                <NavLinks />
              </div>
            </div>

            {/* Right Side (Solo botones de escritorio) */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* El botón móvil se moverá fuera */}
              {/* Desktop Buttons */}
              <Button asChild className="hidden lg:inline-flex gap-4 text-white">
                <Link href={`tel:${companyInfo.phone}`}>
                  Contáctanos{' '}
                  <PhoneOutgoing className="w-4 h-4 text-white gap-4" strokeWidth={2.75} />
                </Link>
              </Button>
            </div>
          </Container>
        </nav>
      </header>

      {/* --- Botón de Menú Móvil (FUERA del header con fixed) --- */}
      {/* Renderizar solo después de montar en el cliente */}
      {isClient && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle site navigation"
          className="fixed top-4 right-4 z-[70] -m-2 inline-flex items-center p-2 lg:hidden" // Posicionamiento fijo
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6 text-stone-600" />
          )}
        </Button>
      )}
      {/* --- Fin Botón de Menú Móvil --- */}

      {/* --- Mobile Menu Overlay & Panel (AHORA FUERA del header) --- */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-stone-500/60 backdrop-blur lg:hidden" // Corregido a rojo y blur
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -32,
                transition: { duration: 0.2 },
              }}
              className="
                fixed inset-x-0 top-0 bottom-auto z-[60] lg:hidden
                origin-top
                rounded-b-2xl
                rounded-t-none
                bg-stone-50
                px-6 pb-6 pt-16
                shadow-2xl shadow-stone-900/20
                overflow-y-auto
              "
            >
              {/* Contenido del panel */}
              <div className="space-y-4 mt-12">
                {/* Mapear los items de navegación móvil */}
                {mobileNavItems
                  .filter((item): item is [string, string] => typeof item[1] === 'string') // Filtrar para asegurar que href es string
                  .map(([label, href]) => {
                    const isActive = activeMobileSection === href
                    return (
                      <Link
                        key={label}
                        href={href} // Ahora href está garantizado como string
                        className={`block text-base leading-7 tracking-tight hover:text-stone-900 ${
                          isActive ? 'font-semibold text-primary' : 'text-stone-700' // Aplicar estilo si está activo
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    )
                  })}
              </div>
              <div className="mt-8 flex flex-col gap-4 border-t border-stone-200 pt-6">
                <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href={`tel:${companyInfo.phone}`}>
                    Contáctanos
                    <PhoneOutgoing className="w-4 h-4 text-secondary ml-4" strokeWidth={2.75} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* --- Fin Mobile Menu Overlay & Panel --- */}
    </>
  )
}
