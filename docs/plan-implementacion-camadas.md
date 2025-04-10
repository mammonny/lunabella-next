# Plan de Implementación: Gestión de Camadas

Este documento detalla el plan para añadir la funcionalidad de gestión de camadas al proyecto Payload CMS.

## 1. Crear una Nueva Colección: `Litters` (Camadas)

-   **Archivo:** `src/collections/Litters.ts`
-   **Propósito:** Almacenar la información de cada camada.
-   **Campos Propuestos:**
    -   `name` (Texto, Requerido): Identificador de la camada (ej: "Camada Pastor Alemán 2025-08").
    -   `father` (Relación con `dogs`, Requerido): Selección del perro macho (padre).
    -   `mother` (Relación con `dogs`, Requerido): Selección de la perra hembra (madre).
    -   `birthDate` (Fecha, Opcional): Fecha de nacimiento de la camada.
    -   `description` (Texto Enriquecido, Opcional): Notas o detalles sobre la camada.
    -   `slug` (Slug, Autogenerado): Para URLs amigables.

## 2. Modificar la Colección Existente: `Puppies` (Cachorros)

-   **Archivo:** `src/collections/Puppies.ts`
-   **Añadir Campo:**
    -   `litter` (Relación con `litters`, Opcional): Campo para seleccionar la camada a la que pertenece el cachorro. Será opcional para permitir cachorros sin camada asignada.
-   **Consideración sobre Padres:** Se mantienen los campos `father` y `mother` existentes en `Puppies`.

## 3. Actualizar la Configuración Global de Payload

-   **Archivo:** `src/payload.config.ts`
-   **Acciones:**
    -   Importar la nueva colección `Litters`.
    -   Añadir `Litters` al array `collections`.

## Visualización de la Estructura (Mermaid)

```mermaid
graph TD
    subgraph Collections
        Dogs(Dogs)
        Puppies(Puppies)
        Litters(Litters) -- Nueva --
        Breeds(Breeds)
        Media(Media)
    end

    Litters -- father (Requerido) --> Dogs
    Litters -- mother (Requerido) --> Dogs
    Puppies -- litter (Opcional) --> Litters
    Puppies -- father (Existente) --> Dogs
    Puppies -- mother (Existente) --> Dogs
    Puppies -- breed --> Breeds
    Dogs -- breed --> Breeds
    Puppies -- mainImage --> Media
    Puppies -- gallery --> Media
    Dogs -- mainImage --> Media
    Dogs -- gallery --> Media

    style Litters fill:#ccf,stroke:#333,stroke-width:2px
```

## Siguientes Pasos

1.  **Implementación:** Cambiar al modo "code" para escribir el código necesario.
