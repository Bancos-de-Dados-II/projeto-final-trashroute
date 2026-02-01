import { Request, Response } from 'express'
import { criarPev, listarPevs } from '../services/pevService'

export async function create(req: Request, res: Response) {
  const pev = await criarPev(req.body)
  res.status(201).json(pev)
}

export async function list(req: Request, res: Response) {
  const pevs = await listarPevs()
  res.json(pevs)
}
