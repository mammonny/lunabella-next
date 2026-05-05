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
