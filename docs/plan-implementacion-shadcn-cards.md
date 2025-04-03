# Plan de Implementación: Migración a PuppyCardShadcn en PuppiesArchive

## Objetivo
Implementar las tarjetas de Shadcn UI (PuppyCardShadcn) en el componente PuppiesArchive, reemplazando las tarjetas originales (PuppyCard).

## Análisis de la situación actual

### Componentes actuales:
1. **PuppyCard.tsx**: Componente original que utiliza elementos HTML básicos con clases de Tailwind.
2. **PuppyCardShadcn.tsx**: Versión mejorada que utiliza los componentes de UI de Shadcn (Card, CardHeader, CardContent, CardFooter, etc.).
3. **PuppiesArchive/index.tsx**: Actualmente utiliza el componente PuppyCard.
4. **PuppiesArchiveComparison/index.tsx**: Muestra ambas versiones de las tarjetas para comparación.

### Páginas que utilizan estos componentes:
- **puppies/page.tsx**: Utiliza PuppiesArchiveComparison para mostrar la comparativa.
- **puppies/[slug]/page.tsx**: Página de detalle que no utiliza directamente ninguno de los componentes de tarjeta.

## Cambios necesarios

La migración es relativamente sencilla ya que ambos componentes (PuppyCard y PuppyCardShadcn) tienen la misma interfaz de props:
- `className`: Para estilos adicionales
- `doc`: Datos del cachorro
- `relationTo`: Colección a la que pertenece el cachorro
- `showBreed`: Indica si se debe mostrar la raza

### Modificaciones a realizar:

1. **En PuppiesArchive/index.tsx**:
   - Cambiar la importación de PuppyCard a PuppyCardShadcn
   - Actualizar el uso del componente en el JSX

```diff
- import { PuppyCard, CardPuppyData } from '@/components/Card/PuppyCard'
+ import { PuppyCardShadcn, CardPuppyData } from '@/components/Card/PuppyCardShadcn'

// ...

- <PuppyCard className="h-full" doc={result} relationTo="puppies" showBreed />
+ <PuppyCardShadcn className="h-full" doc={result} relationTo="puppies" showBreed />
```

## Ventajas de la migración

1. **Mejor diseño visual**: Las tarjetas de Shadcn tienen un diseño más moderno y profesional.
2. **Componentes más semánticos**: Uso de Card, CardHeader, CardContent, etc. en lugar de divs anidados.
3. **Efectos visuales mejorados**: Transiciones, sombras y efectos hover más refinados.
4. **Mejor uso de los componentes de UI**: Aprovechamiento de la biblioteca Shadcn UI.

## Pasos de implementación

1. Modificar el archivo `src/components/PuppiesArchive/index.tsx`:
   - Cambiar la importación de `PuppyCard` a `PuppyCardShadcn`
   - Actualizar el componente utilizado en el JSX de `PuppyCard` a `PuppyCardShadcn`
   - Mantener los mismos props que se están pasando actualmente

2. Verificar que no haya otros archivos que necesiten ser modificados para mantener la coherencia.

3. Probar el funcionamiento correcto de la página de cachorros para asegurar que la migración se ha realizado correctamente.
