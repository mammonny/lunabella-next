# Plan de Implementación: Contador de "Me Gusta" para Cachorros (Limitado por Navegador)

Este plan detalla los pasos para implementar un botón de "Me gusta" en las páginas de detalles de los cachorros, permitiendo a los usuarios indicar su preferencia y limitando la acción a un "Me gusta" por navegador utilizando `localStorage`.

## 1. Backend (Payload CMS)

*   **Modificar Colección `puppies`:**
    *   Añadir un nuevo campo de tipo `number` llamado `likes`.
    *   Establecer un valor predeterminado de `0`.
    *   Configurar el campo para que sea accesible a través de la API (`readOnly: false` o simplemente no especificarlo si por defecto es editable vía API). No es necesario que sea visible o editable directamente en la interfaz de administración de Payload, ya que se gestionará mediante código.

## 2. Lógica de Incremento (Server Action en Next.js)

*   **Crear Server Action:**
    *   Crear un archivo, por ejemplo, `src/actions/likePuppy.ts`.
    *   Definir una función asíncrona exportada (Server Action) que acepte el `puppyId` como argumento.
    *   ```typescript
        'use server' // Directiva para Server Actions

        import { getPayload } from 'payload'
        import configPromise from '@payload-config'
        import { revalidatePath } from 'next/cache'

        export async function likePuppy(puppyId: string): Promise<{ success: boolean; newLikes?: number; error?: string }> {
          if (!puppyId) {
            return { success: false, error: 'Puppy ID is required' }
          }

          try {
            const payload = await getPayload({ config: configPromise })

            // Obtener el cachorro actual para leer sus likes
            // @ts-ignore - 'puppies' will be added to CollectionSlug after server restart
            const currentPuppy = await payload.findByID({
              collection: 'puppies',
              id: puppyId,
              depth: 0, // No necesitamos relaciones aquí
            })

            if (!currentPuppy) {
              return { success: false, error: 'Puppy not found' }
            }

            const currentLikes = typeof currentPuppy.likes === 'number' ? currentPuppy.likes : 0;
            const newLikes = currentLikes + 1;

            // Actualizar el cachorro con el nuevo contador de likes
            // @ts-ignore - 'puppies' will be added to CollectionSlug after server restart
            await payload.update({
              collection: 'puppies',
              id: puppyId,
              data: {
                likes: newLikes,
              },
            })

            // Opcional: Revalidar la ruta para que otros usuarios vean el contador actualizado
            // Puede ser costoso si hay muchos likes, considerar estrategias alternativas si es necesario.
            revalidatePath(`/puppies/${currentPuppy.slug}`) // Asumiendo que tienes el slug o puedes obtenerlo
            // O revalidar la página de listado si muestras los likes allí
            revalidatePath('/puppies')


            return { success: true, newLikes: newLikes }
          } catch (error) {
            console.error('Error liking puppy:', error)
            return { success: false, error: 'Failed to like puppy' }
          }
        }
        ```
    *   **Nota:** La Server Action simplemente incrementa el contador. La lógica para prevenir múltiples votos desde el mismo navegador reside en el frontend.

## 3. Frontend (Componente React - Botón de Me Gusta)

*   **Crear/Modificar Componente:** Se puede integrar directamente en `src/app/(frontend)/puppies/[slug]/page.tsx` o crear un componente dedicado (ej: `src/components/LikeButton.tsx`). Se recomienda un componente dedicado para mantener la página principal más limpia.
*   **Importaciones Necesarias:** `useState`, `useEffect`, `useTransition` de React, el icono `Heart` de `lucide-react`, y la Server Action `likePuppy`.
*   **Props del Componente:** Necesitará `puppyId` y `initialLikes`.
*   **Estado Local:**
    *   `likeCount`: `useState<number>(initialLikes)`
    *   `hasLiked`: `useState<boolean>(false)`
    *   `isLiking`: `useState<boolean>(false)` (Gestionado por `useTransition`)
*   **`useTransition`:** Para manejar el estado pendiente de la Server Action sin bloquear la UI.
    *   `const [isPending, startTransition] = useTransition();`
*   **`useEffect` para `localStorage`:**
    *   Se ejecuta al montar el componente.
    *   Lee la lista de IDs de cachorros likeados desde `localStorage.getItem('likedPuppies')`.
    *   Parsea el JSON (si existe) y comprueba si `puppyId` está en la lista.
    *   Si está, llama a `setHasLiked(true)`.
    *   ```typescript
        useEffect(() => {
          const likedPuppiesRaw = localStorage.getItem('likedPuppies');
          if (likedPuppiesRaw) {
            try {
              const likedPuppies: string[] = JSON.parse(likedPuppiesRaw);
              if (Array.isArray(likedPuppies) && likedPuppies.includes(puppyId)) {
                setHasLiked(true);
              }
            } catch (e) {
              console.error('Error parsing likedPuppies from localStorage', e);
              localStorage.removeItem('likedPuppies'); // Limpiar si está corrupto
            }
          }
        }, [puppyId]); // Dependencia puppyId por si el componente se reutiliza
        ```
