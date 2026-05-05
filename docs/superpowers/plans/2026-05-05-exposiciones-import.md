# Importación de Exposiciones desde el WordPress antiguo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Importar las ≤15 exposiciones del WordPress antiguo (`https://www.lunabella.es/archives/category/exposiciones`) al CMS Payload nuevo, preservando título, fecha, descripción, imágenes y premios extraídos asistidos por LLM, con un cambio de schema que permite premios sin Ejemplar creado y autolink retroactivo.

**Architecture:** Script en dos fases — Fase 1 scrapea HTML público y produce un JSON intermedio revisable; Fase 2 lee el JSON y crea registros vía Payload Local API (todo como borrador para revisión manual). Cambio de schema previo: `awards[].dog` opcional + `awards[].dogName` libre + hook autolink en Ejemplares.

**Tech Stack:** Payload 3.84.1, Next.js 15, Node 20+, TypeScript ESM, `cheerio` (parsing HTML), `@payloadcms/richtext-lexical` `convertHTMLToLexical` + `jsdom` (HTML → Lexical), AI SDK v6 con `@ai-sdk/gateway` (Claude Sonnet 4.6), `zod` (validación), `tsx` (ejecutor TS), `node --test` (tests).

**Spec de referencia:** `docs/superpowers/specs/2026-05-05-exposiciones-import-design.md`

---

## File Structure

**Created:**
- `scripts/exhibitions/scrape.ts` — entry point Fase 1
- `scripts/exhibitions/import.ts` — entry point Fase 2
- `scripts/exhibitions/lib/fetch-page.ts` — fetch + retry + cheerio loader
- `scripts/exhibitions/lib/extract-post.ts` — parse de un post WP individual
- `scripts/exhibitions/lib/extract-awards.ts` — LLM extractor (AI SDK + zod)
- `scripts/exhibitions/lib/html-to-lexical.ts` — HTML → Lexical richText
- `scripts/exhibitions/lib/upload-media.ts` — descarga URL → Payload media create
- `scripts/exhibitions/lib/fuzzy-match-dog.ts` — fuzzy match contra Ejemplares
- `scripts/exhibitions/lib/types.ts` — tipos compartidos del JSON intermedio
- `scripts/exhibitions/__fixtures__/sample-post.html` — HTML de muestra para tests
- `scripts/exhibitions/__tests__/extract-post.test.ts` — tests del parser
- `scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts` — tests del matcher
- Una migración `src/migrations/<timestamp>_exhibitions_awards_optional_dog.ts` (generada por payload CLI)

**Modified:**
- `src/collections/Exhibitions.ts` — `awards.dog` opcional + nuevo `awards.dogName` + validación
- `src/collections/Dogs.ts` — añadir hook `autolinkOrphanAwards`
- `src/app/(frontend)/exposiciones/[slug]/page.tsx` — renderer awards con fallback a `dogName`
- `src/components/ExhibitionCard/index.tsx` — idem
- `src/migrations/index.ts` — registrar la nueva migración (Payload lo regenera)
- `src/payload-types.ts` — regenerado por `pnpm generate:types`
- `package.json` — nuevas deps
- `.gitignore` — añadir `tmp/`

---

## Task 1: Setup — instalar dependencias y preparar gitignore

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Instalar deps de runtime**

Run:
```bash
pnpm add cheerio jsdom zod ai @ai-sdk/gateway
```

Expected: estas 5 entradas aparecen en `dependencies` de `package.json`.

- [ ] **Step 2: Instalar deps de desarrollo**

Run:
```bash
pnpm add -D tsx @types/jsdom
```

Expected: aparecen en `devDependencies`.

- [ ] **Step 3: Añadir `tmp/` y `__fixtures__` cache a `.gitignore`**

Edit `.gitignore`, añadir al final:

```gitignore

# Import scripts intermediate output
tmp/
```

- [ ] **Step 4: Verificar instalación**

Run:
```bash
pnpm tsx --version
```

