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
