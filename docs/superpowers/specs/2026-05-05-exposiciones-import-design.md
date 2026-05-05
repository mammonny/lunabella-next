# Importación de Exposiciones desde el WordPress antiguo

**Fecha:** 2026-05-05
**Estado:** Diseño aprobado, pendiente de implementación
**Autor:** Brainstorm Claude + mammonny

## Objetivo

Importar las entradas históricas de la categoría "Exposiciones" del WordPress antiguo (`https://www.lunabella.es/archives/category/exposiciones`) al nuevo CMS Payload, preservando título, fecha, juez (si está disponible), descripción, imágenes y, en la medida de lo posible, los premios (awards) extraídos automáticamente del contenido.

Volumen estimado: ≤15 exposiciones. Operación de un solo tirón (one-shot), no recurrente.

## Decisiones tomadas durante el brainstorm

| Pregunta | Elección |
|---|---|
| Origen de datos | **B** — Scraping del HTML público (no hay acceso al WordPress) |
| Manejo de perros no creados | **D** — `awards[].dog` opcional + `awards[].dogName` libre + hook autolink |
| Escala / modo | **A** — Pocas entradas (≤15), script simple con dry-run obligatorio |
| Extracción de awards | **B** — Asistida por LLM (Claude vía Vercel AI Gateway) |

## Cambios de schema (one-time)

### `src/collections/Exhibitions.ts`

En el array `awards`:

- `dog`: pasa de `required: true` a opcional.
- Nuevo campo `dogName: text` opcional, label "Nombre del perro (texto libre)".
  Admin description: "Usar cuando el ejemplar no esté creado en el sistema. Si más adelante se crea un Ejemplar con este nombre, se enlazará automáticamente."
- Validación a nivel de fila del array: al menos uno de `dog` o `dogName` debe estar presente. Si ambos están vacíos → error de validación.

### `src/collections/Dogs.ts`

Nuevo `afterChange` hook llamado `autolinkOrphanAwards`:

- Se dispara cuando un Ejemplar se crea o actualiza con `_status === 'published'`.
- Busca todas las exposiciones donde algún `awards[].dog` es null y `awards[].dogName` coincide (case-insensitive, trim) con `doc.name` o `doc.apodo`.
- Para cada match: actualiza ese award poniendo `dog = doc.id` (mantiene `dogName` para trazabilidad histórica).
- Pasa `context: { disableRevalidate: true }` al update para evitar cascadas y bucles con el resto de hooks.
- Si hay más de un Ejemplar publicado con el mismo `name` (ambigüedad), el hook no enlaza nada y loguea una advertencia.

### Migración

Se genera con `pnpm payload migrate:create exhibitions-awards-optional-dog` y se ejecuta antes de correr el importer. La migración hace `dog` nullable y añade la columna `dogName` (Postgres). No requiere backfill (no hay datos existentes con awards aún).

## Arquitectura del importador

Un script en dos fases. Fase 1 nunca toca Payload; produce un JSON intermedio que el usuario puede revisar/editar. Fase 2 lee ese JSON y crea registros vía Payload Local API.

```
scripts/
└── exhibitions/
    ├── scrape.ts                # Fase 1
    ├── import.ts                # Fase 2
    └── lib/
        ├── fetch-page.ts        # fetch + retry + cheerio loader
        ├── extract-post.ts      # parser de un post WP individual
        ├── extract-awards.ts    # AI SDK → Claude → awards estructurados
        ├── html-to-lexical.ts   # HTML → Lexical richText
        ├── upload-media.ts      # download URL → Payload media create
        └── fuzzy-match-dog.ts   # name/apodo matching contra Ejemplares

tmp/
└── exhibitions-import.json      # gitignored
```

### Fase 1 — Scrape (`pnpm tsx scripts/exhibitions/scrape.ts`)

1. **Paginar el archivo** `https://www.lunabella.es/archives/category/exposiciones/page/N/` (N = 1, 2, …) hasta que la respuesta sea 404 o no contenga posts.
2. **Recolectar URLs** de cada post desde los `<article>` o `<h2 class="entry-title"> a` de cada página de archivo.
3. **Para cada post URL** (con concurrencia limitada, p. ej. 3 en paralelo):
   - Fetch HTML con reintentos (3, backoff exponencial 500ms / 1s / 2s).
   - Parsear con `cheerio`.
   - Extraer:
     - `title` → de `<h1 class="entry-title">` o `og:title`.
     - `date` → de `<meta property="article:published_time">` (ISO). Fallback: `<time class="entry-date">`.
     - `contentHtml` → HTML interno de `.entry-content` (o equivalente del tema antiguo).
     - `featuredImageUrl` → de `og:image`.
     - `galleryUrls` → todas las `<img src>` dentro del cuerpo, deduplicadas, excluyendo la imagen destacada y excluyendo iconos/sprites por dimensión < 200px (parsear `width`/`height` si están).
     - `juez` → buscar patrones `/juez:?\s+([A-Z][^\n.]+)/i` dentro del contenido o cabecera (best-effort, opcional).
     - `sourceUrl` → la URL original.
