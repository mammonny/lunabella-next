export interface DogCandidate {
  id: number | string
  name: string
  apodo?: string | null
}

const THRESHOLD = 2

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const m = a.length
  const n = b.length
  const prev: number[] = new Array(n + 1)
  const curr: number[] = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min((curr[j - 1] ?? 0) + 1, (prev[j] ?? 0) + 1, (prev[j - 1] ?? 0) + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j] ?? 0
  }
  return prev[n] ?? 0
}

export function matchDog(query: string, dogs: DogCandidate[]): DogCandidate | null {
  const q = normalize(query)
  if (!q) return null

  const exact = dogs.filter(
    (d) => normalize(d.name) === q || (d.apodo ? normalize(d.apodo) === q : false),
  )
  if (exact.length === 1) return exact[0] ?? null
  if (exact.length > 1) return null

  const scored = dogs
    .map((d) => {
      const dn = levenshtein(q, normalize(d.name))
      const da = d.apodo ? levenshtein(q, normalize(d.apodo)) : Infinity
      return { dog: d, score: Math.min(dn, da) }
    })
    .filter((x) => x.score <= THRESHOLD)
    .sort((a, b) => a.score - b.score)

  if (scored.length === 0) return null
  if (scored.length === 1) return scored[0]?.dog ?? null
  return null
}
