import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { extractPost } from '../lib/extract-post.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixture = readFileSync(join(here, '../__fixtures__/sample-post.html'), 'utf8')
const sourceUrl = 'https://www.lunabella.es/archives/sample-post'

describe('extractPost', () => {
  it('extracts title', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.ok(post.title.length > 0, 'title must be non-empty')
  })

  it('extracts a parseable ISO date', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.ok(!Number.isNaN(Date.parse(post.date)), `date "${post.date}" must be parseable`)
  })

  it('extracts contentHtml that contains a paragraph', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.match(post.contentHtml, /<p[\s>]/i, 'contentHtml must contain at least one <p>')
  })

  it('returns dedup gallery without the featured image', () => {
    const post = extractPost(fixture, sourceUrl)
    const set = new Set(post.galleryUrls)
    assert.equal(set.size, post.galleryUrls.length, 'gallery must be deduped')
    if (post.featuredImageUrl) {
      assert.ok(
        !post.galleryUrls.includes(post.featuredImageUrl),
        'featured image should not appear in gallery',
      )
    }
  })

  it('produces a slug derived from the title', () => {
    const post = extractPost(fixture, sourceUrl)
    assert.match(post.slug, /^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with dashes')
  })
})
