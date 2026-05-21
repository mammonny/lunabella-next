import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import * as XLSX from 'xlsx'

const CUTOFF = new Date('2026-05-10T23:59:59.999Z')
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000

function adjustDate(createdAt: string): Date {
  const d = new Date(createdAt)
  return d.getTime() <= CUTOFF.getTime() ? new Date(d.getTime() + FOUR_DAYS_MS) : d
}

function formatDate(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const all: any[] = []
  let page = 1
  while (true) {
    const res = await payload.find({
      collection: 'form-submissions',
      depth: 1,
      limit: 100,
      page,
      sort: 'createdAt',
    })
    all.push(...res.docs)
    if (!res.hasNextPage) break
    page++
  }

  console.log(`Total submissions: ${all.length}`)

  const fieldNames = new Set<string>()
  for (const sub of all) {
    for (const item of sub.submissionData ?? []) {
      if (item?.field) fieldNames.add(String(item.field))
    }
  }
  const fields = Array.from(fieldNames).sort()

  const rows = all.map((sub) => {
    const formTitle =
      typeof sub.form === 'object' && sub.form !== null ? sub.form.title : String(sub.form ?? '')
    const adjusted = adjustDate(sub.createdAt)
    const wasAdjusted = new Date(sub.createdAt).getTime() <= CUTOFF.getTime()

    const fieldValues: Record<string, string> = {}
    for (const item of sub.submissionData ?? []) {
      if (item?.field) fieldValues[String(item.field)] = String(item.value ?? '')
    }

    const row: Record<string, string> = {
      ID: String(sub.id),
      Formulario: String(formTitle),
      'Fecha de envío': formatDate(adjusted),
      'Ajuste +4d aplicado': wasAdjusted ? 'sí' : 'no',
      'Fecha original': formatDate(new Date(sub.createdAt)),
    }
    for (const f of fields) row[f] = fieldValues[f] ?? ''
    return row
  })

  const header = [
    'ID',
    'Formulario',
    'Fecha de envío',
    'Ajuste +4d aplicado',
    'Fecha original',
    ...fields,
  ]

  const ws = XLSX.utils.json_to_sheet(rows, { header })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions')

  const outDir = path.resolve('tmp')
  await mkdir(outDir, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 10)
  const outPath = path.join(outDir, `form-submissions-${stamp}.xlsx`)
  XLSX.writeFile(wb, outPath)

  console.log(`Wrote ${outPath}`)
  const adjustedCount = rows.filter((r) => r['Ajuste +4d aplicado'] === 'sí').length
  console.log(`Submissions con ajuste +4d: ${adjustedCount}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