Expected: prints tsx version (no error).

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore: añadir deps para importador de exposiciones"
```

---

## Task 2: Cambiar schema — `awards.dog` opcional + nuevo `dogName` + validación

**Files:**
- Modify: `src/collections/Exhibitions.ts:138-176`

- [ ] **Step 1: Editar el array `awards` en Exhibitions.ts**

Reemplazar el bloque `fields: [...]` dentro de `awards` (líneas ~140-175) por:

```typescript
{
  name: 'awards',
  type: 'array',
  label: 'Premios Obtenidos',
  validate: ((value) => {
    if (!Array.isArray(value)) return true
    for (let i = 0; i < value.length; i++) {
      const row = value[i] as { dog?: unknown; dogName?: string } | undefined
      const hasDog = !!row?.dog
      const hasDogName = typeof row?.dogName === 'string' && row.dogName.trim().length > 0
      if (!hasDog && !hasDogName) {
        return `Fila ${i + 1}: indica un Ejemplar o un Nombre del perro (texto libre).`
      }
    }
    return true
  }) as any,
  fields: [
    {
      name: 'dog',
      type: 'relationship',
      relationTo: 'ejemplares',
      label: 'Ejemplar',
      admin: {
        description: 'Selecciona el Ejemplar premiado. Déjalo vacío si el perro no está en el sistema y usa el campo de texto.',
      },
    },
    {
      name: 'dogName',
      type: 'text',
      label: 'Nombre del perro (texto libre)',
      admin: {
        description: 'Usar cuando el Ejemplar no esté creado en el sistema. Si más adelante se crea un Ejemplar con este nombre, se enlazará automáticamente.',
        condition: (_data, siblingData) => !siblingData?.dog,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titulo/Premio',
      admin: {
        description: 'Ej: Mejor de Raza, CAC, CACIB, etc.',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Posicion',
      options: [
        { label: '1er Lugar', value: 'first' },
        { label: '2do Lugar', value: 'second' },
        { label: '3er Lugar', value: 'third' },
        { label: 'Mencion Especial', value: 'special' },
        { label: 'Otro', value: 'other' },
      ],
    },
  ],
},
```

- [ ] **Step 2: Verificar tipo**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors. Si los hay, ajustar el cast de `validate` o el tipado de la fila.

- [ ] **Step 3: Commit**

```bash
git add src/collections/Exhibitions.ts
git commit -m "feat(exposiciones): hacer dog opcional y añadir dogName libre con validación"
```

---

## Task 3: Actualizar renderers públicos para fallback a `dogName`

**Files:**
- Modify: `src/app/(frontend)/exposiciones/[slug]/page.tsx:431-433` y `:539-541`
- Modify: `src/components/ExhibitionCard/index.tsx:99-103` y `:243-247`

- [ ] **Step 1: Página de detalle — `PodiumCard` (line 431-433)**

Buscar:
```typescript
const dog = award.dog as Ejemplare | null
// ...
const dogName = dog && typeof dog === 'object' ? dog.name : 'Ejemplar'
```

Reemplazar por:
```typescript
const dog = award.dog as Ejemplare | null
const fallbackName = (award as { dogName?: string }).dogName?.trim()
const dogName = dog && typeof dog === 'object' ? dog.name : (fallbackName || 'Ejemplar')
```

Aplicar en las dos ocurrencias del fichero (~line 433 y ~line 541).

- [ ] **Step 2: ExhibitionCard — list view (line 99-103)**

Buscar:
```typescript
typeof award.dog === 'object' && award.dog !== null
  ? award.dog.name
```

Reemplazar por:
```typescript
typeof award.dog === 'object' && award.dog !== null
  ? award.dog.name
  : (award as { dogName?: string }).dogName?.trim() || 'Ejemplar'
```

(Quitar la rama actual que usa `'Ejemplar'` como fallback final si hay dos ramas — mantener una sola expresión ternaria.)

Aplicar en las dos ocurrencias (~line 101 y ~line 245).

- [ ] **Step 3: Verificar tipo**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Verificar lint**

Run:
```bash
pnpm lint
```

Expected: no new warnings.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(frontend\)/exposiciones/\[slug\]/page.tsx src/components/ExhibitionCard/index.tsx
git commit -m "feat(exposiciones): fallback a dogName cuando no hay Ejemplar enlazado"
```

---

## Task 4: Regenerar tipos y crear migración Payload

**Files:**
- Modify: `src/payload-types.ts` (auto-regenerado)
- Create: `src/migrations/<timestamp>_exhibitions_awards_optional_dog.ts` (auto-generado)
- Modify: `src/migrations/index.ts` (auto-regenerado)

- [ ] **Step 1: Regenerar tipos**

Run:
```bash
pnpm generate:types
```

Expected: `src/payload-types.ts` actualizado. En el tipo `Exposicione`, dentro de `awards[].`, ahora `dog?` (opcional) y nuevo `dogName?: string | null`.

- [ ] **Step 2: Generar migración**

Run:
```bash
pnpm payload migrate:create exhibitions-awards-optional-dog
```

Expected: aparece un nuevo fichero `src/migrations/<timestamp>_exhibitions_awards_optional_dog.ts` y `src/migrations/index.ts` registra la migración.

- [ ] **Step 3: Inspeccionar migración**

Read el fichero generado. Verificar que:
- `ALTER TABLE "exposiciones_awards" ALTER COLUMN "dog_id" DROP NOT NULL` (o equivalente).
- `ALTER TABLE "exposiciones_awards" ADD COLUMN "dog_name" varchar` (o `text`).
- Tabla `_exposiciones_v_version_awards` recibe el mismo tratamiento.
- `down()` revierte ambos cambios.

Si algo falta o sobra, editar manualmente el SQL.

- [ ] **Step 4: Aplicar migración localmente**

Run (asegúrate de tener Postgres dev arriba con `docker-compose up` si aplica):
```bash
pnpm payload migrate
```

Expected: log `Migration <timestamp>_exhibitions_awards_optional_dog up` ejecutada sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/payload-types.ts src/migrations/
git commit -m "feat(exposiciones): migración para dog opcional y dogName"
```

---

## Task 5: Hook autolink en Dogs.ts

**Files:**
- Modify: `src/collections/Dogs.ts` (importar `Where`, añadir hook nuevo, registrarlo en `hooks.afterChange`)

- [ ] **Step 1: Añadir el hook `autolinkOrphanAwards`**

En `src/collections/Dogs.ts`, justo después del import de `Ejemplare` y antes de `revalidateDog`, añadir:

```typescript
import type { Where } from 'payload'

const autolinkOrphanAwards: CollectionAfterChangeHook<Ejemplare> = async ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc
  if (doc._status !== 'published') return doc

  const candidateNames = [doc.name, doc.apodo].filter(
    (n): n is string => typeof n === 'string' && n.trim().length > 0,
  )
  if (candidateNames.length === 0) return doc

  const where: Where = {
    or: candidateNames.flatMap((n) => [
      { 'awards.dogName': { equals: n } },
      { 'awards.dogName': { like: n } },
    ]),
  }

  const orphanExhibitions = await payload.find({
    collection: 'exposiciones',
    where,
    depth: 0,
    limit: 100,
  })

  for (const exh of orphanExhibitions.docs) {
    let mutated = false
    const newAwards = (exh.awards ?? []).map((award) => {
      if (award.dog) return award
      const free = (award.dogName ?? '').trim().toLowerCase()
      if (!free) return award
      const matches = candidateNames.some((n) => n.trim().toLowerCase() === free)
      if (!matches) return award

      // Bail out if there are multiple published Ejemplares with this name
      // (handled below with a payload.find before assignment)
      mutated = true
      return { ...award, dog: doc.id }
    })

    if (!mutated) continue

    // Ambiguity check: if more than one published Ejemplar shares this name, skip
    const ambiguousNames = await payload.find({
      collection: 'ejemplares',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { name: { in: candidateNames } },
        ],
      },
      depth: 0,
      limit: 5,
    })
    if (ambiguousNames.totalDocs > 1) {
      payload.logger.warn(
        `[autolinkOrphanAwards] Multiple Ejemplares match "${candidateNames.join(', ')}", skipping autolink for exhibition "${exh.slug}"`,
      )
      continue
    }

    await payload.update({
      collection: 'exposiciones',
      id: exh.id,
      data: { awards: newAwards },
      context: { disableRevalidate: true },
    })
    payload.logger.info(
      `[autolinkOrphanAwards] Linked ${candidateNames[0]} into exhibition "${exh.slug}"`,
    )
  }

  return doc
}
```

- [ ] **Step 2: Registrar el hook**

En el bloque `hooks.afterChange`, cambiar:

```typescript
afterChange: [revalidateDog],
```

a:

```typescript
afterChange: [revalidateDog, autolinkOrphanAwards],
```

- [ ] **Step 3: Verificar tipos y lint**

Run:
```bash
pnpm tsc --noEmit && pnpm lint
```

Expected: no errors.

- [ ] **Step 4: Smoke manual (opcional pero recomendado)**

Levanta dev server (`pnpm dev`), crea una Exposición de prueba con un award que tenga `dogName: "TestPerro"` y sin `dog`, publícala. Luego crea un Ejemplar con `name: "TestPerro"`, asígnale imagen y publícalo. Vuelve a la exposición — el award debe haberse enlazado al Ejemplar nuevo. Borra ambos al terminar.

Si esto falla, revisar logs y ajustar antes de seguir.

- [ ] **Step 5: Commit**

```bash
git add src/collections/Dogs.ts
git commit -m "feat(ejemplares): autolink retroactivo de awards huérfanos por nombre"
```

---

## Task 6: Tipos compartidos del JSON intermedio

**Files:**
- Create: `scripts/exhibitions/lib/types.ts`

- [ ] **Step 1: Crear el fichero de tipos**

```typescript
// scripts/exhibitions/lib/types.ts
import { z } from 'zod'

