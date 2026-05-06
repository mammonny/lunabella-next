import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const USER_NAMES = [
  'JCh.Mad About You de Ria Vela',
  'Ch. Ashbury Angel Heart',
  'Ch. Taram Du Bois de la Rayère',
  'CH.Beangee Jumping Jack Flash',
  'CH. Alibren Mon Chéri Avec Stanrop',
  'Ashbury Summer Sun',
  'CH. Paudell Pure Passion',
  'CH. Ashbury Lovely Lisane',
  'Ch. Nativegold Diamond Forever to Ria Vela',
  'Ronjalee Ragamuffin At motlaisa JW',
  'Glenmoray Field Gunner JW',
  'CH. Kimwhany Optimist At Ronjalee',
  'Nativegold Apache',
  'CH. Hillbeth Queens Diplomat Of Twilly JW',
  'Tyrocoll Sioux of Nativegold',
  'Because I´m I Worth It De Ria Vela',
  'Jackralee Solstice Delaena',
  'Lichael Vivaldi',
  'Erinderry Diamond Edge Of Glenavis',
  'Marjamez Memories At Linchael',
  'Jackralee Mistletoe',
  'Linchael Conspiracy Of Chevanne',
  'Jackralee Misty Dawn',
  'Toscane Du Bois De La Rayere',
  'Beeangee Jumping Jack Flash',
  'Ritzilyn Cockney Robin',
  'Stanroph Sprin Breeze At Beeangee',
  'L´eau D´issei Du Bois De La Rayere',
  'Mabella James V.D. Beerse Hoeve',
  'Laika Noroy Du Plessy',
]

const TITLE_RE = /^\s*(j\.?\s*ch\.?|ch\.?)\s*/i

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[´'`’ʼ]/g, "'")
    .replace(TITLE_RE, '')
    .replace(/\s+jw\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const userSet = new Set(USER_NAMES.map(normalize))

type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

function paraText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  if (!node.children) return ''
  return node.children.map(paraText).join('')
}

function isShortNamePara(node: LexicalNode): boolean {
  if (node.type !== 'paragraph') return false
  const text = paraText(node).trim()
  if (!text || text.length > 80) return false
  // Reject multi-sentence narrative
  if (/[.!?]\s+\S/.test(text)) return false
  // Reject things that look like ages we want to keep (age-only lines are not "name-like")
  if (/^\d+\s*(años?|meses?)(\s+y\s+\d+\s*meses?)?$/i.test(text)) return false
  return true
}

function classify(node: LexicalNode): 'yes' | 'maybe' | 'no' {
  if (node.type !== 'paragraph') return 'no'
  const text = paraText(node).trim()
  if (!text) return 'no'
  const norm = normalize(text)
  if (userSet.has(norm)) return 'yes'
  if (TITLE_RE.test(text)) return 'yes'
  if (isShortNamePara(node)) return 'maybe'
  return 'no'
}

function cleanDescription(desc: { root: { children: LexicalNode[] } }) {
  const children = desc.root.children
  const drop = new Array<boolean>(children.length).fill(false)

  // Pass 1: explicit yeses
  const tags = children.map(classify)
  for (let i = 0; i < children.length; i++) {
    if (tags[i] === 'yes') drop[i] = true
  }

  // Pass 2: promote contiguous runs of "maybe" when both bordering paragraphs are "yes".
  // This catches lineage names without title prefixes (e.g. "Glenmoray Michaela") that
  // sit between titled lineage entries, while leaving edge "maybe"s alone (e.g. "1 año"
  // at index 0 with only a right-side yes).
  for (let i = 0; i < children.length; ) {
    if (tags[i] !== 'maybe') {
      i++
      continue
    }
    let j = i
    while (j < children.length && tags[j] === 'maybe') j++
    // Run is [i, j-1]. Borders: i-1 and j.
    const leftYes = i > 0 && tags[i - 1] === 'yes'
    const rightYes = j < children.length && tags[j] === 'yes'
    if (leftYes && rightYes) {
      for (let k = i; k < j; k++) drop[k] = true
    }
    i = j
  }

  // Trim trailing empty / line-break-only paragraphs that may be left over
  const kept = children.filter((_, i) => !drop[i])
  while (kept.length > 0) {
    const last = kept[kept.length - 1]!
    const txt = paraText(last).trim()
    const onlyLineBreaks =
      last.type === 'paragraph' &&
      (last.children ?? []).every((c) => c?.type === 'linebreak')
    if (txt.length === 0 && onlyLineBreaks) kept.pop()
    else break
  }

  return {
    cleaned: { ...desc, root: { ...desc.root, children: kept } },
    removed: children.length - kept.length,
  }
}

async function main() {
  const dry = process.env.DRY === '1'
  console.log(`strip-lineage ${dry ? '(DRY RUN)' : ''}`)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'ejemplares',
    limit: 1000,
    depth: 0,
  })

  let totalRemoved = 0
  let updated = 0
  for (const doc of docs as Array<{ id: number | string; name: string; description?: unknown }>) {
    const description = doc.description as { root?: { children?: LexicalNode[] } } | undefined
    if (!description?.root?.children) continue
    const { cleaned, removed } = cleanDescription(description as { root: { children: LexicalNode[] } })
    if (removed === 0) continue
    if (!dry) {
      await payload.update({
        collection: 'ejemplares',
        id: doc.id,
        data: { description: cleaned } as never,
        context: { disableRevalidate: true } as never,
      })
    }
    console.log(`✓ ${doc.name}: ${removed} paragraphs ${dry ? 'would be removed' : 'removed'}`)
    totalRemoved += removed
    updated++
  }
  console.log(`\n${dry ? '[dry] would update' : 'updated'} ${updated} ejemplares, ${totalRemoved} paragraphs total.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
