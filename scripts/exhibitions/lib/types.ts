import { z } from 'zod'

export const awardPositionSchema = z.enum(['first', 'second', 'third', 'special', 'other'])

export const scrapedAwardSchema = z.object({
  dogName: z.string().min(1),
  title: z.string().min(1),
  position: awardPositionSchema.optional(),
  _aiExtracted: z.literal(true).optional(),
})

export const scrapedExhibitionSchema = z.object({
  sourceUrl: z.string().url(),
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string(),
  juez: z.string().nullable(),
  featuredImageUrl: z.string().url().nullable(),
  galleryUrls: z.array(z.string().url()),
  contentHtml: z.string(),
  awards: z.array(scrapedAwardSchema),
})

export const scrapedJsonSchema = z.object({
  scrapedAt: z.string(),
  exhibitions: z.array(scrapedExhibitionSchema),
})

export type ScrapedAward = z.infer<typeof scrapedAwardSchema>
export type ScrapedExhibition = z.infer<typeof scrapedExhibitionSchema>
export type ScrapedJson = z.infer<typeof scrapedJsonSchema>
