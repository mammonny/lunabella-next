'use client'

import { HeartHandshake, ShieldCheck, MessagesSquare } from 'lucide-react'

interface WhyChooseUsSectionProps {
  title?: string
  // Podríamos añadir 'items' como prop si quisiéramos hacerlo más dinámico
}

export function WhyChooseUsSection({
  title = '¿Por qué elegir Criadero Goizametz?',
}: WhyChooseUsSectionProps) {
  return (
    <div className="mt-16 bg-muted rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Punto 1: Crianza Ética y Familiar */}
        <div className="text-center">
          <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Crianza Ética y Familiar</h3>
          <p className="text-sm text-muted-foreground">
            Nuestros cachorros nacen y crecen en nuestro hogar, recibiendo amor y socialización
            temprana.
          </p>
        </div>
        {/* Punto 2: Salud y Genética Premium */}
        <div className="text-center">
          <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Salud y Genética Premium</h3>
          <p className="text-sm text-muted-foreground">
            Controles veterinarios exhaustivos y garantía de salud para tu tranquilidad.
          </p>
        </div>
        {/* Punto 3: Soporte Post-Adopción */}
        <div className="text-center">
          <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessagesSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Soporte Post-Adopción</h3>
          <p className="text-sm text-muted-foreground">
            Te acompañamos durante la adaptación y resolvemos tus dudas a lo largo de su vida.
          </p>
        </div>
      </div>
    </div>
  )
}
