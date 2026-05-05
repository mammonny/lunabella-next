import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { matchDog } from '../lib/fuzzy-match-dog.ts'

const dogs = [
  { id: 1, name: "Lunabella's Maya", apodo: 'Maya' },
  { id: 2, name: "Lunabella's Toby", apodo: null },
  { id: 3, name: "Lunabella's Aria", apodo: 'Ari' },
]

describe('matchDog', () => {
  it('exact name match', () => {
    assert.equal(matchDog("Lunabella's Maya", dogs)?.id, 1)
  })

  it('case-insensitive trim match', () => {
    assert.equal(matchDog("  lunabella's toby  ", dogs)?.id, 2)
  })

  it('matches by apodo', () => {
    assert.equal(matchDog('Maya', dogs)?.id, 1)
  })

  it('one-typo Levenshtein <=2 unique → matches', () => {
    assert.equal(matchDog("Lunabela's Maya", dogs)?.id, 1)
  })

  it('returns null when nothing close enough', () => {
    assert.equal(matchDog('Random Dog', dogs), null)
  })

  it('returns null when ambiguous (multiple within threshold)', () => {
    const ambiguous = [
      { id: 1, name: 'Maya', apodo: null },
      { id: 2, name: 'Mara', apodo: null },
    ]
    assert.equal(matchDog('Mxya', ambiguous), null)
  })
})
