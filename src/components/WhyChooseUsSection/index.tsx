import { HeartHandshake, ShieldCheck, MessagesSquare } from 'lucide-react'

interface WhyChooseUsSectionProps {
  title?: string
}

export function WhyChooseUsSection({
  title = '¿Por qué elegir LunaBella?',
}: WhyChooseUsSectionProps) {
  return (
    <div className="mt-16 bg-lunabella-cream dark:bg-lunabella-dark/50 rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Punto 1: Crianza Ética y Familiar */}
        <div className="text-center">
          <div className="bg-lunabella-gold text-lunabella-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <div className="bg-lunabella-gold text-lunabella-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Salud y Genética Premium</h3>
          <p className="text-sm text-muted-foreground">
            Controles veterinarios exhaustivos y garantia de salud para tu tranquilidad.
          </p>
        </div>
        {/* Punto 3: Soporte Post-Adopcion */}
        <div className="text-center">
          <div className="bg-lunabella-gold text-lunabella-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessagesSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Soporte Post-Adopcion</h3>
          <p className="text-sm text-muted-foreground">
            Te acompanamos durante la adaptacion y resolvemos tus dudas a lo largo de su vida.
          </p>
        </div>
      </div>
    </div>
  )
}
