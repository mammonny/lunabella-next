'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Datos de ejemplo para los testimonios (pueden venir de props en el futuro)
const testimonialsData = [
  {
    id: 1,
    name: 'Familia Rodríguez',
    imageSrc: '/placeholder.svg?height=50&width=50', // Usar placeholder por ahora
    rating: 5,
    text: 'Nuestro Golden ha sido la mejor adición a nuestra familia. Llegó perfectamente socializado y saludable. El asesoramiento post-adopción ha sido excelente.',
  },
  {
    id: 2,
    name: 'Familia Martínez',
    imageSrc: '/placeholder.svg?height=50&width=50', // Usar placeholder por ahora
    rating: 5,
    text: 'Estamos encantados con nuestro cachorro. Es exactamente como nos lo describieron: juguetón, cariñoso e inteligente. El proceso de adopción fue muy profesional.',
  },
]

interface TestimonialsSectionProps {
  title?: string
  showViewAllButton?: boolean
  viewAllLink?: string
}

export function TestimonialsSection({
  title = 'Opiniones de familias adoptantes',
  showViewAllButton = true,
  viewAllLink = '#', // Enlace de ejemplo
}: TestimonialsSectionProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonialsData.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={testimonial.imageSrc}
                  alt={`Foto de ${testimonial.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <div className="flex text-amber-500 mb-2">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg
                      key={j}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true" // Añadido por accesibilidad
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, j) => (
                    <svg
                      key={`empty-${j}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground" // Estrella vacía
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {showViewAllButton && (
        <div className="text-center mt-8">
          {' '}
          {/* Aumentado margen superior */}
          {/* Idealmente, este botón debería ser un Link de Next.js si viewAllLink es una ruta interna */}
          <Button variant="outline" asChild={viewAllLink.startsWith('/')}>
            {viewAllLink.startsWith('/') ? (
              <a href={viewAllLink}>Ver todas las opiniones</a> // Cambiar a Link si se usa Next Router
            ) : (
              <a href={viewAllLink} target="_blank" rel="noopener noreferrer">
                Ver todas las opiniones
              </a>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
