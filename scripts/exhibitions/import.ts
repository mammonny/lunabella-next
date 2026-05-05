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
    } as never,
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
