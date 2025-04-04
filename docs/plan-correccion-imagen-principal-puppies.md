# Plan para corregir la selección de imagen principal en la página de puppies

## Problema identificado

En la página de detalle de puppies (`src/app/(frontend)/puppies/[slug]/page.tsx`), se está utilizando el componente `Media` para mostrar la imagen principal del cachorro con el parámetro `size="square"`:

```tsx
<Media
  resource={mainImage}
  fill
  size="square"
  className="object-contain"
  priority
/>
```

Sin embargo, el componente `ImageMedia` no está utilizando este parámetro para seleccionar la versión cuadrada de la imagen. En su lugar, está utilizando la URL original de la imagen.

## Análisis técnico

1. **Configuración de imágenes en Payload CMS**:
   - En `src/collections/Media.ts`, Payload CMS está configurado para generar varios formatos de imagen, incluyendo un formato "square" de 500x500 píxeles.
   - Las imágenes procesadas se guardan con un formato de URL específico: `/api/media/file/[nombre-original]-[ancho]x[alto].[formato]`
   - Por ejemplo: `/api/media/file/perro-pomerania.jpg-500x500.webp`

2. **Componente ImageMedia actual**:
   - En `src/components/Media/ImageMedia/index.tsx`, la URL se construye así:
     ```tsx
     src = `${getClientSideURL()}${url}?${cacheTag}`
     ```
   - No se está teniendo en cuenta el parámetro `size` para seleccionar el formato específico de la imagen.

3. **Interfaz de Props**:
   - En `src/components/Media/types.ts`, el parámetro `size` está definido en la interfaz Props y está marcado como "for NextImage only".
   - Sin embargo, este parámetro debería utilizarse también para seleccionar el formato específico de la imagen.

## Solución propuesta

Modificar el componente `ImageMedia` para que utilice el parámetro `size` para construir la URL correcta que apunte al formato específico de la imagen:

1. **Modificar la construcción de la URL en ImageMedia**:
   - Si se proporciona un `size`, la URL debería incluir ese formato específico.
   - Si no se proporciona un `size`, se utilizará la URL original como fallback.

### Cambios específicos en el código

En el archivo `src/components/Media/ImageMedia/index.tsx`, modificar la construcción de la URL para tener en cuenta el parámetro `size`:

```tsx
// Código actual
src = `${getClientSideURL()}${url}?${cacheTag}`

// Código modificado
if (sizeFromProps && url) {
  // Extraer la extensión del archivo original
  const fileExtension = url.split('.').pop() || '';

  // Obtener las dimensiones según el tamaño seleccionado
  let dimensions = '';
  switch (sizeFromProps) {
    case 'square':
      dimensions = '500x500';
      break;
    case 'thumbnail':
      dimensions = '300x';
      break;
    case 'small':
      dimensions = '600x';
      break;
    case 'medium':
      dimensions = '900x';
      break;
    case 'large':
      dimensions = '1400x';
      break;
    case 'xlarge':
      dimensions = '1920x';
      break;
    case 'og':
      dimensions = '1200x630';
      break;
    default:
      // Si no coincide con ningún tamaño predefinido, usar la URL original
      dimensions = '';
  }

  if (dimensions) {
    // Construir la URL con el formato específico
    // Formato: /api/media/file/[nombre-original]-[dimensiones].webp
    const baseUrl = url.substring(0, url.lastIndexOf('.'));
    src = `${getClientSideURL()}${baseUrl}-${dimensions}.webp?${cacheTag}`;
  } else {
    // Usar la URL original si no hay dimensiones específicas
    src = `${getClientSideURL()}${url}?${cacheTag}`;
  }
} else {
  // Si no se proporciona un size, usar la URL original
  src = `${getClientSideURL()}${url}?${cacheTag}`;
}
```

## Pruebas

1. **Verificar que la imagen principal en la página de detalle de puppies ahora muestra correctamente la versión cuadrada**:
   - Acceder a la página de detalle de un cachorro.
   - Comprobar que la imagen principal se muestra correctamente en formato cuadrado.
   - Verificar que no hay errores en la consola del navegador.

2. **Comprobar que otras imágenes en el sitio siguen funcionando correctamente**:
   - Verificar que las imágenes en la galería de la página de detalle se muestran correctamente.
   - Comprobar que las imágenes en otras páginas del sitio también se muestran correctamente.

## Diagrama de la solución

```mermaid
flowchart TD
    A[Página de Puppies] -->|resource={mainImage}, size="square"| B[Componente Media]
    B -->|props| C[Componente ImageMedia]
    C -->|Actualmente| D[Construye URL sin formato específico]
    C -->|Propuesta| E[Construye URL con formato 'square']
    E -->|Resultado| F[Imagen cuadrada mostrada correctamente]

    subgraph "Proceso de construcción de URL"
    G[Verificar si hay parámetro 'size'] -->|Sí| H[Determinar dimensiones según 'size']
    H -->|Dimensiones encontradas| I[Construir URL con dimensiones específicas]
    H -->|Dimensiones no encontradas| J[Usar URL original]
    G -->|No| J
    end
```

## Implementación

Una vez aprobado este plan, se procederá a implementar los cambios en el componente `ImageMedia` y a realizar las pruebas correspondientes para verificar que la solución funciona correctamente.
