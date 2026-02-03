import { z } from 'zod'

export const userRegisterSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(['CIDADAO', 'EMPRESA', 'ONG', 'ADMIN']).optional()
})