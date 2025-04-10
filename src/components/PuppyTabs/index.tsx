'use client' // Marcar como Client Component

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PuppyParentsTab } from '@/components/PuppyParentsTab' // Importar componente de pestaña Padres
import { ExpandableDescription } from '@/components/ExpandableDescription' // Importar si se usa dentro
import type { Media } from '@/payload-types' // Importar tipo Media si es necesario para props

// Iconos (importar los necesarios)
import {
  Syringe,
  ShieldCheck,
  Award,
  ScrollText,
  ThumbsUp,
  Tag, // Icono para Raza
  VenusAndMars, // Icono correcto para Sexo
  // Calendar, // Icono anterior para Edad
  Cake, // Volver a usar CakeSlice para Edad
  Palette, // Icono para Color
  Scale, // Icono para Peso
  Ruler, // Icono para Tamaño
  Smile, // Icono para Temperamento
} from 'lucide-react'

// Definir las props que recibirá este componente desde page.tsx
// (Asegúrate de incluir todos los datos necesarios para las pestañas)
type PuppyTabsProps = {
  puppyData: {
    id: string | number
    name?: string | null
    breed?: { name?: string | null } | null
    gender?: 'male' | 'female' | null
    birthDate?: string | null
    color?: string | null
    weight?: number | null
    description?: any | null // Tipo RichText
    parents?: any | null // Ajustar tipo si es necesario
    coupleStory?: string | any | null // Ajustar tipo si es necesario
    // Añadir cualquier otro dato del cachorro necesario
  }
  litterMates: Array<{
    // Tipo definido en page.tsx
    id: string | number
    image: Media | null
    slug: string
  }>
  ageInWeeks: string
  // Añadir cualquier otra prop necesaria (ej: datos de salud si son dinámicos)
}

export const PuppyTabs = ({ puppyData, litterMates, ageInWeeks }: PuppyTabsProps) => {
  const [activeTab, setActiveTab] = useState('detalles') // Estado para la pestaña activa

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#padres') {
        setActiveTab('padres')
      }
      // Podrías añadir lógica para otros hashes si fuera necesario
    }
  }, []) // El array vacío asegura que se ejecute solo al montar

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="detalles">Detalles</TabsTrigger>
        <TabsTrigger value="salud">Salud</TabsTrigger>
        <TabsTrigger value="padres">Padres</TabsTrigger>
      </TabsList>

      {/* Contenido de la pestaña Detalles */}
      <TabsContent value="detalles" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-4 w-4" /> {/* Icono movido aquí */}
              Raza
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>{puppyData.breed?.name || 'No disponible'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <VenusAndMars className="h-4 w-4" /> {/* Usar VenusMars */}
              Sexo
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>{puppyData.gender === 'male' ? 'Macho' : 'Hembra'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Cake className="h-4 w-4" /> {/* Volver a CakeSlice */}
              Edad
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>{ageInWeeks}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Palette className="h-4 w-4" /> {/* Icono movido aquí */}
              Color
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>{puppyData.color || 'No disponible'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Scale className="h-4 w-4" /> {/* Icono movido aquí */}
              Peso actual
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>{puppyData.weight ? `${puppyData.weight} kg` : 'No disponible'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground flex items-center gap-1.5">
              <Ruler className="h-4 w-4" /> {/* Icono movido aquí */}
              Tamaño adulto est.
            </h3>
            <div>
              {' '}
              {/* Div sin flex */}
              <p>25-30 kg</p> {/* TODO: Hacer dinámico si es posible */}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Smile className="h-4 w-4" /> {/* Icono movido aquí */}
            Temperamento
          </h3>
          <div>
            {' '}
            {/* Div sin flex */}
            <p>
              Juguetón, sociable, cariñoso y muy inteligente. Excelente con niños y otros animales.{' '}
              {/* TODO: Hacer dinámico si es posible */}
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Contenido de la pestaña Salud */}
      <TabsContent value="salud">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Syringe className="h-4 w-4 text-primary flex-shrink-0" />
              Vacunas
            </h3>
            {/* Mostrar viñetas estándar */}
            <ul className="list-disc pl-5 space-y-1">
              {' '}
              {/* Cambiado list-none a list-disc, añadido pl-5, ajustado space-y */}
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Primera vacuna polivalente (6 semanas)</span>
              </li>
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Segunda vacuna polivalente (8 semanas)</span>
              </li>
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Desparasitación completa</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
              Certificados
            </h3>
            {/* Mostrar viñetas estándar */}
            <ul className="list-disc pl-5 space-y-1">
              {' '}
              {/* Cambiado list-none a list-disc, añadido pl-5, ajustado space-y */}
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Certificado veterinario de salud</span>
              </li>
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Microchip</span>
              </li>
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono eliminado de aquí */}
                <span>Pedigree oficial</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-primary flex-shrink-0" />
              Garantías
            </h3>
            {/* Mostrar viñetas estándar */}
            <ul className="list-disc pl-5 space-y-1">
              {' '}
              {/* Cambiado list-none a list-disc, añadido pl-5, ajustado space-y */}
              <li>
                {' '}
                {/* Eliminado flex, items-start, gap-2 */}
                {/* Icono ya está en el h3 */}
                <span>
                  Ofrecemos garantía de salud por 2 años contra enfermedades genéticas hereditarias.{' '}
                  {/* TODO: Hacer dinámico */}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>

      {/* Contenido de la pestaña Padres */}
      <TabsContent value="padres">
        <div className="space-y-4">
          {/* Renderizar PuppyParentsTab pasando las props necesarias */}
          <PuppyParentsTab
            parents={puppyData.parents}
            puppyName={puppyData.name || 'este cachorro'}
            coupleStory={puppyData.coupleStory}
            litterPuppies={litterMates}
            currentPuppyId={puppyData.id}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
