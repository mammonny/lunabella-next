'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  PhoneOutgoing,
  CalendarArrowUp,
  ChevronDown,
  Heart,
  Zap,
  Shield,
  Sparkles,
  Video,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/Footer/link'
import { Logo } from '../Logo/Logo'
import { PlusGrid, PlusGridItem, PlusGridRow } from '@/components/Plus-grid/plus-grid'
import { Button } from '@/components/ui/button'
import { companyInfo, getWhatsAppNumber, getWhatsAppMessage } from '@/config/company'

const serviciosDropdown = [
  {
    href: '/pomerania',
    label: 'Lou Lou Pomerania',
    description: 'Pequeños, esponjosos y llenos de energía',
    icon: Heart,
  },
  {
    href: '/shih-tzu',
    label: 'Shih Tzu',
    description: 'Compañeros leales de carácter noble',
    icon: Heart,
  },
  {
    href: '/yorkshire-terrier',
    label: 'Yorkshire Terrier',
    description: 'Elegantes, valientes y de tamaño toy',
    icon: Heart,
  },
  {
    href: '/bichon-maltes',
    label: 'Bichón Maltés',
    description: 'Pelo sedoso blanco y temperamento dulce',
    icon: Heart,
  },
]
const cachorrosDropdown = [
  {
    href: '/pomerania',
    label: 'Lou Lou Pomerania',
    description: 'Pequeños, esponjosos y llenos de energía',
    icon: Heart,
  },
  {
    href: '/shih-tzu',
    label: 'Shih Tzu',
    description: 'Compañeros leales de carácter noble',
    icon: Heart,
  },
  {
    href: '/yorkshire-terrier',
    label: 'Yorkshire Terrier',
    description: 'Elegantes, valientes y de tamaño toy',
    icon: Heart,
  },
  {
    href: '/bichon-maltes',
    label: 'Bichón Maltés',
    description: 'Pelo sedoso blanco y temperamento dulce',
    icon: Heart,
  },
]
function MobileServicesDropdown({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-base leading-7 tracking-tight text-stone-700 hover:text-stone-900"
      >
        Ejemplares
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-4 space-y-3 overflow-hidden"
          >
            {serviciosDropdown.map(({ href, label, description, icon: Icon }) => (
              <div key={href} className="flex gap-x-3 py-2">
                <div className="hidden flex size-8 flex-none items-center justify-center rounded-lg bg-stone-50">
                  <Icon className="size-4 text-stone-600" />
                </div>
                <div className="flex-1">
                  <Link
                    href={href}
                    className="block text-sm font-medium leading-6 tracking-tight text-stone-700 hover:text-stone-900"
                    onClick={onClose}
                  >
                    {label}
                  </Link>
                  {/* <p className="text-xs text-stone-500 mt-0.5">{description}</p> */}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DesktopNav() {
  const [isServiciosOpen, setIsServiciosOpen] = useState(false)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown="servicios"]')) {
        setIsServiciosOpen(false)
      }
    }

    if (isServiciosOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isServiciosOpen])

  return (
    <nav className="relative hidden lg:flex">
      {/* Sobre Mí */}
      <PlusGridItem className="relative flex">
        <Link
          href="/quien-soy"
          className="flex items-center px-4 py-3 text-base font-medium text-pink-950 bg-blend-multiply hover:bg-black/[2.5%]"
        >
          Sobre Mí
        </Link>
      </PlusGridItem>

      {/* Dropdown de Servicios */}
      <PlusGridItem className="relative flex" data-dropdown="servicios">
        <button
          type="button"
          className="flex items-center gap-x-1 px-4 py-3 text-base font-medium text-pink-950 bg-blend-multiply hover:bg-black/[2.5%]"
          aria-expanded={isServiciosOpen}
          onClick={() => setIsServiciosOpen(!isServiciosOpen)}
        >
          <span>Ejemplares</span>
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${isServiciosOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {isServiciosOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full z-10 mt-2"
              style={{ left: '-200px' }}
            >
              <div className="w-[500px] overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg ring-1 ring-stone-900/5">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-x-4">
                    {serviciosDropdown.map(({ href, label, description, icon: Icon }) => (
                      <div
                        key={href}
                        className="group relative flex gap-x-4 rounded-xl p-3 hover:bg-stone-50"
                      >
                        <div className="hidden mt-1 flex size-10 flex-none items-center justify-center rounded-lg bg-stone-50 group-hover:bg-white">
                          <Icon className="size-5 text-stone-600 group-hover:text-primary" />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={href}
                            className="font-semibold text-pink-950"
                            onClick={() => setIsServiciosOpen(false)}
                          >
                            {label}
                            <span className="absolute inset-0"></span>
                          </Link>
                          <p className="mt-1 text-stone-600">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 divide-x divide-stone-900/5 bg-stone-50">
                  {/* <Link
                    href="/servicios"
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-stone-900 hover:bg-stone-100"
                    onClick={() => setIsServiciosOpen(false)}
                  >
                    Ver todos los servicios
                  </Link> */}
                  <Link
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-stone-900 hover:bg-stone-100"
                    onClick={() => setIsServiciosOpen(false)}
                  >
                    <PhoneOutgoing className="size-5 flex-none text-stone-400" />
                    Contactar
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PlusGridItem>

      {/* Blog */}
      <PlusGridItem className="relative flex">
        <Link
          href="/blog"
          className="flex items-center px-4 py-3 text-base font-medium text-pink-950 bg-blend-multiply hover:bg-black/[2.5%]"
        >
          Blog
        </Link>
      </PlusGridItem>

      {/* Contacto */}
      <PlusGridItem className="relative flex">
        <Link
          href="/contacto"
          className="flex items-center px-4 py-3 text-base font-medium text-pink-950 bg-blend-multiply hover:bg-black/[2.5%]"
        >
          Contacto
        </Link>
      </PlusGridItem>

      {/* Botón Pedir Cita para desktop */}
      <PlusGridItem className="relative flex">
        <Button variant="primary" asChild className="mx-4 ms-8 my-5 text-white">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(getWhatsAppMessage())}`}
          >
            Reservar cita
            <CalendarArrowUp className="w-4 h-4 text-white ml-2" strokeWidth={2.25} />
          </Link>
        </Button>
      </PlusGridItem>
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
      <div
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-[61] transition-all duration-300 ease-out ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}
      >
        <div className="px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-7xl">
            <div className={isScrolled ? 'pt-4 sm:pt-0' : 'pt-12 sm:pt-16'}>
              <PlusGrid>
                <PlusGridRow className="relative flex justify-between">
                  <div className="relative flex gap-6">
                    <PlusGridItem className="py-3">
                      <Link href="/" title="Home">
                        <Logo className="h-14" />
                      </Link>
                    </PlusGridItem>
                    {banner && (
                      <div className="relative hidden items-center py-3 lg:flex">{banner}</div>
                    )}
                  </div>
                  <DesktopNav />

                  {/* Botón de Menú Móvil dentro del header */}
                  {isClient && (
                    <div className="flex items-center lg:hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle site navigation"
                        className="relative z-[70] -m-2 inline-flex items-center p-2 mr-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        {isMobileMenuOpen ? (
                          <X className="h-6 w-6 text-stone-600" />
                        ) : (
                          <Menu className="h-6 w-6 text-stone-600" />
                        )}
                      </Button>
                    </div>
                  )}
                </PlusGridRow>
              </PlusGrid>
            </div>
          </div>
        </div>
      </div>

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
              {/* Contenido del panel */}
              <div className="space-y-4 mt-20">
                {/* Sobre Mí */}
                <Link
                  href="/quien-soy"
                  className="block text-base leading-7 tracking-tight text-stone-700 hover:text-stone-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre Mí
                </Link>

                {/* Servicios con dropdown en móvil */}
                <MobileServicesDropdown onClose={() => setIsMobileMenuOpen(false)} />

                {/* Blog */}
                <Link
                  href="/blog"
                  className="block text-base leading-7 tracking-tight text-stone-700 hover:text-stone-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>

                {/* Contacto */}
                <Link
                  href="/contacto"
                  className="block text-base leading-7 tracking-tight text-stone-700 hover:text-stone-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
              <div className="mt-8 flex flex-col gap-4 border-t border-stone-200 pt-6">
                <Button variant="primary" asChild className="w-full">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                  >
                    Contacto
                    <PhoneOutgoing className="w-4 h-4 text-white ml-2" strokeWidth={2.25} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
