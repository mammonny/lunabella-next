import type { Metadata } from 'next/types'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ContactPage() {
  // Fetch contact form from Payload
  let contactForm = null
  try {
    const payload = await getPayload({ config: configPromise })
    const forms = await payload.find({
      collection: 'forms',
      where: {
        title: { equals: 'Contact Form' },
      },
    })

    if (forms.docs?.[0]) {
      const formData = { ...forms.docs[0] }
      if (!formData.confirmationType) {
        formData.confirmationType = 'message'
      }
      contactForm = formData as unknown as FormType
    }
  } catch (error) {
    console.error('Error fetching contact form:', error)
  }

  return (
    <main className="isolate">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION - Dramatic Split Composition
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] lg:min-h-screen overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Main image - dramatic crop */}
          <div className="absolute inset-0 lg:right-[45%]">
            <Image
              src="/images/landscape.jpg"
              alt="Golden Retriever en paisaje"
              fill
              className="object-cover object-[center_30%]"
              priority
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  135deg,
                  rgba(0,0,0,0.7) 0%,
                  rgba(0,0,0,0.5) 30%,
                  rgba(0,0,0,0.3) 60%,
                  transparent 100%
                )`
              }}
            />
          </div>

          {/* Right side warm background - desktop */}
          <div
            className="hidden lg:block absolute top-0 right-0 w-[50%] h-full"
            style={{ backgroundColor: '#faf8f5' }}
          >
            {/* Subtle grain texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            {/* Decorative golden line */}
            <div
              className="absolute left-0 top-[20%] bottom-[20%] w-px"
              style={{
                background: 'linear-gradient(to bottom, transparent, #a58a1b 20%, #a58a1b 80%, transparent)'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full min-h-[85vh] lg:min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 w-full py-32 lg:py-0">

            {/* Left column - Hero text */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Ornamental detail */}
              <div
                className="flex items-center gap-4 mb-8 animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
              >
                <span className="w-12 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.35em] uppercase">
                  Contacto
                </span>
              </div>

              {/* Main heading - large editorial */}
              <h1
                className="text-display text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-8 animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                Hablemos de
                <br />
                <span className="text-gradient-gold">tu futuro</span>
                <br />
                <span className="text-white/80 text-[0.65em] font-heading italic">
                  compañero
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/60 text-lg lg:text-xl leading-relaxed max-w-md mb-12 animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                Cada Golden Retriever que criamos merece una familia especial.
                Cuéntanos sobre ti.
              </p>

              {/* Contact info cards - stacked elegantly */}
              <div
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/20 group-hover:border-[#a58a1b] group-hover:bg-[#a58a1b]/10 transition-all duration-500">
                    <svg className="w-5 h-5 text-[#a58a1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Ubicación</p>
                    <p className="text-white text-sm">País Vasco, España</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/20 group-hover:border-[#a58a1b] group-hover:bg-[#a58a1b]/10 transition-all duration-500">
                    <svg className="w-5 h-5 text-[#a58a1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Email</p>
                    <p className="text-white text-sm">info@lunabella.es</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Form card (desktop) */}
            <div className="lg:col-span-7 lg:pl-20 flex items-center">
              <div
                className="w-full max-w-xl mx-auto lg:mx-0 animate-fade-in-up"
                style={{ animationDelay: '500ms' }}
              >
                {/* Form container with elegant styling */}
                <div
                  className="relative bg-white p-8 sm:p-10 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
                  style={{
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(165,138,27,0.08)'
                  }}
                >
                  {/* Golden corner accent */}
                  <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-[1px] h-16 origin-top"
                      style={{ backgroundColor: '#a58a1b' }}
                    />
                    <div
                      className="absolute top-0 left-0 w-16 h-[1px] origin-left"
                      style={{ backgroundColor: '#a58a1b' }}
                    />
                  </div>

                  {/* Bottom right corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 overflow-hidden">
                    <div
                      className="absolute bottom-0 right-0 w-[1px] h-16 origin-bottom"
                      style={{ backgroundColor: '#a58a1b' }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-16 h-[1px] origin-right"
                      style={{ backgroundColor: '#a58a1b' }}
                    />
                  </div>

                  {/* Form header */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="golden-silhouette-sm opacity-60" />
                      <span className="text-[#a58a1b] text-xs font-medium tracking-[0.3em] uppercase">
                        Formulario
                      </span>
                    </div>
                    <h2 className="text-display text-2xl sm:text-3xl text-gray-900 mb-3">
                      Envíanos un mensaje
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Completa el formulario y te responderemos en las próximas 24-48 horas.
                    </p>
                  </div>

                  {/* Form content */}
                  {contactForm ? (
                    <div className="contact-form-wrapper">
                      <FormBlock enableIntro={false} form={contactForm} blockType="formBlock" />
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="golden-silhouette mx-auto mb-6 opacity-20" />
                      <p className="text-gray-500 mb-6">
                        El formulario no está disponible en este momento.
                      </p>
                      <a
                        href="mailto:info@lunabella.es"
                        className="inline-flex items-center gap-3 text-[#a58a1b] hover:gap-4 transition-all duration-300"
                      >
                        <span className="text-sm font-medium tracking-wider uppercase">
                          Escríbenos directamente
                        </span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-20">
          <div className="flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase rotate-0 lg:-rotate-90 lg:translate-y-8">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-[#a58a1b] to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT SECTION - The Breeders Story
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-[#faf8f5]">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23a58a1b' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative silhouette */}
        <div
          className="absolute top-20 right-10 w-40 h-28 opacity-[0.03] pointer-events-none hidden lg:block"
          style={{
            backgroundImage: `url('/silueta-golden.svg')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left - Quote & Info */}
            <div>
              {/* Section label */}
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-px bg-[#a58a1b]" />
                <span className="text-[#a58a1b] text-xs font-medium tracking-[0.3em] uppercase">
                  Quiénes somos
                </span>
              </div>

              <h2 className="text-display text-4xl md:text-5xl text-gray-900 mb-10">
                Criadores con{' '}
                <span className="text-gradient-gold">pasión</span>
              </h2>

              {/* Elegant quote */}
              <figure className="relative mb-12">
                {/* Large quote mark */}
                <div
                  className="absolute -top-4 -left-4 text-8xl font-heading text-[#a58a1b] opacity-10 select-none"
                  aria-hidden="true"
                >
                  "
                </div>

                <blockquote className="relative pl-8 border-l-2 border-[#a58a1b]/40">
                  <p className="text-xl md:text-2xl font-heading italic text-gray-800 leading-relaxed mb-8">
                    Cada cachorro que criamos es parte de nuestra familia.
                    Nos dedicamos con pasión a criar Golden Retriever sanos,
                    equilibrados y felices.
                  </p>

                  <figcaption className="flex items-center gap-5">
                    <div
                      className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#a58a1b' }}
                    >
                      <span className="font-heading text-xl text-[#ece8e1]">LB</span>
                    </div>
                    <div>
                      <cite className="not-italic font-heading font-semibold text-lg text-gray-900 block">
                        María Oruna & Mikel Aldanondo
                      </cite>
                      <span className="text-sm text-gray-500">
                        Fundadores de LunaBella
                      </span>
                    </div>
                  </figcaption>
                </blockquote>
              </figure>

              {/* Values */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#a58a1b]/10 group-hover:bg-[#a58a1b] transition-colors duration-500">
                      <svg className="w-4 h-4 text-[#a58a1b] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span className="text-xs tracking-wider uppercase text-gray-500">Salud</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Tests genéticos completos y certificaciones oficiales
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#a58a1b]/10 group-hover:bg-[#a58a1b] transition-colors duration-500">
                      <svg className="w-4 h-4 text-[#a58a1b] group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    </div>
                    <span className="text-xs tracking-wider uppercase text-gray-500">Amor</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Criados en familia, socializados desde el primer día
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Visual element */}
            <div className="relative">
              {/* Decorative frame */}
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                {/* Background shape */}
                <div
                  className="absolute inset-4 lg:inset-8"
                  style={{
                    backgroundColor: '#ece8e1',
                    transform: 'rotate(-3deg)'
                  }}
                />

                {/* Golden accent line */}
                <div
                  className="absolute -right-4 top-1/4 bottom-1/4 w-1 hidden lg:block"
                  style={{ backgroundColor: '#a58a1b' }}
                />

                {/* Image placeholder / decorative element */}
                <div
                  className="relative z-10 aspect-[4/5] flex items-center justify-center"
                  style={{ backgroundColor: '#faf8f5' }}
                >
                  {/* Large decorative silhouette */}
                  <div
                    className="w-48 h-32 opacity-10"
                    style={{
                      backgroundImage: `url('/silueta-golden.svg')`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />

                  {/* Overlay text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <span className="text-[#a58a1b] text-xs tracking-[0.4em] uppercase mb-4">Desde</span>
                    <span className="text-display text-6xl md:text-7xl text-gray-900 mb-2">2015</span>
                    <span className="text-gray-500 text-sm tracking-wider">criando con pasión</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION - Explore More
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-lunabella-diagonal">
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Section label */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="w-16 h-px bg-[#a58a1b]" />
              <span className="text-[#a58a1b] text-sm font-medium tracking-[0.25em] uppercase">
                Mientras esperas
              </span>
              <span className="w-16 h-px bg-[#a58a1b]" />
            </div>

            <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-8">
              Conoce nuestra{' '}
              <span className="text-gradient-gold">familia</span>
            </h2>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-14">
              Te invitamos a conocer a nuestros Golden Retriever y los cachorros disponibles
              mientras esperamos tu mensaje.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nuestros-goldens"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-[13px] font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: '#000000', color: '#ece8e1' }}
              >
                Nuestros Goldens
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/cachorros"
                className="btn-lunabella-outline"
              >
                Ver cachorros
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Contacto | LunaBella Golden Retriever',
    description:
      'Contacta con LunaBella para información sobre nuestros Golden Retriever, cachorros disponibles o próximas camadas. Criadores en el País Vasco, España.',
    openGraph: {
      title: 'Contacto | LunaBella Golden Retriever',
      description: 'Hablemos sobre tu futuro compañero. Criadores de Golden Retriever en el País Vasco.',
    },
  }
}
