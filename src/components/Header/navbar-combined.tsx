'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/Footer/link'
import { Logo } from '../Logo/Logo'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

// Brand colors
const COLORS = {
  cream: '#ece8e1',
  creamDark: '#ddd7cc',
  gold: '#a58a1b',
  goldLight: '#c9a93d',
  black: '#000000',
  charcoal: '#1a1a1a',
}

// Navigation items
const NAV_ITEMS = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Nuestros Goldens', href: '/nuestros-goldens' },
  { label: 'Cachorros', href: '/cachorros' },
  { label: 'Exposiciones', href: '/exposiciones' },
  { label: 'Galería', href: '/galeria' },
]

// Elegant NavLink with animated underline
function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link
      href={href}
      className="group relative px-5 py-2"
    >
      <span
        className={`relative z-10 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
          isActive ? '' : 'group-hover:text-[#a58a1b]'
        }`}
        style={{ color: isActive ? COLORS.gold : COLORS.charcoal }}
      >
        {children}
      </span>
      {/* Underline - full width, revealed via clip-path from left */}
      <span
        className={`absolute bottom-1 left-5 right-5 h-px transition-[clip-path] duration-300 ease-out ${
          isActive
            ? '[clip-path:inset(0_0_0_0)]'
            : '[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]'
        }`}
        style={{ backgroundColor: COLORS.gold }}
      />
    </Link>
  )
}

// Contact button with consistent styling
function ContactButton() {
  return (
    <Link
      href="/contacto"
      className="group ml-6 inline-flex items-center gap-2 px-7 py-2.5 bg-black text-[#ece8e1] transition-all duration-300 ease-out hover:bg-[#1a1a1a]"
    >
      <span className="text-[12px] font-medium uppercase tracking-[0.15em]">
        Contacto
      </span>
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: COLORS.gold }}
        strokeWidth={2}
      />
    </Link>
  )
}

function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="relative hidden lg:flex items-center">
      {/* Nav links */}
      <div className="flex items-center">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Separator */}
      <div
        className="mx-4 h-5 w-px"
        style={{ backgroundColor: COLORS.creamDark }}
      />

      {/* Contact button */}
      <ContactButton />
    </nav>
  )
}

export function NavbarCombined({ banner }: { banner?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Establecer isClient a true solo en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[61]"
        style={{
          backgroundColor: COLORS.cream,
        }}
      >
        <div className="px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div
              className="flex items-center justify-between"
              style={{ padding: '0.875rem 0' }}
            >
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  title="Home"
                >
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
                    className="relative z-[70] transition-colors duration-300 hover:bg-transparent"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" style={{ color: COLORS.charcoal }} />
                    ) : (
                      <Menu className="h-6 w-6" style={{ color: COLORS.charcoal }} />
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
                  href="/nuestros-goldens"
                  className="block text-base leading-7 tracking-tight text-gray-800 hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Nuestros Goldens
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
                  className="w-full text-center px-5 py-3 text-sm font-medium uppercase tracking-[0.15em] bg-black text-[#ece8e1] transition-all duration-300 hover:bg-[#1a1a1a]"
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
