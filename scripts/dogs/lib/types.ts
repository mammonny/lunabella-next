import { z } from 'zod'

export const genderSchema = z.enum(['male', 'female'])

export const scrapedDogSchema = z.object({
  sourceUrl: z.string().url(),
  name: z.string().min(1),
  apodo: z.string().nullable(),
  slug: z.string().min(1),
  gender: genderSchema,
  birthDate: z.string().nullable(),
  featuredImageUrl: z.string().url().nullable(),
  galleryUrls: z.array(z.string().url()),
  contentHtml: z.string(),
})

export const scrapedDogsJsonSchema = z.object({
  scrapedAt: z.string(),
  dogs: z.array(scrapedDogSchema),
})

export type ScrapedDog = z.infer<typeof scrapedDogSchema>
export type ScrapedDogsJson = z.infer<typeof scrapedDogsJsonSchema>