*   **Renderizado del Botón:**
    *   Usar el componente `Button` de `shadcn/ui`.
    *   Mostrar el icono `Heart`. El atributo `fill` del icono dependerá de `hasLiked`.
        *   `fill={hasLiked ? 'currentColor' : 'none'}`
    *   Mostrar `likeCount` junto al icono.
    *   El atributo `disabled` del botón será `hasLiked || isPending`.
    *   El `onClick` llamará a la función `handleLike`.
*   **Función `handleLike`:**
    *   Llamada dentro de `startTransition`.
    *   Llama a la Server Action `likePuppy(puppyId)`.
    *   Maneja la respuesta:
        *   Si `success` es `true`:
            *   Actualiza `setLikeCount(result.newLikes)`.
            *   Actualiza `setHasLiked(true)`.
            *   Actualiza `localStorage`:
                *   Lee la lista actual de `localStorage`.
                *   Añade el `puppyId` si no está ya.
                *   Guarda la lista actualizada con `localStorage.setItem('likedPuppies', JSON.stringify(updatedList))`.
        *   Si `success` es `false`: Muestra un error (ej: usando `react-toastify` o similar).
    *   ```typescript
        const handleLike = () => {
          startTransition(async () => {
            const result = await likePuppy(puppyId);
            if (result.success && result.newLikes !== undefined) {
              setLikeCount(result.newLikes);
              setHasLiked(true);

              // Actualizar localStorage
              const likedPuppiesRaw = localStorage.getItem('likedPuppies');
              let likedPuppies: string[] = [];
              if (likedPuppiesRaw) {
                try {
                  likedPuppies = JSON.parse(likedPuppiesRaw);
                  if (!Array.isArray(likedPuppies)) likedPuppies = [];
                } catch {
                  likedPuppies = [];
                }
              }
              if (!likedPuppies.includes(puppyId)) {
                likedPuppies.push(puppyId);
                localStorage.setItem('likedPuppies', JSON.stringify(likedPuppies));
              }
            } else {
              // Manejar error (e.g., mostrar toast)
              console.error('Failed to like:', result.error);
            }
          });
        };
        ```

## 4. Integración en la Página del Cachorro

*   En `src/app/(frontend)/puppies/[slug]/page.tsx`:
    *   Asegurarse de que el campo `likes` se consulta en `queryPuppyBySlug`.
    *   Importar y usar el nuevo componente `LikeButton` (o integrar la lógica si no se creó un componente separado).
    *   Pasarle las props necesarias: `puppyId={puppy.id}` y `initialLikes={puppy.likes || 0}`.

## Diagrama de Flujo (Frontend - Resumen)

```mermaid
graph TD
    A[Carga Componente] --> B{Leer localStorage};
    B --> C{Ya dio Like?};
    C -- Sí --> D[Estado: hasLiked=true];
    C -- No --> E[Estado: hasLiked=false];
    D & E --> F[Renderizar Botón (Estilo/Deshabilitado según hasLiked/isPending)];

    subgraph Click Handler
        G[Click] --> H{Botón Habilitado?};
        H -- No --> I[Ignorar];
        H -- Sí --> J[startTransition];
        J --> K[Llamar Server Action likePuppy];
        K --> L{Éxito?};
        L -- Sí --> M[Actualizar Estado: likeCount, hasLiked=true];
        M --> N[Actualizar localStorage];
        L -- No --> O[Manejar Error];
    end
    F --> G;
```

## Consideraciones Adicionales

*   **Manejo de Errores:** Añadir feedback visual al usuario si la acción de dar "Me gusta" falla (ej: mensajes toast).
*   **Optimistic UI:** Para una respuesta más rápida, se podría actualizar el estado (`likeCount`, `hasLiked`) inmediatamente al hacer clic y revertirlo si la Server Action falla. Esto hace la UI más fluida pero añade complejidad. El plan actual espera la confirmación del servidor.
*   **Accesibilidad:** Asegurarse de que el botón sea accesible (ej: `aria-label="Dar me gusta"`).
*   **Estilo:** Ajustar el estilo del botón y el contador para que encajen con el diseño general.
