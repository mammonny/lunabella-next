import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function paraText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (!node.children) return ''
  return node.children.map(paraText).join('')
}

function onlyLineBreaks(node: LexicalNode): boolean {
  if (node.type !== 'paragraph') return false
  const kids = node.children ?? []
  if (kids.length === 0) return true
  return kids.every((c) => c?.type === 'linebreak')
}

const AGE_RE =
  /^(\d+\s*(años?|meses?)(\s+y\s+\d+\s*meses?)?|\d+\s*meses?\s+y\s+\d+\s*días?)$/i

function isAge(text: string): boolean {
  return AGE_RE.test(text.trim())
}

function isSelfName(text: string, name: string, apodo: string | null): boolean {
  const t = normalize(text.replace(/[.\s]+$/, ''))
  if (!t) return false
  const n = normalize(name)
  if (n && t === n) return true
  if (apodo) {
    const a = normalize(apodo)
    if (t === a) return true
    if (t === `(${a})`) return true
  }
  // bare "(...)" caption with apodo-like content
  const m = /^\(([^)]+)\)$/.exec(t)
  if (m && apodo && normalize(m[1]!) === normalize(apodo)) return true
  return false
}

function isJunkParagraph(node: LexicalNode, name: string, apodo: string | null): boolean {
  if (node.type !== 'paragraph') return false
  const text = paraText(node).trim()
  if (text.length === 0) return onlyLineBreaks(node) || true
  if (isAge(text)) return true
  if (isSelfName(text, name, apodo)) return true
  return false
}

async function main() {
  const dry = process.env.DRY === '1'
  console.log(`clean-descriptions ${dry ? '(DRY RUN)' : ''}`)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'ejemplares',
    limit: 1000,
    depth: 0,
  })

  let updated = 0
  let totalRemoved = 0
  for (const doc of docs as Array<{
    id: number | string
    name: string
    apodo?: string | null
    description?: unknown
  }>) {
    const description = doc.description as { root?: { children?: LexicalNode[] } } | undefined
    if (!description?.root?.children) continue
    const children = description.root.children
    const kept = children.filter((c) => !isJunkParagraph(c, doc.name, doc.apodo ?? null))
    const removed = children.length - kept.length
    if (removed === 0) continue

    const cleaned =
      kept.length === 0
        ? null
        : {
            ...description,
            root: { ...description.root, children: kept },
          }
    if (!dry) {
      await payload.update({
        collection: 'ejemplares',
        id: doc.id,
        data: { description: cleaned } as never,
        context: { disableRevalidate: true } as never,
      })
    }
    console.log(`✓ ${doc.name}: ${removed} paragraph(s) ${dry ? 'would be removed' : 'removed'}`)
    updated++
    totalRemoved += removed
  }
  console.log(`\n${dry ? '[dry] would update' : 'updated'} ${updated} ejemplares, ${totalRemoved} paragraphs total.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
