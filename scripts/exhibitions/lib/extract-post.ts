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

const MONTHS_ES: Record<string, number> = {
  ene: 0, enero: 0,
  feb: 1, febrero: 1,
  mar: 2, marzo: 2,
  abr: 3, abril: 3,
  may: 4, mayo: 4,
  jun: 5, junio: 5,
  jul: 6, julio: 6,
  ago: 7, agosto: 7,
  sep: 8, sept: 8, septiembre: 8,
  oct: 9, octubre: 9,
  nov: 10, noviembre: 10,
  dic: 11, diciembre: 11,
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parseSpanishOrEnglishDate(text: string): string | null {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  const m = cleaned.match(/([A-Za-zÁ-ý]{3,})\s+(\d{1,2}),?\s+(\d{4})/)
  if (m) {
    const monthKey = m[1].toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    const month = MONTHS_ES[monthKey] ?? new Date(`${m[1]} 1, 2000`).getMonth()
    const day = parseInt(m[2], 10)
    const year = parseInt(m[3], 10)
    if (!Number.isNaN(month) && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(Date.UTC(year, month, day)).toISOString()
    }
  }
  const numeric = cleaned.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/)
  if (numeric) {
    const day = parseInt(numeric[1], 10)
    const month = parseInt(numeric[2], 10) - 1
    let year = parseInt(numeric[3], 10)
    if (year < 100) year += 2000
    return new Date(Date.UTC(year, month, day)).toISOString()
  }
  const direct = Date.parse(cleaned)
  if (!Number.isNaN(direct)) return new Date(direct).toISOString()
  return null
}

export function extractPost(html: string, sourceUrl: string): ExtractedPost {
  const $ = loadCheerio(html)

  const $post = $('.hentry').first().length ? $('.hentry').first() : $('article').first()

  let title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('h1.entry-title').first().text().trim() ||
    $('h2.entry-title').first().text().trim() ||
    $post.prevAll('h1, h2, h3, h4, h5, h6').first().text().trim() ||
    $post.find('h1, h2').first().text().trim() ||
    ''

  if (!title) {
    const titleTag = $('title').text().trim()
    const parts = titleTag.split(/[»>|]/).map((p) => p.trim()).filter(Boolean)
    title = parts[parts.length - 1] ?? titleTag
  }

  const $content = $post.find('.entry-content').first().length
    ? $post.find('.entry-content').first()
    : $post.find('.content').first().length
      ? $post.find('.content').first()
      : $post

  const contentHtml = $content.html()?.trim() ?? ''

  let date =
    $('meta[property="article:published_time"]').attr('content')?.trim() ||
    $('time.entry-date').attr('datetime')?.trim() ||
    $('time').first().attr('datetime')?.trim() ||
    null

  if (!date) {
    const metaText = $post.find('.postmetadata').first().text()
    const parsed = metaText ? parseSpanishOrEnglishDate(metaText) : null
    date = parsed
  }

  if (!date) {
    const headingText = $content.find('h1, h2, h3, h4').first().text()
    date = parseSpanishOrEnglishDate(headingText) ?? new Date().toISOString()
  }

  const featuredImageUrl =
    $('meta[property="og:image"]').attr('content')?.trim() ||
    $content.find('img').first().attr('src')?.trim() ||
    null

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
    date,
    juez,
    featuredImageUrl,
    galleryUrls,
    contentHtml,
  }
}
