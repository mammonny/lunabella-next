export type AwardGrade = 'EXC' | 'MB' | 'B' | 'SUF'

export type ParsedAward = {
  grade: AwardGrade | null
  position: 1 | 2 | 3 | 4 | null
  accolades: string[]
}

const GRADE_RE = /\b(EXC|MB|B|SUF)\b(?:\s*([1-4])º?)?/i

const ACCOLADE_PATTERNS: RegExp[] = [
  /\bRBIS\b/i,
  /\bBIS\b/i,
  /Best\s*In\s*Show/i,
  /\bBOB\b/i,
  /Mejor\s+de\s+Raza/i,
  /\bBOG\b/i,
  /Mejor\s+de\s+Grupo/i,
  /Mejor\s+(Joven|Baby|Cachorro|Veterano|Muy\s*Cachorro)/i,
  /\bJCAC\b/i,
  /\bRCACIB\b/i,
  /\bCACIB\b/i,
  /\bRCAC\b/i,
  /\bCAC\b/i,
]

const DATE_PREFIX_RE = /^\s*\d{1,2}\/\d{1,2}\s*\(/
const GRADE_ONLY_RE = /^(EXC|MB|B|SUF)\s*[1-4]?º?$/i

export function parseAward(title: string | null | undefined): ParsedAward {
  const text = (title ?? '').trim()
  if (!text) return { grade: null, position: null, accolades: [] }

  const m = GRADE_RE.exec(text)
  let grade: AwardGrade | null = null
  let position: ParsedAward['position'] = null
  if (m) {
    grade = m[1]!.toUpperCase() as AwardGrade
    if (m[2]) position = Number(m[2]) as 1 | 2 | 3 | 4
  }

  const accolades: string[] = []
  const seen = new Set<string>()
  for (const raw of text.split(/[,.;]/)) {
    const tok = raw.trim()
    if (!tok) continue
    if (DATE_PREFIX_RE.test(tok)) continue
    if (GRADE_ONLY_RE.test(tok)) continue
    if (ACCOLADE_PATTERNS.some((re) => re.test(tok))) {
      const key = tok.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        accolades.push(tok)
      }
    }
  }

  return { grade, position, accolades }
}

export function shortAccolade(accolade: string): string {
  const a = accolade.trim()
  // Common normalisations for compactness
  if (/best\s*in\s*show/i.test(a) && !/rbis|reserve/i.test(a)) return 'BIS'
  if (/^rbis|reserve.*best.*in.*show/i.test(a)) return 'RBIS'
  if (/mejor\s+de\s+raza/i.test(a)) return 'BOB'
  if (/mejor\s+de\s+grupo/i.test(a)) {
    const grp = /grupo\s*(\d+)/i.exec(a)?.[1]
    return grp ? `BOG ${grp}` : 'BOG'
  }
  if (/mejor\s+muy\s*cachorro/i.test(a)) return 'Mejor Muy Cachorro'
  if (/bob\s+muy\s*cachorro/i.test(a)) return 'BOB Muy Cachorro'
  if (/bog\s+muy\s*cachorro/i.test(a)) return 'BOG Muy Cachorro'
  return a
}
