import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import React from 'react'

// Fuente para títulos - Playfair Display: elegante, con carácter editorial
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

// Fuente para textos - DM Sans: moderna, legible, sofisticada
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/components/Header/header'
import Footer2 from '@/components/Footer/footer2'
import { Providers } from '@/providers'
import { Toaster } from 'sonner'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { NavbarCombined } from '@/components/Header/navbar-combined'
import { Container } from '@/components/Container/container'
import { CookieConsentBanner } from '@/components/CookieConsent/CookieConsent'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(dmSans.variable, playfairDisplay.variable)} lang="es" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <div className="relative">
            <Container className="relative">
              <NavbarCombined
              /* banner={
                      <Link
                        href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
                        className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
                      >
                        Descubre mi nueva página web
                        <ChevronRightIcon className="size-4" />
                      </Link>
                    } */
              />
            </Container>
          </div>
          {children}
          <Footer2 />
          <Toaster richColors position="bottom-right" />
        </Providers>
        <CookieConsentBanner />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@LunaBellaGR',
  },
}