4. **Llamada al LLM por exposición** (`extract-awards.ts`):
   - Modelo: `anthropic/claude-sonnet-4-6` vía `gateway('anthropic/claude-sonnet-4-6')` del AI SDK v6.
   - Función: `generateObject` con un schema zod `awardsSchema = z.object({ awards: z.array(z.object({ dogName: z.string(), title: z.string(), position: z.enum(['first','second','third','special','other']).optional() })) })`.
   - Prompt: instrucciones claras (en español) explicando que extraiga premios mencionados en el cuerpo del post, devolviendo `dogName`, `title` (CAC, CACIB, Mejor de Raza, etc.) y `position` cuando sea inferible. Si no hay awards claras, devolver array vacío.
   - Cada award se marca con `_aiExtracted: true` en el JSON intermedio.
5. **Escribir** `tmp/exhibitions-import.json` con la forma:

```json
{
  "scrapedAt": "2026-05-05T...",
  "exhibitions": [
    {
      "sourceUrl": "...",
      "title": "...",
      "slug": "slug-del-titulo",
      "date": "2018-05-12",
      "juez": "...",
      "featuredImageUrl": "...",
      "galleryUrls": ["...", "..."],
      "contentHtml": "...",
      "awards": [
        { "dogName": "Lunabella's Maya", "title": "CAC", "position": "first", "_aiExtracted": true }
      ]
    }
  ]
}
```

El usuario revisa el JSON manualmente antes de pasar a la Fase 2. Puede editar/borrar awards, ajustar nombres de perros, etc.

### Fase 2 — Import (`pnpm tsx scripts/exhibitions/import.ts`)

1. Carga `tmp/exhibitions-import.json`.
2. Inicializa Payload Local API con `getPayload({ config: configPromise })`. Lee `.env` con `dotenv/config`.
3. **Resumibilidad**: para cada exposición, antes de hacer nada, comprueba si ya existe una `exposiciones` con el mismo `slug` (`payload.find({ collection: 'exposiciones', where: { slug: { equals } }, limit: 1 })`). Si existe → skip + log "skipping (already imported): X".
4. Para cada exposición no existente:
   - **Descargar y subir imagen destacada**: fetch del `featuredImageUrl` → buffer → `payload.create({ collection: 'media', file: { data, mimetype, name, size } })` → guarda el `id` retornado. Si falla → loguear y abortar esa exposición (mainImage es obligatoria en el schema).
   - **Descargar y subir galería**: idéntico para cada URL en `galleryUrls`. Si una imagen falla, log + continúa con las demás (galería es opcional).
   - **Convertir descripción**: `htmlToLexical(contentHtml)` → estructura Lexical de Payload. Estrategia técnica en sección dedicada abajo.
   - **Resolver awards**:
     - Para cada award, llamar `fuzzyMatchDog(dogName)`:
       - Busca Ejemplares por `name` (exacto, case-insensitive, trim) → si hay 1 match único → usa ese id.
       - Si no, busca por `apodo` con misma lógica.
       - Si no, intenta Levenshtein con threshold ≤2 sobre `name`. Si hay 1 candidato bajo el threshold → usa ese id.
       - Si no → devuelve `null`.
     - Si match → `{ dog: id, dogName, title, position }` (mantenemos `dogName` también para trazabilidad).
     - Si no → `{ dogName, title, position }` (sin `dog`).
   - **Crear exposición** con `payload.create({ collection: 'exposiciones', data: {...}, draft: true })`. Siempre como **borrador** para que el usuario revise en `/admin` antes de publicar.
5. **Resumen final**: imprime un reporte con creadas/saltadas/falladas y la lista de awards huérfanas (sin `dog`).

## HTML → Lexical (richText)

Riesgo técnico señalado durante el brainstorm. Estrategia:

- **Primer intento**: usar utilidades del paquete `@payloadcms/richtext-lexical` que ya está en deps. Buscar `convertHTMLToLexical`, `consolidateHTMLConverters`, o helpers análogos en la versión instalada (Payload 3.31).
- **Fallback**: usar `JSDOM` para parsear el HTML y mapear manualmente a nodos Lexical (`paragraph`, `heading`, `text`, `link`, `image` si hay), construyendo el JSON Lexical a mano. La estructura mínima es:

```ts
{
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [ /* paragraphs, headings, etc. */ ],
    direction: 'ltr',
  },
}
```

- Si el HTML del WP antiguo es muy crudo (galerías inline, shortcodes), el converter debe ser tolerante: ante etiquetas desconocidas, extraer el texto y meterlo como párrafo. No es crítico tener fidelidad perfecta — el contenido principal se preserva.

Decisión durante implementación: si el helper oficial existe y produce salida válida para los posts antiguos, usarlo. Si no, escribir un converter mínimo en `scripts/exhibitions/lib/html-to-lexical.ts`.

