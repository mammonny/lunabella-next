import 'dotenv/config'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'
import config from '@payload-config'

// @vercel/blob viene de transitivos; lo cargo por path para no añadir dep al package.json.
const require_ = createRequire(import.meta.url)
const { put, head, BlobNotFoundError } = require_(
  '/home/hisoka/Documentos/proyectos/lunabella-next/node_modules/.pnpm/@vercel+blob@2.3.1/node_modules/@vercel/blob/dist/index.js',
) as typeof import('@vercel/blob')

// Origen: store antiguo accesible públicamente (sin token necesario para leer).
const OLD_STORE_HOST = 'https://3xnujseeqou5z9gu.public.blob.vercel-storage.com'

type SizeRow = { filename?: string | null }

async function existsInDest(filename: string, destBaseUrl: string, token: string): Promise<boolean> {
  try {
    await head(`${destBaseUrl}/${encodeURIComponent(filename)}`, { token })
    return true
  } catch (e) {
    if (e instanceof BlobNotFoundError) return false
    throw e
  }
}

async function fetchOld(filename: string): Promise<{ buf: Buffer; mime: string } | null> {
  const url = `${OLD_STORE_HOST}/${encodeURIComponent(filename)}`
  const res = await fetch(url)
  if (!res.ok) return null
  const arrayBuf = await res.arrayBuffer()
  return {
    buf: Buffer.from(arrayBuf),
    mime: res.headers.get('content-type')?.split(';')[0]?.trim() || 'application/octet-stream',
  }
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN missing')
  const destStoreId = token.match(/^vercel_blob_rw_([a-zA-Z0-9]+)_/)?.[1]?.toLowerCase()
  if (!destStoreId) throw new Error('Token format unrecognised')
  const destBaseUrl = `https://${destStoreId}.public.blob.vercel-storage.com`
  console.log(`Destination store: ${destStoreId}`)

  const dry = process.env.DRY === '1'
  const limit = process.env.LIMIT ? Number(process.env.LIMIT) : undefined
  if (dry) console.log('(DRY RUN — no uploads)')
  if (limit) console.log(`(LIMIT — first ${limit} media rows)`)

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
  })

  const rows = limit ? docs.slice(0, limit) : docs
  const stats = { ok: 0, skipExists: 0, missingSrc: 0, fail: 0, totalFiles: 0 }

  for (const doc of rows as Array<{
    id: number | string
    filename?: string | null
    sizes?: Record<string, SizeRow> | null
  }>) {
    const targets: string[] = []
    if (doc.filename) targets.push(doc.filename)
    if (doc.sizes) {
      for (const v of Object.values(doc.sizes)) {
        if (v?.filename) targets.push(v.filename)
      }
    }

    for (const fname of targets) {
      stats.totalFiles++
      try {
        if (await existsInDest(fname, destBaseUrl, token)) {
          stats.skipExists++
          continue
        }
      } catch (e) {
        // Si head() peta por motivo distinto a NotFound, lo loggeo y sigo
        console.warn(`  head error ${fname}: ${e instanceof Error ? e.message : String(e)}`)
      }

      const src = await fetchOld(fname)
      if (!src) {
        stats.missingSrc++
        console.warn(`? ${fname} (no en store antiguo)`)
        continue
      }

      if (dry) {
        stats.ok++
        console.log(`  copy ${fname} (${src.buf.byteLength} bytes)`)
        continue
      }

      try {
        await put(fname, src.buf, {
          access: 'public',
          contentType: src.mime,
          addRandomSuffix: false,
          allowOverwrite: true,
          token,
        })
        stats.ok++
        console.log(`✓ ${fname}`)
      } catch (e) {
        stats.fail++
        console.error(`✗ ${fname}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
  }

  console.log(`\nTotals: ${JSON.stringify(stats)}`)
  process.exit(stats.fail > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
