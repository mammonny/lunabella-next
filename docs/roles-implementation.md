# Implementación de Roles en el CMS

## Estructura de Roles

### Admin (Existente)
- Acceso total a todas las colecciones y funcionalidades
- Utiliza la configuración actual de Payload CMS

### Editor (Nuevo)
- Acceso limitado a colecciones específicas:
  * Dogs
  * Breeds
- No tiene acceso a otras colecciones o configuraciones del sistema

## Plan de Implementación

1. Modificar la colección Users:
   - Agregar campo `isEditor` (boolean)
   - Mantener la configuración actual de admin

2. Modificar las colecciones Dogs y Breeds:
   - Actualizar la lógica de acceso para permitir:
     * Admins: acceso total (ya implementado)
     * Editores: acceso total a estas colecciones
     * Otros usuarios: acceso restringido (ya implementado)

3. Mantener otras colecciones sin cambios:
   - Continuar con la configuración actual que solo permite acceso a admins

## Beneficios del Enfoque

- Simplicidad: Mantiene la estructura actual de admin y solo agrega un rol de editor
- Claridad: Separación clara de responsabilidades entre admins y editores
- Mantenibilidad: Fácil de mantener y extender en el futuro si se necesitan más roles
