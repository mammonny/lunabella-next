import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '@payload-config'
import { scrapedDogsJsonSchema, type ScrapedDog } from './lib/types.ts'
import { htmlToLexical } from '../exhibitions/lib/html-to-lexical.ts'
import { uploadFromUrl } from '../exhibitions/lib/upload-media.ts'
import type { DogCandidate } from '../exhibitions/lib/fuzzy-match-dog.ts'

function normalize(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function exactMatch(query: string, dogs: DogCandidate[]): DogCandidate | null {
  const q = normalize(query)
  if (!q) return null
  return (
    dogs.find((d) => normalize(d.name) === q || (d.apodo && normalize(d.apodo) === q)) ?? null
  )
}

const INPUT_PATH = 'tmp/dogs-import.json'

async function loadExistingDogs(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<DogCandidate[]> {
  const result = await payload.find({
    collection: 'ejemplares',
    limit: 1000,
    depth: 0,
  })
  return result.docs
    .filter((d) => d.name && d.name.trim().length > 0)
    .map((d) => ({ id: d.id, name: d.name, apodo: d.apodo ?? null }))
}

async function importOne(
  payload: Awaited<ReturnType<typeof getPayload>>,
  dog: ScrapedDog,
  existing: DogCandidate[],
): Promise<'created' | 'skipped' | 'failed'> {
  // Skip si ya existe por nombre exacto o apodo exacto (case-insensitive, sin tildes)
  const m = exactMatch(dog.name, existing) ?? (dog.apodo ? exactMatch(dog.apodo, existing) : null)
  if (m) {
    console.log(`⏭  ${dog.apodo ?? dog.name} (already exists as "${m.name}")`)
    return 'skipped'
  }

  if (!dog.featuredImageUrl) {
    console.error(`✗ ${dog.apodo ?? dog.name}: no featuredImageUrl`)
    return 'failed'
  }

  let mainImageId: number | string
  try {
    mainImageId = await uploadFromUrl(payload, dog.featuredImageUrl, dog.name)
  } catch (err) {
    console.error(`✗ ${dog.apodo ?? dog.name}: featured image upload failed: ${err}`)
    return 'failed'
  }

  const gallery: { image: number | string; caption?: string }[] = []
  for (const url of dog.galleryUrls) {
    try {
      const id = await uploadFromUrl(payload, url, dog.name)
      gallery.push({ image: id })
    } catch (err) {
      console.warn(`  ⚠ gallery image skipped (${url}): ${err}`)
    }
  }

  const description = await htmlToLexical(dog.contentHtml, payload)

  await payload.create({
    collection: 'ejemplares',
    data: {
      name: dog.name,
      apodo: dog.apodo,
      gender: dog.gender,
      breedingStatus: 'retired',
      birthDate: dog.birthDate,
      mainImage: mainImageId,
      description,
      gallery,
      _status: 'draft',
    } as never,
    draft: true,
  })

  console.log(`✓ ${dog.apodo ?? dog.name} (${gallery.length} gallery imgs)`)
  return 'created'
}

async function main() {
  console.log('Fase 2 — import dogs')
  const raw = await readFile(INPUT_PATH, 'utf8')
  const data = scrapedDogsJsonSchema.parse(JSON.parse(raw))

  const payload = await getPayload({ config })
  const existing = await loadExistingDogs(payload)
  console.log(`Loaded ${existing.length} existing Ejemplares for dedup`)

  let created = 0
  let skipped = 0
  let failed = 0
  for (const dog of data.dogs) {
    const result = await importOne(payload, dog, existing)
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
