import { generateObject } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { z } from 'zod'
import type { ScrapedAward } from './types.ts'

const llmAwardSchema = z.object({
  dogName: z.string().min(1).describe('Nombre del perro tal como aparece en el texto'),
  title: z.string().min(1).describe('Título o premio (ej. CAC, CACIB, Mejor de Raza, BIS)'),
  position: z
    .enum(['first', 'second', 'third', 'special', 'other'])
    .optional()
    .describe('first/second/third para podio; special para mención; other si no encaja'),
})

const llmResponseSchema = z.object({
  awards: z.array(llmAwardSchema),
})

const SYSTEM = `Eres un asistente que extrae premios caninos de descripciones en HTML
provenientes de un blog antiguo de criadores de Golden Retriever.

Devuelve un array JSON de awards. Cada award:
- dogName: nombre del perro mencionado (literal, sin afijos)
- title: título obtenido (CAC, CACIB, Mejor de Raza, BIS, etc.)
- position: first/second/third si se trata de podio numérico, special para menciones, other para el resto

Si la descripción no menciona premios concretos, devuelve un array vacío.
Si un premio aplica a varios perros, genera un award por perro.
No inventes datos.`

export async function extractAwardsFromHtml(
  contentHtml: string,
  opts: { model?: string } = {},
): Promise<ScrapedAward[]> {
  const model = opts.model ?? 'anthropic/claude-sonnet-4-6'

  const text = contentHtml
    .replace(/<\/(p|div|h\d|li|br)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (text.length === 0) return []

  const { object } = await generateObject({
    model: gateway(model),
    schema: llmResponseSchema,
    system: SYSTEM,
    prompt: `Texto de la exposición:\n\n${text}`,
  })

  return object.awards.map((a) => ({ ...a, _aiExtracted: true as const }))
}
