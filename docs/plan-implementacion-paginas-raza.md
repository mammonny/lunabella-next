# Plan de Implementación - Páginas por Raza

## 📋 Resumen Ejecutivo

Implementar páginas individuales por raza con estructura SEO-optimizada:
- `/pomerania`, `/yorkshire-terrier`, `/bichon-maltes`, `/shih-tzu`
- Subrutas: `/[breed]/cachorros` y `/[breed]/ejemplares`

## 🎯 Objetivos

1. ✅ Crear páginas dedicadas por raza con contenido específico
2. ✅ Optimizar URLs para SEO (cortas y con keywords)
3. ✅ Reutilizar componentes existentes donde sea posible
4. ✅ Mantener consistencia con el diseño actual

## 🏗️ Arquitectura de URLs

```
/pomerania                    → Página principal Pomerania
/pomerania/cachorros          → Cachorros Pomerania
/pomerania/ejemplares         → Ejemplares Pomerania

/yorkshire-terrier            → Página principal Yorkshire
/yorkshire-terrier/cachorros  → Cachorros Yorkshire
/yorkshire-terrier/ejemplares → Ejemplares Yorkshire

/bichon-maltes               → Página principal Bichón
/bichon-maltes/cachorros     → Cachorros Bichón
/bichon-maltes/ejemplares    → Ejemplares Bichón

/shih-tzu                    → Página principal Shih Tzu
/shih-tzu/cachorros          → Cachorros Shih Tzu
/shih-tzu/ejemplares         → Ejemplares Shih Tzu
```

## 📁 Estructura de Archivos

### FASE 1: Mover Payload

```
ANTES:
src/app/(frontend)/[slug]/page.tsx

DESPUÉS:
src/app/(frontend)/paginas/[slug]/page.tsx
```

**Archivos a mover:**
- `src/app/(frontend)/[slug]/page.tsx` → `src/app/(frontend)/paginas/[slug]/page.tsx`
- `src/app/(frontend)/[slug]/page.client.tsx` → `src/app/(frontend)/paginas/[slug]/page.client.tsx`

### FASE 2: Crear Rutas de Raza

```
src/app/(frontend)/[breed]/
├── page.tsx                  → Página principal de raza
├── cachorros/
│   └── page.tsx             → Listado cachorros (FASE 3)
└── ejemplares/
    └── page.tsx             → Listado ejemplares (FASE 3)
```

## 🔧 FASE 1: Mover Páginas de Payload

### Paso 1.1: Crear directorio y mover archivos

```bash
# Crear nuevo directorio
mkdir -p src/app/(frontend)/paginas/[slug]

# Mover archivos
mv src/app/(frontend)/[slug]/page.tsx src/app/(frontend)/paginas/[slug]/page.tsx
mv src/app/(frontend)/[slug]/page.client.tsx src/app/(frontend)/paginas/[slug]/page.client.tsx
```

### Paso 1.2: Actualizar imports en page.tsx

**Archivo:** `src/app/(frontend)/paginas/[slug]/page.tsx`

No requiere cambios en imports relativos ya que mantienen la misma estructura.

### Paso 1.3: Actualizar referencias en otros archivos

**Buscar y reemplazar en todo el proyecto:**
- Buscar: referencias a `/[slug]` en navegación
- Actualizar: a `/paginas/[slug]` si es necesario

### Paso 1.4: Probar

1. Iniciar servidor de desarrollo
2. Visitar `/paginas/sobre-nosotros` (o cualquier página de Payload)
3. Verificar que funciona correctamente

## 🔧 FASE 2: Crear Páginas de Raza

### Paso 2.1: Crear estructura base

**Archivo:** `src/app/(frontend)/[breed]/page.tsx`

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Home, Dog } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ breed: string }> | undefined
}

// Función para obtener raza por slug
const queryBreedBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'breeds',
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

