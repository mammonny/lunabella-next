import React from 'react'
import Image from 'next/image'

export default function KitDigitalBanner() {
  return (
    <section
      aria-label="Financiación Kit Digital"
      className="border-t border-[#a58a1b]/15 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center gap-2">
          <p className="max-w-2xl text-center text-xs leading-relaxed text-gray-600">
            Esta web ha sido desarrollada en el marco del programa{' '}
            <strong className="text-gray-800">Kit Digital</strong>, financiado por la Unión Europea –
            NextGenerationEU, dentro del Plan de Recuperación, Transformación y Resiliencia.
          </p>

          <Image
            src="/kit-digital/Financiado-por-union-europea.png"
            alt="Logos oficiales del programa Kit Digital: Plan de Recuperación, Transformación y Resiliencia, Gobierno de España, Financiado por la Unión Europea NextGenerationEU, Red.es y Acelera Pyme"
            width={1200}
            height={200}
            className="h-auto w-full max-w-3xl object-contain"
            priority={false}
          />
        </div>
      </div>
    </section>
  )
}
