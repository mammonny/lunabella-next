# Plan para Corregir el Error de Despliegue en Vercel

## Problema Identificado

Al intentar hacer un despliegue en Vercel, se produce el siguiente error:

```
Type 'Args' does not satisfy the constraint 'PageProps'.
Types of property 'params' are incompatible.
Type '{ slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

Este error está ocurriendo en el archivo `src/app/(frontend)/puppies/[slug]/page.tsx`. El problema está relacionado con la definición de tipos para los parámetros de la página en Next.js 15.

## Solución Propuesta

### 1. Modificar la Definición de Tipos

Necesitamos actualizar el archivo `src/app/(frontend)/puppies/[slug]/page.tsx` para utilizar la interfaz `PageProps` de Next.js:

```typescript
// Importar PageProps de Next.js
import type { Metadata, PageProps } from 'next/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Heart, Share2, ArrowLeft, ArrowRight } from 'lucide-react'

import { Media } from '@/components/Media'
import { PuppyParentsTab } from '@/components/PuppyParentsTab'
import RichText from '@/components/RichText'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

// Modificar la definición del tipo Args para usar PageProps
type Args = PageProps<{
  params: {
    slug: string
  }
}>

// Función para obtener datos del cachorro por slug
const queryPuppyBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    // @ts-ignore - 'puppies' will be added to CollectionSlug after server restart
    collection: 'puppies',
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export default async function Page({ params }: Args) {
  const slug = params.slug

  try {
    const payload = await getPayload({ config: configPromise })
    const puppy = (await queryPuppyBySlug({ slug })) as any

    // Resto del código permanece igual...
```

### 2. Actualizar la Función generateMetadata

También necesitamos actualizar la función `generateMetadata` para que utilice el nuevo tipo:

```typescript
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  // Asegurarse de que params esté disponible antes de desestructurar
  const slug = params.slug
  const payload = await getPayload({ config: configPromise })

  try {
    const puppy = (await queryPuppyBySlug({ slug })) as any

    // Resto del código permanece igual...
```

## Pasos para Implementar la Solución

1. Cambiar al modo Code para poder editar archivos TypeScript.
2. Abrir el archivo `src/app/(frontend)/puppies/[slug]/page.tsx`.
3. Realizar las modificaciones descritas anteriormente.
4. Guardar los cambios.
5. Probar localmente ejecutando `pnpm build` para verificar que no hay errores de compilación.
6. Si todo funciona correctamente, hacer commit de los cambios y desplegar en Vercel.

## Explicación Técnica

En Next.js 15, la interfaz `PageProps` ha cambiado y espera que `params` sea una promesa (`Promise<any>`), mientras que en el código actual, `params` está definido como un objeto simple `{ slug: string }`.

Al utilizar `PageProps<{ params: { slug: string } }>`, estamos indicando a TypeScript que `params` debe tener la estructura correcta para Next.js 15, lo que debería resolver el error de tipos durante el despliegue en Vercel.

## Enfoque Alternativo (si el anterior no funciona)

Si el enfoque anterior no resuelve el problema, podemos intentar un enfoque más genérico:

```typescript
// Usar un tipo más genérico para los parámetros
export default async function Page({ params }: { params: any }) {
  const slug = params.slug

  // Resto del código...
}

// También actualizar la función generateMetadata
export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const slug = params.slug

  // Resto del código...
}
```

Sin embargo, este enfoque sacrifica la seguridad de tipos, por lo que es preferible intentar primero la solución con `PageProps`.
