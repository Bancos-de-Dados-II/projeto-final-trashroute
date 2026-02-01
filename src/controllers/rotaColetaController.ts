import { Request, Response } from 'express'
import * as service from '../services/rotaColetaService'

export async function create(req: Request, res: Response) {
  const rota = await service.criarRota(req.body)
  res.status(201).json(rota)
}

export async function list(req: Request, res: Response) {
  const rotas = await service.listarRotas()
  res.json(rotas)
}
