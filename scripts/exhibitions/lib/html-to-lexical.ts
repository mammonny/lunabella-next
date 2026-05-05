import { JSDOM } from 'jsdom'
import {
  convertHTMLToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

let cachedConfig: Awaited<ReturnType<typeof editorConfigFactory.default>> | null = null

export async function htmlToLexical(html: string, payload: Payload) {
  if (!cachedConfig) {
    cachedConfig = await editorConfigFactory.default({
      config: payload.config,
      parentIsLocalized: false,
    })
  }
  return convertHTMLToLexical({
    editorConfig: cachedConfig,
    html: html || '<p></p>',
    JSDOM: JSDOM as unknown as new (html: string) => { window: { document: Document } },
  })
}
