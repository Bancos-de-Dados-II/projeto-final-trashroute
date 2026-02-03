import { z } from 'zod'

export const pevSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().optional(),
  latitude: z.number(),
  longitude: z.number()
})