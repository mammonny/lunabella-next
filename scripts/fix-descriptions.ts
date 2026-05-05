import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '@payload-config'
import { loadCheerio } from './exhibitions/lib/fetch-page.ts'
import { htmlToLexical } from './exhibitions/lib/html-to-lexical.ts'

const EXHIBITIONS_JSON = 'tmp/exhibitions-import.json'
const DOGS_JSON = 'tmp/dogs-import.json'

function cleanDogContent(contentHtml: string, name: string, apodo: string | null): string {
  const $ = loadCheerio(contentHtml)
  const target$ = $.root().children().length ? $.root() : $('body')
  void target$
  $('h1').each((_, el) => {
    const $el = $(el)
    if ($el.find('img').length > 0) return
    const text = $el.text().trim().replace(/\s+/g, ' ')
    if (!text) {
      $el.remove()
      return
    }
    if (text.replace(/\s+/g, ' ') === name.replace(/\s+/g, ' ')) {
      $el.remove()
      return
    }
    if (apodo && text === `(${apodo})`) {
      $el.remove()
      return
    }
    if (/^\([^)]+\)$/.test(text)) {
      $el.remove()
    }
  })
  return $.root().html() ?? contentHtml
}

function cleanExhibitionContent(contentHtml: string): string {
  const $ = loadCheerio(contentHtml)
  $('h3').each((_, el) => {
    const $el = $(el)
    if ($el.find('img').length > 0) return
    const text = $el.text().trim().replace(/\s+/g, ' ')
    if (!text) {
      $el.remove()
      return
    }
    if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(text)) {
      $el.remove()
      return
    }
    if (/^juez\s*[:]/i.test(text)) {
      $el.remove()
      return
    }
    if (/^Exposici[oó]n\s+(Nacional|Internacional)/i.test(text)) {
      $el.remove()
    }
  })
  return $.root().html() ?? contentHtml
}

async function fixExhibitions(payload: Awaited<ReturnType<typeof getPayload>>) {
  const raw = await readFile(EXHIBITIONS_JSON, 'utf8')
  const data = JSON.parse(raw) as { exhibitions: { slug: string; contentHtml: string }[] }
  let updated = 0
  let skipped = 0
  for (const exh of data.exhibitions) {
    const found = await payload.find({
      collection: 'exposiciones',
      where: { slug: { equals: exh.slug } },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0]
    if (!doc) {
      console.log(`⏭  ${exh.slug} (not in DB)`)
      skipped++
      continue
    }
    const cleaned = cleanExhibitionContent(exh.contentHtml)
    const lexical = await htmlToLexical(cleaned, payload)
    await payload.update({
      collection: 'exposiciones',
      id: doc.id,
      data: { description: lexical } as never,
      context: { disableRevalidate: true },
    })
    console.log(`✓ ${exh.slug}`)
    updated++
  }
  console.log(`Exposiciones — updated=${updated}, skipped=${skipped}`)
}

async function fixDogs(payload: Awaited<ReturnType<typeof getPayload>>) {
  const raw = await readFile(DOGS_JSON, 'utf8')
  const data = JSON.parse(raw) as {
    dogs: { slug: string; name: string; apodo: string | null; contentHtml: string }[]
  }
  let updated = 0
  let skipped = 0
  for (const dog of data.dogs) {
    const found = await payload.find({
      collection: 'ejemplares',
      where: { name: { equals: dog.name } },
      limit: 1,
      depth: 0,
    })
    const doc = found.docs[0]
    if (!doc) {
      console.log(`⏭  ${dog.slug} (not in DB by name="${dog.name}")`)
      skipped++
      continue
    }
    const cleaned = cleanDogContent(dog.contentHtml, dog.name, dog.apodo)
    const lexical = await htmlToLexical(cleaned, payload)
    await payload.update({
      collection: 'ejemplares',
      id: doc.id,
      data: { description: lexical } as never,
      context: { disableRevalidate: true },
    })
    console.log(`✓ ${dog.slug}`)
    updated++
  }
  console.log(`Ejemplares — updated=${updated}, skipped=${skipped}`)
}

async function main() {
  console.log('Fixing descriptions (heading cleanup)…')
  const payload = await getPayload({ config })
  await fixExhibitions(payload)
  await fixDogs(payload)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