export const awardPositionSchema = z.enum(['first', 'second', 'third', 'special', 'other'])

export const scrapedAwardSchema = z.object({
  dogName: z.string().min(1),
  title: z.string().min(1),
  position: awardPositionSchema.optional(),
  _aiExtracted: z.literal(true).optional(),
})

export const scrapedExhibitionSchema = z.object({
  sourceUrl: z.string().url(),
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string(), // ISO
  juez: z.string().nullable(),
  featuredImageUrl: z.string().url().nullable(),
  galleryUrls: z.array(z.string().url()),
  contentHtml: z.string(),
  awards: z.array(scrapedAwardSchema),
})

export const scrapedJsonSchema = z.object({
  scrapedAt: z.string(),
  exhibitions: z.array(scrapedExhibitionSchema),
})

export type ScrapedAward = z.infer<typeof scrapedAwardSchema>
export type ScrapedExhibition = z.infer<typeof scrapedExhibitionSchema>
export type ScrapedJson = z.infer<typeof scrapedJsonSchema>
```

- [ ] **Step 2: Verificar compilación**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/exhibitions/lib/types.ts
git commit -m "feat(scripts): tipos compartidos del JSON intermedio de exposiciones"
```

---

## Task 7: `fetch-page.ts` — fetch con reintentos + cheerio

**Files:**
- Create: `scripts/exhibitions/lib/fetch-page.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/lib/fetch-page.ts
import * as cheerio from 'cheerio'

export interface FetchOptions {
  retries?: number
  baseDelayMs?: number
  acceptStatus?: number[]
}

export async function fetchHtml(
  url: string,
  opts: FetchOptions = {},
): Promise<{ status: number; html: string }> {
  const retries = opts.retries ?? 3
  const baseDelay = opts.baseDelayMs ?? 500
  const accept = opts.acceptStatus ?? [200, 404]

  let lastErr: unknown
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'lunabella-importer/1.0' },
      })
      if (!accept.includes(res.status) && res.status !== 200) {
        throw new Error(`HTTP ${res.status} for ${url}`)
      }
      const html = res.status === 200 ? await res.text() : ''
      return { status: res.status, html }
    } catch (err) {
      lastErr = err
      if (attempt < retries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise((r) => setTimeout(r, delay))
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(`Failed to fetch ${url} after ${retries} attempts`)
}

export function loadCheerio(html: string) {
  return cheerio.load(html)
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add scripts/exhibitions/lib/fetch-page.ts
git commit -m "feat(scripts): fetch con reintentos para scraper de exposiciones"
```

---

## Task 8: `extract-post.ts` — TDD del parser de un post WP

