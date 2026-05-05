import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fetchHtml, loadCheerio } from './lib/fetch-page.ts'
import { extractPost } from './lib/extract-post.ts'
import { scrapedJsonSchema, type ScrapedExhibition } from './lib/types.ts'

const ARCHIVE_BASE = 'https://www.lunabella.es/archives/category/exposiciones'
const OUTPUT_PATH = 'tmp/exhibitions-import.json'
const MAX_PAGES = 20

function normalizeUrl(href: string): string {
  return href.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
}

function collectPostUrls(html: string): string[] {
  const $ = loadCheerio(html)
  const urls = new Set<string>()
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim()
    if (!href) return
    const m = href.match(/^https?:\/\/(?:www\.)?lunabella\.es\/archives\/(\d+)\/?$/)
    if (!m) return
    urls.add(normalizeUrl(href))
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
    return { ...post, awards: [] }
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
