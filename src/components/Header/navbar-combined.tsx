'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/Footer/link'
import { Logo } from '../Logo/Logo'
import { Button } from '@/components/ui/button'

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex items-center gap-1">
      <Link
        href="/nosotros"
        className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        Nosotros
      </Link>
      <Link
        href="/nuestros-perros"
        className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        Nuestros Perros
      </Link>
      <Link
        href="/cachorros"
        className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        Cachorros
      </Link>
      <Link
        href="/exposiciones"
        className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        Exposiciones
      </Link>
      <Link
        href="/galeria"
        className="px-4 py-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        Galería
      </Link>
      <Link
        href="/contacto"
        className="ml-4 px-5 py-2 text-sm font-medium rounded-full transition-colors"
        style={{ backgroundColor: '#000000', color: '#ece8e1' }}
      >
        Contacto
      </Link>
    </nav>
  )
}

export function NavbarCombined({ banner }: { banner?: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const navbarRef = useRef<HTMLDivElement>(null)

  // Establecer isClient a true solo en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      // Activar con cualquier scroll > 0 para mayor sensibilidad
      setIsScrolled(scrollTop > 0)
    }

    // Detectar inmediatamente el estado de scroll al cargar la página
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navbarHeight])

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight)
    }
  }, [])

  return (
    <>
      <header
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 z-[61] transition-all duration-300 ease-out"
        style={{ backgroundColor: '#ece8e1' }}
      >
        <div className="px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="py-3 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-6">
                <Link href="/" title="Home">
                  <Logo />
                </Link>
                {banner && (
                  <div className="hidden lg:flex items-center">{banner}</div>
                )}
              </div>

              {/* Desktop Navigation */}
              <DesktopNav />

              {/* Mobile Menu Button */}
              {isClient && (
                <div className="flex items-center lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle site navigation"
                    className="relative z-[70]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6 text-gray-600" />
                    ) : (
                      <Menu className="h-6 w-6 text-gray-600" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Overlay & Panel --- */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-stone-500/60 backdrop-blur lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -20,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="
                fixed inset-x-0 top-0 bottom-auto z-[60] lg:hidden
                origin-top
                rounded-b-2xl
                rounded-t-none
                bg-stone-50
                px-6 pb-6 pt-20 sm:pt-24
                shadow-2xl shadow-stone-900/20
                overflow-y-auto
              "
            >
              {/* Contenido del panel - Menú LunaBella */}
              <div className="space-y-4 mt-20">
                <Link
                  href="/nosotros"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>
                <Link
                  href="/nuestros-perros"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nuestros Perros
                </Link>
                <Link
                  href="/cachorros"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cachorros
                </Link>
                <Link
                  href="/exposiciones"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Exposiciones
                </Link>
                <Link
                  href="/galeria"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Galería
                </Link>
              </div>
              <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6">
                <Link
                  href="/contacto"
                  className="w-full text-center px-5 py-3 text-sm font-medium rounded-full transition-colors"
                  style={{ backgroundColor: '#000000', color: '#ece8e1' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
