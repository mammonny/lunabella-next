import { loadCheerio } from '../../exhibitions/lib/fetch-page.ts'
import type { ScrapedDog } from './types.ts'

const ICON_MIN_DIMENSION = 300

const MONTHS_ES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, sept: 8, oct: 9, nov: 10, dic: 11,
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

function parseEsDate(text: string): string | null {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  const m = cleaned.match(/([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})/)
  if (m && m[1] && m[2] && m[3]) {
    const monthKey = m[1].toLowerCase().slice(0, 3)
    const month = MONTHS_ES[monthKey]
    if (month === undefined) return null
    const day = parseInt(m[2], 10)
    const year = parseInt(m[3], 10)
    if (!Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(Date.UTC(year, month, day)).toISOString()
    }
  }
  return null
}

const MALE_NICKS = new Set([
  'patrick', 'mike', 'thomas', 'luca', 'marco', 'pirlo', 'kyle', 'cooper', 'dylan',
])
const FEMALE_NICKS = new Set([
  'luna', 'maggie', 'toscana', 'chloe', 'bela', 'mia', 'giulia', 'maya', 'aria', 'rose',
])

function inferGender(apodo: string | null, name: string): 'male' | 'female' {
  const a = (apodo ?? '').toLowerCase().trim()
  if (MALE_NICKS.has(a)) return 'male'
  if (FEMALE_NICKS.has(a)) return 'female'
  // fallback: a-ending → female, o/e/consonant-ending → male
  const last = a.slice(-1)
  if (last === 'a' || last === 'e' || last === 'i') return 'female'
  return 'male'
}

export interface ExtractedDog extends Omit<ScrapedDog, 'sourceUrl'> {
  category: string
}

export function extractDogPost(html: string, sourceUrl: string): ExtractedDog | null {
  const $ = loadCheerio(html)

  const $post = $('.hentry').first()
  if (!$post.length) return null

  const cls = $post.attr('class') ?? ''
  const catMatch = cls.match(/category-([a-z0-9-]+)/)
  const category = catMatch?.[1] ?? 'unknown'

  const $content = $post.find('.content').first().length
    ? $post.find('.content').first()
    : $post.find('.entry-content').first()

  // Patrón A: <h1>NAME</h1> seguido de <h1>(APODO)</h1>
  const h1s = $content.find('h1').toArray()
  let name: string | null = null
  let apodo: string | null = null

  for (let i = 0; i < h1s.length; i++) {
    const txt = $(h1s[i]).text().trim().replace(/\s+/g, ' ')
    if (!txt) continue
    if (!name && !/^\(.*\)$/.test(txt)) {
      name = txt
      continue
    }
    if (name && /^\(.+\)$/.test(txt)) {
      apodo = txt.slice(1, -1).trim()
      break
    }
  }

  // Patrón B: <p>NAME.</p> seguido de <p>(APODO)</p>
  if (!name) {
    const ps = $content.find('p').toArray()
    for (let i = 0; i < ps.length - 1; i++) {
      const t1 = $(ps[i]).text().trim().replace(/\s+/g, ' ')
      const t2 = $(ps[i + 1]).text().trim().replace(/\s+/g, ' ')
      if (!t1 || !t2) continue
      if (/^[A-ZÁÉÍÓÚÑ][^.\n]{3,80}\.?$/.test(t1) && /^\(.+\)$/.test(t2)) {
        name = t1.replace(/\.$/, '').trim()
        apodo = t2.slice(1, -1).trim()
        break
      }
    }
  }

  // Fallback: usar h6 underlined como apodo, name vacío
  if (!name) {
    const h6 = $post.prevAll('h6.underlined').first().text().trim()
    if (h6) {
      apodo = h6
      name = h6 // usuario lo edita después
    } else {
      return null
    }
  }

  const featuredImageUrl =
    $content.find('img').first().attr('src')?.trim() || null

  const galleryUrls: string[] = []
  const seen = new Set<string>()
  $content.find('img').each((_, el) => {
    const $img = $(el)
    const src = ($img.attr('src') || '').trim()
    if (!src) return
    if (src.includes('tinymce') || src.includes('trans.gif')) return
    const w = parseInt($img.attr('width') ?? '', 10)
    const h = parseInt($img.attr('height') ?? '', 10)
    if (Number.isFinite(w) && w > 0 && w < ICON_MIN_DIMENSION) return
    if (Number.isFinite(h) && h > 0 && h < ICON_MIN_DIMENSION) return
    if (featuredImageUrl && src === featuredImageUrl) return
    if (seen.has(src)) return
    seen.add(src)
    galleryUrls.push(src)
  })

  let birthDate: string | null = null
  const meta = $post.parent().find('.postmetadata').first().text()
  if (meta) {
    birthDate = parseEsDate(meta)
  }

  const contentHtml = $content.html()?.trim() ?? ''

  return {
    name: name.replace(/\s+/g, ' '),
    apodo: apodo?.replace(/\s+/g, ' ') ?? null,
    slug: slugify(apodo ?? name),
    gender: inferGender(apodo, name),
    birthDate,
    featuredImageUrl,
    galleryUrls,
    contentHtml,
    category,
  }
}
