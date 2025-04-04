# Plan de Implementación: Carrusel de Otros Cachorros Disponibles

Este plan describe los pasos para reemplazar la sección estática "Otros cachorros disponibles" en la página de detalles de un cachorro por un carrusel dinámico e interactivo que muestre otros cachorros realmente disponibles.

## 1. Crear Componente Reutilizable `PuppyCard`

*   **Objetivo:** Encapsular la lógica de renderizado de una tarjeta de cachorro individual para mantener el código limpio y reutilizable.
*   **Archivo:** `src/components/PuppyCard/index.tsx`
*   **Tipo:** Componente de Cliente (`'use client'`) o Servidor, dependiendo de si necesita interactividad propia o solo muestra datos. Probablemente pueda ser un Server Component si solo muestra datos y contiene un Link.
*   **Props:**
    *   `puppy`: Objeto con los datos del cachorro (tipo `Puppy` de `@/payload-types`). Campos mínimos necesarios: `id`, `slug`, `name`, `breed` (objeto relacionado o solo nombre), `price`, `mainImage` (objeto de media), `disponibilidad`, `birthDate`, `gender`.
    *   `className?`: string (opcional para estilos adicionales).
*   **Contenido:**
    *   Usar `Card`, `CardContent` de `shadcn/ui`.
    *   Mostrar la imagen principal (`mainImage`) usando el componente `Media` o `Image` de Next.js. Asegurar un aspect ratio consistente (ej: `aspect-square`).
    *   Mostrar un `Badge` con el estado (`disponibilidad`).
    *   Mostrar nombre, raza.
    *   Mostrar información adicional útil (ej: edad calculada a partir de `birthDate`, género).
    *   Mostrar el precio.
    *   Incluir un botón o un `Link` de Next.js que envuelva la tarjeta o un botón "Ver detalles" que apunte a la URL del cachorro: `/puppies/${puppy.slug}`.

## 2. Crear Componente `OtherAvailablePuppiesCarousel`

*   **Objetivo:** Obtener los datos de otros cachorros disponibles y mostrarlos en un carrusel interactivo.
*   **Archivo:** `src/components/OtherAvailablePuppiesCarousel/index.tsx`
*   **Tipo:** Server Component (para la obtención de datos en el servidor).
*   **Props:**
    *   `currentPuppyId`: string (El ID del cachorro que se está viendo actualmente, para excluirlo).
    *   `limit?`: number (Opcional, cuántos cachorros obtener, ej: 8 por defecto).
*   **Lógica Interna:**
    *   Usar `async` en la definición del componente.
    *   Obtener instancia de `payload` (`getPayload`).
    *   Realizar consulta `payload.find`:
        *   `collection: 'puppies'`
        *   `where`:
            *   `disponibilidad: { equals: 'available' }`
            *   `id: { not_equals: currentPuppyId }`
        *   `limit`: Usar el prop `limit` o un valor por defecto (ej: 8).
        *   `depth`: Ajustar según sea necesario para popular `breed` y `mainImage` (ej: `depth: 1`).
        *   `sort`: Opcional, ej: `-birthDate` (más recientes primero).
    *   Manejar el caso donde no se encuentren otros cachorros (`puppies.docs.length === 0`). Mostrar un mensaje apropiado.
*   **Renderizado (JSX):**
    *   Usar `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` de `@/components/ui/carousel`.
    *   Configurar `Carousel` con opciones deseadas:
        ```jsx
        <Carousel
          opts={{
            align: "start",
            loop: puppies.docs.length > 4, // Activar loop si hay suficientes items
          }}
          className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto" // Ajustar max-width según diseño
        >
          <CarouselContent className="-ml-4">
            {puppies.docs.map((puppy) => (
              <CarouselItem key={puppy.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"> {/* Ajustar basis para mostrar 1, 2, 3 o 4 items */}
                <div className="p-1">
                  <PuppyCard puppy={puppy as Puppy} /> {/* Usar el componente PuppyCard */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" /> {/* Ajustar posición y visibilidad */}
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" /> {/* Ajustar posición y visibilidad */}
        </Carousel>
        ```
    *   Ajustar `basis-*` en `CarouselItem` y `max-w-*` en `Carousel` para controlar cuántas tarjetas son visibles a la vez en diferentes tamaños de pantalla. El ejemplo muestra 4 en pantallas `xl`.
    *   Ajustar la posición y visibilidad de `CarouselPrevious` y `CarouselNext`.

## 3. Integración en la Página del Cachorro

*   **Archivo:** `src/app/(frontend)/puppies/[slug]/page.tsx`
*   **Modificaciones:**
    *   Importar `OtherAvailablePuppiesCarousel`.
    *   Localizar la sección `div` que contiene el título "Otros cachorros disponibles" y el grid estático (aproximadamente líneas 339-392).
    *   Reemplazar el contenido de esa sección (el `div` con el grid y el mapeo `[1, 2, 3, 4].map`) por la instancia del nuevo componente:
        ```tsx
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">Otros cachorros disponibles</h2>
             {/* Los botones de navegación ahora estarán DENTRO del carrusel */}
           </div>
           {/* Renderizar el carrusel pasando el ID del cachorro actual */}
           <OtherAvailablePuppiesCarousel currentPuppyId={puppy.id} />
         </div>
        ```
    *   Eliminar las importaciones de `ArrowLeft`, `ArrowRight` de `lucide-react` si ya no se usan en otro lugar de este archivo.
    *   Asegurarse de que el objeto `puppy` obtenido al inicio de la página contenga el `id`.

## Diagrama de Flujo

```mermaid
graph TD
    A[Puppy Page Request] --> B{Page Component (page.tsx)};
    B --> C[Obtener datos del cachorro actual (incl. ID)];
    B --> D(Render Layout);
    D --> E[Render Info Principal];
    D --> F[Render OtherAvailablePuppiesCarousel];
    F -- Pass currentPuppyId --> G{OtherAvailablePuppiesCarousel (Server Component)};
    G --> H[payload.find(available puppies != currentPuppyId)];
    H --> I{Lista de otros cachorros};
    I -- No hay --> J[Render Mensaje "No hay otros"];
    I -- Sí hay --> K[Render Carousel Component (shadcn/ui)];
    K --> L[Loop sobre lista de cachorros];
    L --> M(Render PuppyCard);
    M -- Pass puppy data --> N[PuppyCard Component];
    N --> O[Render Tarjeta HTML con Link];
    K --> P[Render Botones Prev/Next];
    O & P & J --> Q[HTML Final de la Sección];
    E & Q --> R[Página Completa Renderizada];

```

## Consideraciones

*   **Estilo:** Ajustar los estilos (padding, márgenes, tamaño de fuente) de `PuppyCard` y el carrusel para que coincidan con el diseño general.
*   **Rendimiento:** Seleccionar solo los campos necesarios en la consulta de Payload para minimizar la carga de datos.
*   **Instalación:** Asegurarse de que `@radix-ui/react-icons` (si se usan iconos específicos de Radix para los botones del carrusel) y `embla-carousel-react` estén instalados si se usan los componentes de carrusel de `shadcn/ui`.