**Files:**
- Create: `scripts/exhibitions/__fixtures__/sample-post.html`
- Create: `scripts/exhibitions/__tests__/extract-post.test.ts`
- Create: `scripts/exhibitions/lib/extract-post.ts`

- [ ] **Step 1: Crear fixture HTML**

Descargar un post real del WP antiguo para usar como fixture. Run:
```bash
mkdir -p scripts/exhibitions/__fixtures__
curl -sSL -o scripts/exhibitions/__fixtures__/sample-post.html \
  "$(curl -sSL https://www.lunabella.es/archives/category/exposiciones | grep -oE 'href="https://www.lunabella.es/archives/[0-9]+[^"]*"' | head -1 | cut -d'"' -f2)"
ls -la scripts/exhibitions/__fixtures__/sample-post.html
```

Expected: fichero existe y > 5 KB. Si la heurística del listado falla, descargar manualmente cualquier URL `https://www.lunabella.es/archives/<n>` de un post de exposiciones.

- [ ] **Step 2: Escribir test (failing)**

Crear `scripts/exhibitions/__tests__/extract-post.test.ts`:

```typescript
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { extractPost } from '../lib/extract-post.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixture = readFileSync(join(here, '../__fixtures__/sample-post.html'), 'utf8')
const sourceUrl = 'https://www.lunabella.es/archives/sample-post'

describe('extractPost', () => {
  it('extracts title', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.ok(post.title.length > 0, 'title must be non-empty')
  })

  it('extracts a parseable ISO date', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.ok(!Number.isNaN(Date.parse(post.date)), `date "${post.date}" must be parseable`)
  })

  it('extracts contentHtml that contains a paragraph', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.match(post.contentHtml, /<p[\s>]/i, 'contentHtml must contain at least one <p>')
  })

  it('returns dedup gallery without the featured image', () => {
    const post = extractPost(fixture, sourceUrl)
    const set = new Set(post.galleryUrls)
    assert.equal(set.size, post.galleryUrls.length, 'gallery must be deduped')
    if (post.featuredImageUrl) {
      assert.ok(
        !post.galleryUrls.includes(post.featuredImageUrl),
        'featured image should not appear in gallery',
      )
    }
  })

  it('produces a slug derived from the title', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.match(post.slug, /^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with dashes')
  })
})
```

- [ ] **Step 3: Run test, expect fail**

Run:
```bash
node --import tsx --test scripts/exhibitions/__tests__/extract-post.test.ts
```

Expected: ERR (Cannot find module `../lib/extract-post.ts`).

- [ ] **Step 4: Implementar `extract-post.ts`**

Crear `scripts/exhibitions/lib/extract-post.ts`:

```typescript
// scripts/exhibitions/lib/extract-post.ts
import { loadCheerio } from './fetch-page.ts'

export interface ExtractedPost {
  sourceUrl: string
  title: string
  slug: string
  date: string
  juez: string | null
  featuredImageUrl: string | null
  galleryUrls: string[]
  contentHtml: string
}

const ICON_MIN_DIMENSION = 200

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function extractPost(html: string, sourceUrl: string): ExtractedPost {
  const $ = loadCheerio(html)

  const title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('h1.entry-title').first().text().trim() ||
    $('h1').first().text().trim()

  const dateRaw =
    $('meta[property="article:published_time"]').attr('content')?.trim() ||
    $('time.entry-date').attr('datetime')?.trim() ||
    $('time').first().attr('datetime')?.trim() ||
    new Date().toISOString()

  const featuredImageUrl =
    $('meta[property="og:image"]').attr('content')?.trim() || null

  const $content = $('.entry-content').first().length
    ? $('.entry-content').first()
    : $('article').first()
  const contentHtml = $content.html()?.trim() ?? ''

  const judgeMatch = contentHtml.match(/juez[:\s]+([^\n.<]{2,80})/i)
  const juez = judgeMatch ? judgeMatch[1].trim() : null

  const galleryUrls: string[] = []
  const seen = new Set<string>()
  $content.find('img').each((_, el) => {
    const $img = $(el)
    const src = ($img.attr('data-src') || $img.attr('src') || '').trim()
    if (!src) return
    const w = parseInt($img.attr('width') ?? '', 10)
    const h = parseInt($img.attr('height') ?? '', 10)
    if (Number.isFinite(w) && w > 0 && w < ICON_MIN_DIMENSION) return
    if (Number.isFinite(h) && h > 0 && h < ICON_MIN_DIMENSION) return
    if (featuredImageUrl && src === featuredImageUrl) return
    if (seen.has(src)) return
    seen.add(src)
    galleryUrls.push(src)
  })

  return {
    sourceUrl,
    title,
    slug: slugify(title),
    date: dateRaw,
    juez,
    featuredImageUrl,
    galleryUrls,
    contentHtml,
  }
}
```

- [ ] **Step 5: Run test, expect pass**

Run:
```bash
node --import tsx --test scripts/exhibitions/__tests__/extract-post.test.ts
```

Expected: all 5 tests pass. Si fallan, ajustar selectores/heurística — la página antigua puede usar clases distintas a `.entry-content` o `.entry-title`.

- [ ] **Step 6: Commit**

```bash
git add scripts/exhibitions/__fixtures__/ scripts/exhibitions/__tests__/extract-post.test.ts scripts/exhibitions/lib/extract-post.ts
git commit -m "feat(scripts): parser de post WP con tests sobre fixture real"
```

---

## Task 9: `extract-awards.ts` — extracción de premios con AI SDK

