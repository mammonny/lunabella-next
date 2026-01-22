'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tag,
  VenusAndMars,
  Cake,
  Palette,
  Scale,
  Ruler,
  Award,
  ScrollText,
  User,
  FileText,
  Sparkles,
  Heart,
} from 'lucide-react'

type DogTabsProps = {
  dogData: {
    id: string | number
    name?: string | null
    breed?: { name?: string | null } | null
    gender?: 'male' | 'female' | null
    birthDate?: string | null
    color?: string | null
    weight?: number | null
    height?: number | null
    pedigreeNumber?: string | null
    breeder?: string | null
    parents?: {
      father?: string | null
      mother?: string | null
    } | null
    specialFeatures?: Array<{
      feature: string
      description?: string | null
    }> | null
  }
  ageInYears: string
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-lunabella-gold/20 hover:shadow-sm">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-lunabella-gold/10 flex items-center justify-center group-hover:bg-lunabella-gold/20 transition-colors">
      <Icon className="h-5 w-5 text-lunabella-gold" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  </div>
)

const FeatureCard = ({ feature, description }: { feature: string; description?: string | null }) => (
  <div className="p-5 rounded-xl bg-gradient-to-br from-white/80 to-white/40 border border-lunabella-gold/10 hover:border-lunabella-gold/30 transition-all duration-300 hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lunabella-gold/10 flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-lunabella-gold" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{feature}</h4>
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
      </div>
    </div>
  </div>
)

const PedigreeItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-lunabella-gold/5 to-transparent border-l-2 border-lunabella-gold">
    <Icon className="h-5 w-5 text-lunabella-gold flex-shrink-0" />
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-0.5">
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  </div>
)

export const DogTabs = ({ dogData, ageInYears }: DogTabsProps) => {
  const [activeTab, setActiveTab] = useState('detalles')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#pedigree') {
        setActiveTab('pedigree')
      }
    }
  }, [])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="w-full h-auto p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-border/50 mb-6">
        <TabsTrigger
          value="detalles"
          className="flex-1 py-3 px-4 rounded-lg data-[state=active]:bg-lunabella-gold data-[state=active]:text-lunabella-cream data-[state=active]:shadow-md transition-all"
        >
          <Tag className="w-4 h-4 mr-2" />
          Detalles
        </TabsTrigger>
        <TabsTrigger
          value="caracteristicas"
          className="flex-1 py-3 px-4 rounded-lg data-[state=active]:bg-lunabella-gold data-[state=active]:text-lunabella-cream data-[state=active]:shadow-md transition-all"
        >
          <Heart className="w-4 h-4 mr-2" />
          Rasgos
        </TabsTrigger>
        <TabsTrigger
          value="pedigree"
          className="flex-1 py-3 px-4 rounded-lg data-[state=active]:bg-lunabella-gold data-[state=active]:text-lunabella-cream data-[state=active]:shadow-md transition-all"
        >
          <Award className="w-4 h-4 mr-2" />
          Pedigree
        </TabsTrigger>
      </TabsList>

      {/* Contenido de la pestana Detalles */}
      <TabsContent value="detalles" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard icon={Tag} label="Raza" value={dogData.breed?.name || 'Golden Retriever'} />
          <InfoCard
            icon={VenusAndMars}
            label="Sexo"
            value={dogData.gender === 'male' ? 'Macho' : 'Hembra'}
          />
          <InfoCard icon={Cake} label="Edad" value={ageInYears} />
          <InfoCard icon={Palette} label="Color" value={dogData.color || 'No disponible'} />
          <InfoCard
            icon={Scale}
            label="Peso"
            value={dogData.weight ? `${dogData.weight} kg` : 'No disponible'}
          />
          <InfoCard
            icon={Ruler}
            label="Altura"
            value={dogData.height ? `${dogData.height} cm` : 'No disponible'}
          />
        </div>
      </TabsContent>

      {/* Contenido de la pestana Caracteristicas */}
      <TabsContent value="caracteristicas" className="mt-0">
        <div className="space-y-3">
          {dogData.specialFeatures && dogData.specialFeatures.length > 0 ? (
            dogData.specialFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature.feature} description={feature.description} />
            ))
          ) : (
            <Card className="border-dashed border-lunabella-gold/30 bg-lunabella-gold/5">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-lunabella-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-lunabella-gold" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Este ejemplar destaca por su excelente temperamento, estructura fisica equilibrada
                  y linaje de calidad. Ideal para familias y como companero de vida.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Contenido de la pestana Pedigree */}
      <TabsContent value="pedigree" className="mt-0">
        <div className="space-y-3">
          {dogData.pedigreeNumber && (
            <PedigreeItem icon={FileText} label="Numero de Pedigree" value={dogData.pedigreeNumber} />
          )}
          {dogData.breeder && (
            <PedigreeItem icon={User} label="Criador" value={dogData.breeder} />
          )}
          {dogData.parents && (dogData.parents.father || dogData.parents.mother) && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-lunabella-gold/5 to-transparent border border-lunabella-gold/10">
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="h-5 w-5 text-lunabella-gold" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Linaje</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dogData.parents.father && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">P</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Padre</span>
                      <span className="font-medium text-sm">{dogData.parents.father}</span>
                    </div>
                  </div>
                )}
                {dogData.parents.mother && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 text-sm font-medium">M</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Madre</span>
                      <span className="font-medium text-sm">{dogData.parents.mother}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {!dogData.pedigreeNumber &&
            !dogData.breeder &&
            (!dogData.parents || (!dogData.parents.father && !dogData.parents.mother)) && (
              <Card className="border-dashed border-muted-foreground/30 bg-muted/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ScrollText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Informacion de pedigree no disponible en este momento.
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
