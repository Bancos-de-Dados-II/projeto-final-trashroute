import { Request, Response } from 'express'
import { criarPev } from '../services/pevService'

export async function createPev(req: Request, res: Response) {
  const { nome, descricao, latitude, longitude } = req.body

  const pev = await criarPev({
    nome,
    descricao,
    latitude: Number(latitude),
    longitude: Number(longitude)
  })

  return res.status(201).json(pev)
}