**Files:**
- Create: `scripts/exhibitions/lib/extract-awards.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/lib/extract-awards.ts
import { generateObject } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { z } from 'zod'
import type { ScrapedAward } from './types.ts'

const llmAwardSchema = z.object({
  dogName: z.string().min(1).describe('Nombre del perro tal como aparece en el texto'),
  title: z.string().min(1).describe('Título o premio (ej. CAC, CACIB, Mejor de Raza, BIS)'),
  position: z
    .enum(['first', 'second', 'third', 'special', 'other'])
    .optional()
    .describe('first/second/third para podio; special para mención; other si no encaja'),
})

const llmResponseSchema = z.object({
  awards: z.array(llmAwardSchema),
})

const SYSTEM = `Eres un asistente que extrae premios caninos de descripciones en HTML
provenientes de un blog antiguo de criadores de Golden Retriever.

Devuelve un array JSON de awards. Cada award:
- dogName: nombre del perro mencionado (literal, sin afijos)
- title: título obtenido (CAC, CACIB, Mejor de Raza, BIS, etc.)
- position: first/second/third si se trata de podio numérico, special para menciones, other para el resto

Si la descripción no menciona premios concretos, devuelve un array vacío.
Si un premio aplica a varios perros, genera un award por perro.
No inventes datos.`

export async function extractAwardsFromHtml(
  contentHtml: string,
  opts: { model?: string } = {},
): Promise<ScrapedAward[]> {
  const model = opts.model ?? 'anthropic/claude-sonnet-4-6'

  // Strip tags to plain text to keep the prompt small
  const text = contentHtml
    .replace(/<\/(p|div|h\d|li|br)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (text.length === 0) return []

  const { object } = await generateObject({
    model: gateway(model),
    schema: llmResponseSchema,
    system: SYSTEM,
    prompt: `Texto de la exposición:\n\n${text}`,
  })

  return object.awards.map((a) => ({ ...a, _aiExtracted: true as const }))
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke manual con AI Gateway**

Verificar que `AI_GATEWAY_API_KEY` está en `.env`. Si no, pedir al usuario que la añada antes de seguir. Crear un test ad-hoc opcional `scripts/exhibitions/__tests__/extract-awards.smoke.ts`:

```typescript
import { extractAwardsFromHtml } from '../lib/extract-awards.ts'
const html = `<p>Lunabella's Maya obtuvo CAC y Mejor de Raza. Lunabella's Toby quedó segundo en clase abierta.</p>`
const awards = await extractAwardsFromHtml(html)
console.log(JSON.stringify(awards, null, 2))
```

Run (sólo si AI_GATEWAY_API_KEY está configurada):
```bash
pnpm tsx --env-file=.env scripts/exhibitions/__tests__/extract-awards.smoke.ts
```

Expected: imprime un array con 2 awards. Si la key no está, salta este step.

- [ ] **Step 4: Commit**

```bash
git add scripts/exhibitions/lib/extract-awards.ts scripts/exhibitions/__tests__/extract-awards.smoke.ts 2>/dev/null
git commit -m "feat(scripts): extractor de premios asistido por LLM (Claude vía AI Gateway)"
```

---

## Task 10: `scrape.ts` — entry point Fase 1

**Files:**
- Create: `scripts/exhibitions/scrape.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/scrape.ts
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fetchHtml, loadCheerio } from './lib/fetch-page.ts'
import { extractPost } from './lib/extract-post.ts'
import { extractAwardsFromHtml } from './lib/extract-awards.ts'
import { scrapedJsonSchema, type ScrapedExhibition } from './lib/types.ts'

const ARCHIVE_BASE = 'https://www.lunabella.es/archives/category/exposiciones'
const OUTPUT_PATH = 'tmp/exhibitions-import.json'
const MAX_PAGES = 20

