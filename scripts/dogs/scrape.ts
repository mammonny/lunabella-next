import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fetchHtml, loadCheerio } from '../exhibitions/lib/fetch-page.ts'
import { extractDogPost } from './lib/extract-dog-post.ts'
import { scrapedDogsJsonSchema, type ScrapedDog } from './lib/types.ts'

const ARCHIVE_BASE = 'https://www.lunabella.es/archives/category/nuestros-golden'
const OUTPUT_PATH = 'tmp/dogs-import.json'
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
    if (!/^https?:\/\/(?:www\.)?lunabella\.es\/archives\/(\d+)\/?$/.test(href)) return
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

async function scrapeOne(url: string): Promise<ScrapedDog | null> {
  console.log(`→ ${url}`)
  try {
    const { status, html } = await fetchHtml(url)
    if (status !== 200) {
      console.warn(`  skipped (status ${status})`)
      return null
    }
    const post = extractDogPost(html, url)
    if (!post) {
      console.warn(`  skipped (no .hentry)`)
      return null
    }
    if (post.category !== 'nuestros-golden') {
      console.log(`  skipped (category=${post.category})`)
      return null
    }
    const { category: _category, ...rest } = post
    return { sourceUrl: url, ...rest }
  } catch (err) {
    console.error(`  failed: ${err}`)
    return null
  }
}

async function main() {
  console.log('Fase 1 — scraping dogs')
  const urls = await gatherListing()
  console.log(`Found ${urls.length} URLs in archive listing`)

  const dogs: ScrapedDog[] = []
  for (const url of urls) {
    const result = await scrapeOne(url)
    if (result) dogs.push(result)
  }

  const output = { scrapedAt: new Date().toISOString(), dogs }
  scrapedDogsJsonSchema.parse(output)

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8')
  console.log(`\n✓ Wrote ${dogs.length} dogs to ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
