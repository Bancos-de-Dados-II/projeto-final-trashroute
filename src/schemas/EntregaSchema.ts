import { z } from 'zod'

export const entregaSchema = z.object({
  usuarioId: z.string().min(1),
  pevId: z.string().min(1),
  imagemUrl: z.string().optional(),
  pontos: z.number().int().nonnegative().default(0),
  status: z.enum(['PENDENTE', 'CONFIRMADA']).default('PENDENTE'),
  dataEntrega: z.coerce.date().optional()
})