function collectPostUrls(html: string): string[] {
  const $ = loadCheerio(html)
  const urls = new Set<string>()
  $('article a, h2.entry-title a, h2 a').each((_, el) => {
    const href = $(el).attr('href')?.trim()
    if (!href) return
    if (!/^https:\/\/www\.lunabella\.es\/archives\/[^/?#]+\/?$/.test(href)) return
    if (/category|tag|page/.test(href)) return
    urls.add(href)
  })
  return Array.from(urls)
}

async function gatherListing(): Promise<string[]> {
  const all = new Set<string>()
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = page === 1 ? `${ARCHIVE_BASE}/` : `${ARCHIVE_BASE}/page/${page}/`
    const { status, html } = await fetchHtml(url)
    if (status === 404) break
    const found = collectPostUrls(html)
    if (found.length === 0) break
    const before = all.size
    found.forEach((u) => all.add(u))
    console.log(`  page ${page}: ${found.length} urls (${all.size - before} new)`)
    if (all.size === before) break
  }
  return Array.from(all)
}

async function scrapeOne(url: string): Promise<ScrapedExhibition | null> {
  console.log(`→ ${url}`)
  try {
    const { status, html } = await fetchHtml(url)
    if (status !== 200) {
      console.warn(`  skipped (status ${status})`)
      return null
    }
    const post = extractPost(html, url)
    const awards = await extractAwardsFromHtml(post.contentHtml).catch((err) => {
      console.warn(`  LLM extraction failed: ${err}`)
      return []
    })
    return { ...post, awards }
  } catch (err) {
    console.error(`  failed: ${err}`)
    return null
  }
}

async function main() {
  console.log('Fase 1 — scraping')
  console.log('Archive listing…')
  const urls = await gatherListing()
  console.log(`Found ${urls.length} exhibition posts`)

  const exhibitions: ScrapedExhibition[] = []
  for (const url of urls) {
    const result = await scrapeOne(url)
    if (result) exhibitions.push(result)
  }

  const output = {
    scrapedAt: new Date().toISOString(),
    exhibitions,
  }
  scrapedJsonSchema.parse(output)

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8')
  console.log(`\n✓ Wrote ${exhibitions.length} exhibitions to ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Run**

Run:
```bash
pnpm tsx --env-file=.env scripts/exhibitions/scrape.ts
```

Expected: log con páginas + URLs encontradas, luego una línea por exposición. Al final, fichero `tmp/exhibitions-import.json` creado y validado por zod.

Si zod falla por una URL no válida (`featuredImageUrl` o galería), revisar `extract-post.ts` para hacer las URLs absolutas o relajar el schema.

- [ ] **Step 3: Revisar el JSON manualmente**

Read `tmp/exhibitions-import.json`. Verificar que:
- Hay ≤15 exposiciones (el conteo coincide con el listado público).
- Cada una tiene `title`, `date` ISO, `featuredImageUrl`, `contentHtml`.
- Las awards parecen razonables (LLM puede haber inventado o no encontrar nada — está bien, las revisamos).

Editar a mano si quieres ajustar nombres de perros antes del import.

- [ ] **Step 4: Commit**

```bash
git add scripts/exhibitions/scrape.ts
git commit -m "feat(scripts): entry point de scraping (Fase 1) → JSON intermedio"
```

---

## Task 11: `html-to-lexical.ts` — conversión usando helper oficial

**Files:**
- Create: `scripts/exhibitions/lib/html-to-lexical.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/lib/html-to-lexical.ts
import { JSDOM } from 'jsdom'
import { convertHTMLToLexical } from '@payloadcms/richtext-lexical'
import { getDefaultSanitizedEditorConfig } from '@payloadcms/richtext-lexical/utilities/getDefaultSanitizedEditorConfig'
import type { Payload } from 'payload'

let cachedConfig: Awaited<ReturnType<typeof getDefaultSanitizedEditorConfig>> | null = null

export async function htmlToLexical(html: string, payload: Payload) {
  if (!cachedConfig) {
    cachedConfig = await getDefaultSanitizedEditorConfig({
      config: payload.config,
      parentIsLocalized: false,
    })
  }
  return convertHTMLToLexical({
    editorConfig: cachedConfig,
    html: html || '<p></p>',
    JSDOM: JSDOM as unknown as new (html: string) => { window: { document: Document } },
  })
}
```

Si la ruta `@payloadcms/richtext-lexical/utilities/...` no resuelve a tipos, importar el helper desde `@payloadcms/richtext-lexical/dist/utilities/getDefaultSanitizedEditorConfig.js` o usar `payload.config.editor` (el editor del root config) y llamar al sanitizer disponible. Verificar al ejecutar y ajustar.

- [ ] **Step 2: Verificar tipos**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors. Si la ruta de import del utility no existe, ajustar siguiendo la API real (revisar `node_modules/@payloadcms/richtext-lexical/package.json` para ver subpath exports).

- [ ] **Step 3: Commit**

```bash
git add scripts/exhibitions/lib/html-to-lexical.ts
git commit -m "feat(scripts): conversor HTML → Lexical para importador"
```

---

## Task 12: `upload-media.ts` — descargar URL y crear Media

**Files:**
- Create: `scripts/exhibitions/lib/upload-media.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/lib/upload-media.ts
import { basename } from 'node:path'
import type { Payload } from 'payload'

export async function uploadFromUrl(
  payload: Payload,
  url: string,
  alt?: string,
): Promise<number | string> {
  const res = await fetch(url, { headers: { 'user-agent': 'lunabella-importer/1.0' } })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} downloading ${url}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  const data = Buffer.from(arrayBuffer)

  const mimetype = res.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg'
  const rawName = decodeURIComponent(basename(new URL(url).pathname)) || 'image'
  const name = rawName.replace(/[^\w.\-]/g, '_').slice(0, 120)

  const created = await payload.create({
    collection: 'media',
    data: { alt: alt ?? rawName },
    file: { data, mimetype, name, size: data.byteLength },
  })

  return created.id
}
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors. Si `file` no es aceptado por el tipo de `payload.create`, importar `File` de `payload` o castear a `any` (es un subset documentado de la Local API).

- [ ] **Step 3: Commit**

```bash
git add scripts/exhibitions/lib/upload-media.ts
git commit -m "feat(scripts): subida de imágenes remotas a la colección Media"
```

---

## Task 13: `fuzzy-match-dog.ts` — TDD del matcher

**Files:**
- Create: `scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts`
- Create: `scripts/exhibitions/lib/fuzzy-match-dog.ts`

- [ ] **Step 1: Escribir test (failing)**

```typescript
// scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { matchDog } from '../lib/fuzzy-match-dog.ts'

const dogs = [
  { id: 1, name: "Lunabella's Maya", apodo: 'Maya' },
  { id: 2, name: "Lunabella's Toby", apodo: null },
  { id: 3, name: "Lunabella's Aria", apodo: 'Ari' },
]

describe('matchDog', () => {
  it('exact name match', () => {
    assert.equal(matchDog("Lunabella's Maya", dogs)?.id, 1)
  })

  it('case-insensitive trim match', () => {
    assert.equal(matchDog("  lunabella's toby  ", dogs)?.id, 2)
  })

  it('matches by apodo', () => {
    assert.equal(matchDog('Maya', dogs)?.id, 1)
  })

  it('one-typo Levenshtein <=2 unique → matches', () => {
    assert.equal(matchDog("Lunabela's Maya", dogs)?.id, 1)
  })

  it('returns null when nothing close enough', () => {
    assert.equal(matchDog('Random Dog', dogs), null)
  })

  it('returns null when ambiguous (multiple within threshold)', () => {
    const ambiguous = [
      { id: 1, name: 'Maya', apodo: null },
      { id: 2, name: 'Mara', apodo: null },
    ]
    assert.equal(matchDog('Mxya', ambiguous), null)
  })
})
```

- [ ] **Step 2: Run test, expect fail**

Run:
```bash
node --import tsx --test scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts
```

Expected: ERR (cannot find module).

- [ ] **Step 3: Implementar**

```typescript
// scripts/exhibitions/lib/fuzzy-match-dog.ts
export interface DogCandidate {
  id: number | string
  name: string
  apodo?: string | null
}

const THRESHOLD = 2

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = a.length
  const n = b.length
  const prev = new Array(n + 1)
  const curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

export function matchDog(query: string, dogs: DogCandidate[]): DogCandidate | null {
  const q = normalize(query)
  if (!q) return null

  const exact = dogs.filter(
    (d) => normalize(d.name) === q || (d.apodo && normalize(d.apodo) === q),
  )
  if (exact.length === 1) return exact[0]
  if (exact.length > 1) return null

  const scored = dogs
    .map((d) => {
      const dn = levenshtein(q, normalize(d.name))
      const da = d.apodo ? levenshtein(q, normalize(d.apodo)) : Infinity
      return { dog: d, score: Math.min(dn, da) }
    })
    .filter((x) => x.score <= THRESHOLD)
    .sort((a, b) => a.score - b.score)

  if (scored.length === 0) return null
  if (scored.length === 1) return scored[0].dog
  if (scored[0].score < scored[1].score) return scored[0].dog
  return null // ambiguous
}
```

- [ ] **Step 4: Run test, expect pass**

Run:
```bash
node --import tsx --test scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/exhibitions/__tests__/fuzzy-match-dog.test.ts scripts/exhibitions/lib/fuzzy-match-dog.ts
git commit -m "feat(scripts): fuzzy matcher de Ejemplares con tests"
```

---

## Task 14: `import.ts` — entry point Fase 2

**Files:**
- Create: `scripts/exhibitions/import.ts`

- [ ] **Step 1: Implementación**

```typescript
// scripts/exhibitions/import.ts
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '@payload-config'
import { scrapedJsonSchema, type ScrapedExhibition } from './lib/types.ts'
import { htmlToLexical } from './lib/html-to-lexical.ts'
import { uploadFromUrl } from './lib/upload-media.ts'
import { matchDog, type DogCandidate } from './lib/fuzzy-match-dog.ts'

const INPUT_PATH = 'tmp/exhibitions-import.json'

async function loadDogs(payload: Awaited<ReturnType<typeof getPayload>>): Promise<DogCandidate[]> {
  const result = await payload.find({
    collection: 'ejemplares',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })
  return result.docs.map((d) => ({ id: d.id, name: d.name, apodo: d.apodo ?? null }))
}

async function importOne(
  payload: Awaited<ReturnType<typeof getPayload>>,
  exh: ScrapedExhibition,
  dogs: DogCandidate[],
): Promise<'created' | 'skipped' | 'failed'> {
  const existing = await payload.find({
    collection: 'exposiciones',
    where: { slug: { equals: exh.slug } },
    limit: 1,
    depth: 0,
  })
  if (existing.totalDocs > 0) {
    console.log(`⏭  ${exh.slug} (already imported)`)
    return 'skipped'
  }

  if (!exh.featuredImageUrl) {
    console.error(`✗ ${exh.slug}: no featuredImageUrl`)
    return 'failed'
  }

  let mainImageId: number | string
  try {
    mainImageId = await uploadFromUrl(payload, exh.featuredImageUrl, exh.title)
  } catch (err) {
    console.error(`✗ ${exh.slug}: featured image upload failed: ${err}`)
    return 'failed'
  }

  const gallery: { image: number | string; caption?: string }[] = []
  for (const url of exh.galleryUrls) {
    try {
      const id = await uploadFromUrl(payload, url, exh.title)
      gallery.push({ image: id })
    } catch (err) {
      console.warn(`  ⚠ gallery image skipped (${url}): ${err}`)
    }
  }

  const lexical = await htmlToLexical(exh.contentHtml, payload)

  const awards = exh.awards
    .filter((a) => a.dogName.trim().length > 0 && a.title.trim().length > 0)
    .map((a) => {
      const matched = matchDog(a.dogName, dogs)
      return {
        ...(matched ? { dog: matched.id } : {}),
        dogName: a.dogName,
        title: a.title,
        position: a.position,
      }
    })

  await payload.create({
    collection: 'exposiciones',
    data: {
      name: exh.title,
      slug: exh.slug,
      date: exh.date,
      mainImage: mainImageId,
      description: lexical,
      location: null,
      juez: exh.juez ?? null,
      gallery,
      awards,
      _status: 'draft',
    } as any,
    draft: true,
  })

  console.log(`✓ ${exh.slug} (${awards.length} awards, ${gallery.length} gallery imgs)`)
  return 'created'
}

async function main() {
  console.log('Fase 2 — import')
  const raw = await readFile(INPUT_PATH, 'utf8')
  const data = scrapedJsonSchema.parse(JSON.parse(raw))

  const payload = await getPayload({ config })
  const dogs = await loadDogs(payload)
  console.log(`Loaded ${dogs.length} published Ejemplares for matching`)

  let created = 0
  let skipped = 0
  let failed = 0
  for (const exh of data.exhibitions) {
    const result = await importOne(payload, exh, dogs)
    if (result === 'created') created++
    else if (result === 'skipped') skipped++
    else failed++
  }

  console.log(`\nSummary: created=${created}, skipped=${skipped}, failed=${failed}`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Verificar tipos**

Run:
```bash
pnpm tsc --noEmit
```

Expected: no errors. Si `as any` en el `data` molesta a la config de eslint, reemplazarlo con un cast más específico al tipo `Exposicione` sin `id`/`createdAt`/`updatedAt`.

- [ ] **Step 3: Asegurar que `dotenv` está disponible**

Run:
```bash
ls node_modules/dotenv/package.json 2>/dev/null && echo present || pnpm add dotenv
```

Expected: `present` (Payload lo trae transitivamente) o se instala.

- [ ] **Step 4: Commit**

```bash
git add scripts/exhibitions/import.ts package.json pnpm-lock.yaml
git commit -m "feat(scripts): entry point de importación (Fase 2) a Payload"
```

---

## Task 15: Run end-to-end y revisión final

**Files:** ninguno modificado en este task (smoke run + ajustes manuales si los hubiera).

- [ ] **Step 1: Asegurar entorno limpio**

Verificar que:
- Postgres dev está arriba (Docker o local).
- Migración aplicada (`pnpm payload migrate` produce "no migrations to apply").
- `.env` tiene `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `PAYLOAD_SECRET`, `AI_GATEWAY_API_KEY`.

- [ ] **Step 2: Ejecutar Fase 1**

Run:
```bash
pnpm tsx --env-file=.env scripts/exhibitions/scrape.ts
```

Expected: `tmp/exhibitions-import.json` con N exposiciones (idealmente todas las del archivo público).

- [ ] **Step 3: Revisar JSON intermedio**

Read `tmp/exhibitions-import.json`. Editar manualmente si:
- Algún `dogName` claramente mal extraído por el LLM → corregir.
- Alguna entrada tiene `awards` inventadas → vaciar el array.
- Falta `featuredImageUrl` → si es importante esa exposición, descargar imagen alternativa y rellenar a mano (o aceptar que se omita).

- [ ] **Step 4: Ejecutar Fase 2**

Run:
```bash
pnpm tsx --env-file=.env scripts/exhibitions/import.ts
```

Expected: una línea ✓/⏭/✗ por exposición y un resumen al final con contadores.

- [ ] **Step 5: Verificar en /admin**

Levantar dev server (`pnpm dev`) y abrir `http://localhost:3000/admin/collections/exposiciones`. Confirmar que:
- Aparecen las exposiciones importadas como **borrador**.
- Cada una tiene mainImage, fecha, descripción y gallery.
- Los awards huérfanos (sin Ejemplar) muestran el `dogName` libre.
- Los matcheados muestran la relación al Ejemplar.

- [ ] **Step 6: Verificar render público (de un borrador)**

Publicar una exposición a mano desde el admin y abrir `/exposiciones/<slug>`. Confirmar que renderiza igual que el WP antiguo (lo razonable).

- [ ] **Step 7: Probar el autolink (smoke)**

Si quedó algún award con sólo `dogName`:
- Crea un Ejemplar publicado cuyo `name` coincida exactamente con ese `dogName`.
- Vuelve a la exposición → el award debe haber adquirido `dog`.

Si esto falla, revisar logs del hook `autolinkOrphanAwards`.

- [ ] **Step 8: Commit final (si quedaron ajustes)**

```bash
git status
# si hay diffs por correcciones manuales en código:
git add -A
git commit -m "chore(exposiciones): ajustes tras smoke run del importador"
```

---

## Self-Review (post-plan)

**1. Spec coverage:**

| Spec section | Tasks |
|---|---|
| Cambios de schema en Exhibitions | 2 |
| Hook autolink en Dogs | 5 |
| Migración Payload | 4 |
| Fase 1 — scrape (paginado, extracción, LLM, JSON) | 7, 8, 9, 10 |
| Fase 2 — import (Local API, drafts, resumibilidad, fuzzy, media, lexical) | 11, 12, 13, 14 |
| Manejo de errores (retry fetch, sin og:image, LLM falla, slug duplicado, ambiguidad) | 7 (retry), 9 (LLM catch), 10 (status), 14 (slug skip), 5 (ambiguity), 14 (no image) |
| Tests sobre extract-post y fuzzy-match | 8, 13 |
| Renderers públicos con fallback dogName | 3 |
| Workflow de uso completo | 4 (migrate), 10 (Fase 1), 14 (Fase 2), 15 (smoke) |
| Fuera de alcance — explicit | n/a (ningún task lo cubre, intencional) |

Cobertura completa.

**2. Placeholder scan:** ningún "TBD"/"TODO"/"add appropriate". Cada step tiene comando o código concreto.

**3. Type consistency:** `DogCandidate.id` es `number | string`, `uploadFromUrl` retorna `number | string`, ambos usados consistentemente en `import.ts`. `ScrapedAward.dogName` siempre presente; el JSON intermedio lo exige (`z.string().min(1)`). El campo en Payload (`Exposicione.awards[].dogName`) es opcional, pero al importar siempre lo escribimos cuando existe.