## Manejo de errores

| Caso | Comportamiento |
|---|---|
| Listado sin posts (404 en página N) | Termina la paginación (no es error) |
| Fetch de post individual falla tras 3 reintentos | Log + omite ese post, continúa con los demás |
| Sin `og:image` y sin `<img>` en el body | Marca `featuredImageUrl: null` en JSON. Fase 2 loguea error claro y omite esa exposición |
| LLM devuelve JSON inválido | `generateObject` con zod ya valida; si falla, awards vacío + log warning |
| Imagen de galería falla al descargar | Log + skip esa imagen, exposición continúa |
| `slug` ya existe en Payload | Skip (resumibilidad) |
| Hook autolink: múltiples Ejemplares con mismo name | No enlaza, log warning, deja `dogName` para revisión manual |
| Award con `dogName` vacío y `dog` null | Validación de Payload rechaza. El importer debe filtrar antes de crear |

## Tech stack

- **Scraping**: `cheerio` (añadir a deps si no está) + `undici`/fetch nativo (Node 24).
- **LLM**: AI SDK v6 (`ai` + `@ai-sdk/gateway`), modelo `anthropic/claude-sonnet-4-6` por defecto. Requiere `AI_GATEWAY_API_KEY` en `.env` (añadir a la sección de variables requeridas en el README si procede).
- **HTML → Lexical**: helpers de `@payloadcms/richtext-lexical` (verificar API en versión instalada), fallback con `jsdom`.
- **Payload**: Local API. El script importa `payload-config` y llama `getPayload({ config })`.
- **TypeScript**: zod para schemas de I/O del JSON intermedio; tipos de Payload (`Exposicione`, `Ejemplare`, `Media`) para el output. Ejecutar con `tsx`.
- **Variables de entorno**: las mismas que el dev server (`POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `PAYLOAD_SECRET`, …) más `AI_GATEWAY_API_KEY`.

## Workflow de uso

```bash
# 1. Aplicar el cambio de schema y migrar
pnpm payload migrate:create exhibitions-awards-optional-dog
pnpm payload migrate

# 2. Fase 1: scraping → JSON intermedio
pnpm tsx scripts/exhibitions/scrape.ts
# → produce tmp/exhibitions-import.json

# 3. Revisar manualmente el JSON (editar awards, ajustar dogNames, etc.)

# 4. Fase 2: import a Payload (en dev contra DB local, o contra Neon)
pnpm tsx scripts/exhibitions/import.ts

# 5. Revisar borradores en /admin/collections/exposiciones, publicar
```

## Fuera de alcance (YAGNI)

- Importar otras categorías del WordPress antiguo (posts del blog, puppies, etc.).
- Migrar comentarios o cuentas de usuario.
- Sincronización bidireccional o re-importación incremental cuando el WordPress viejo siga vivo.
- UI de revisión/aprobación dentro del admin de Payload (el JSON intermedio + revisión manual del borrador es suficiente para ≤15 entradas).
- Mapeo automático de `position` desde texto libre — el LLM lo intenta; si no encaja, se queda como `'other'` o vacío.
- Tests unitarios exhaustivos del scraper. Sí se incluyen unos cuantos tests para `fuzzy-match-dog.ts` y para `html-to-lexical.ts` (los componentes con más lógica reutilizable).

## Riesgos y áreas de incertidumbre

1. **HTML→Lexical**: la mayor incógnita técnica. Mitigación: helper oficial primero, fallback manual.
2. **Hook autolink y bucles de revalidación**: pasamos `context.disableRevalidate` en el update para cortarlos. Validar con un caso real durante implementación.
3. **Calidad de awards extraídos por LLM**: depende del estilo de redacción del WP antiguo. El usuario revisa el JSON antes de importar; aceptable.
4. **Rendimiento del scraping**: ≤15 posts ≈ pocos segundos. No requiere optimización.
5. **Cambio de schema con autosave de drafts activo**: las exposiciones existentes (creadas antes del cambio) podrían tener awards con `dog` requerido en su versión publicada. Validar tras la migración que ninguna exposición existente queda en estado inválido.

## Criterios de éxito

- [ ] Las ≤15 exposiciones del WordPress antiguo aparecen como borradores en `/admin/collections/exposiciones` con título, fecha, descripción, imagen destacada y galería.
- [ ] Las awards extraídas por el LLM aparecen en el panel "Premios" de cada exposición; las que coinciden con un Ejemplar existente quedan enlazadas, las que no, conservan el `dogName` libre.
- [ ] La página pública `/exposiciones/[slug]` renderiza correctamente cada exposición tras publicarla manualmente.
- [ ] Crear un nuevo Ejemplar cuyo `name` coincida con un `dogName` huérfano enlaza automáticamente esa award (autolink).
- [ ] Re-ejecutar `import.ts` no duplica registros (resumibilidad).