export default async function BreedPage({ params }: Args) {
  if (!params) {
    return notFound()
  }

  const { breed: breedSlug } = await params

  if (!breedSlug) {
    return notFound()
  }

  try {
    const breed = await queryBreedBySlug({ slug: breedSlug }) as any

    if (!breed) {
      return notFound()
    }

    const {
      name,
      description,
      mainImage,
      characteristics,
      temperament,
      careInstructions,
      size,
      lifeExpectancy,
      weight,
      height,
    } = breed

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-64">
        {/* Breadcrumbs */}
        <Breadcrumbs
          className="mb-6"
          items={[
            {
              label: 'Home',
              href: '/',
              icon: <Home className="h-4 w-4" />,
            },
            {
              label: name || 'Raza',
            },
          ]}
        />

        {/* Hero Section */}
        <div className="mb-12">
          <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
            {mainImage && (
              <Media
                resource={mainImage as MediaType}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{name}</h1>
        </div>

        {/* Texto Introductorio */}
        <div className="mb-12">
          <div className="prose dark:prose-invert max-w-none">
            {description ? (
              <RichText data={description} />
            ) : (
              <p>Información sobre la raza {name}.</p>
            )}
          </div>
        </div>

        {/* Características Básicas */}
        {(size || lifeExpectancy || weight || height) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Características</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {size && (
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Tamaño</h3>
                  <p className="text-muted-foreground capitalize">{size.replace('_', ' ')}</p>
                </div>
              )}
              {lifeExpectancy && (
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Esperanza de Vida</h3>
                  <p className="text-muted-foreground">{lifeExpectancy}</p>
                </div>
              )}
              {weight && (weight.min || weight.max) && (
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Peso</h3>
                  <p className="text-muted-foreground">
                    {weight.min && weight.max
                      ? `${weight.min} - ${weight.max} kg`
                      : weight.min
                        ? `${weight.min} kg`
                        : `${weight.max} kg`}
                  </p>
                </div>
              )}
              {height && (height.min || height.max) && (
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Altura</h3>
                  <p className="text-muted-foreground">
                    {height.min && height.max
                      ? `${height.min} - ${height.max} cm`
                      : height.min
                        ? `${height.min} cm`
                        : `${height.max} cm`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Temperamento */}
        {temperament && temperament.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Temperamento</h2>
            <div className="flex flex-wrap gap-2">
              {temperament.map((item: any, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full"
                >
                  {item.trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Características Detalladas */}
        {characteristics && characteristics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Características Detalladas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {characteristics.map((char: any, index: number) => (
                <div key={index} className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">{char.title}</h3>
                  <p className="text-muted-foreground">{char.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cuidados */}
        {careInstructions && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Cuidados Específicos</h2>
            <div className="prose dark:prose-invert max-w-none">
              <RichText data={careInstructions} />
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            ¿Interesado en un {name}?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contáctanos para conocer nuestros cachorros disponibles y ejemplares de esta raza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${breedSlug}/cachorros`}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Cachorros Disponibles
            </a>
            <a
              href={`/${breedSlug}/ejemplares`}
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Ver Nuestros Ejemplares
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching breed:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  if (!params) {
    return {
      title: 'Raza no encontrada',
      description: 'La raza que buscas no existe',
    }
  }

  try {
    const { breed: breedSlug } = await params
    const breed = await queryBreedBySlug({ slug: breedSlug })

    if (!breed) {
      return {
        title: 'Raza no encontrada',
        description: 'La raza que buscas no existe',
      }
    }

    const breedData = breed as any

    // Usar meta personalizado si existe, sino valores por defecto
    const metaTitle = breedData.meta?.title || `${breedData.name} - Criadero Goizametz`
    const metaDescription = breedData.meta?.description ||
      `Descubre todo sobre la raza ${breedData.name}. Cachorros disponibles, características, cuidados y más información.`

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: breedData.meta?.image?.url || breedData.mainImage?.url
          ? [{ url: breedData.meta?.image?.url || breedData.mainImage?.url }]
          : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata for breed:', error)
    return {
      title: 'Error',
      description: 'Ha ocurrido un error al cargar la información de la raza',
    }
  }
}

// Generar rutas estáticas para todas las razas
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const breeds = await payload.find({
    collection: 'breeds',
    limit: 100,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return breeds.docs.map((breed) => ({
    breed: breed.slug,
  }))
}
```

### Paso 2.2: Probar la implementación

1. Iniciar servidor de desarrollo
2. Visitar `/pomerania` (o el slug de una raza existente en Payload)
3. Verificar que:
   - La página carga correctamente
   - Se muestra la información de la raza
   - Los breadcrumbs funcionan
   - Los botones de CTA apuntan a las rutas correctas

## 📝 Notas Importantes

### Datos desde Payload

La colección `breeds` debe tener al menos:
- `name` (string)
- `slug` (string)
- `description` (richText)
- `mainImage` (upload)
- `_status` = 'published'

### Rutas Generadas

Con `generateStaticParams`, Next.js generará automáticamente las páginas estáticas para todas las razas publicadas en Payload.

### Revalidación

Las páginas se revalidarán cada 10 minutos (`revalidate = 600`) para mantener el contenido actualizado.

## 🚀 Próximos Pasos (FASE 3)

Una vez completadas las Fases 1 y 2:

1. Crear `/[breed]/cachorros/page.tsx`
2. Crear `/[breed]/ejemplares/page.tsx`
3. Implementar filtrado por raza
4. Añadir componentes avanzados (tabs, previews, etc.)
5. Optimizar SEO con structured data

## ✅ Checklist de Validación

### FASE 1
- [ ] Directorio `/paginas/[slug]` creado
- [ ] Archivos movidos correctamente
- [ ] Páginas de Payload funcionan en nueva ubicación
- [ ] No hay errores en consola

### FASE 2
- [ ] Directorio `/[breed]` creado
- [ ] `page.tsx` implementado
- [ ] Query de raza funciona
- [ ] `generateStaticParams` configurado
- [ ] Metadata dinámica funciona
- [ ] Página se renderiza correctamente
- [ ] Breadcrumbs funcionan
- [ ] Botones CTA apuntan a rutas correctas
- [ ] No hay errores en consola
