import { Request, Response } from 'express'
import { criarEntrega, listarEntregasUsuario } from '../services/entregaService'

export async function create(req: Request, res: Response) {
  console.log('req.body:', req.body)
  console.log('req.file:', req.file)

  const usuarioId = req.user!.id
  const pevId = req.body.pevId

  if (!pevId) {
    return res.status(400).json({ status: 'error', message: 'pevId é obrigatório' })
  }

  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : undefined

  const entrega = await criarEntrega({
    usuarioId,
    pevId,
    imagemUrl
  })
  console.log(entrega)
  res.status(201).json({ status: 'success', data: entrega })
}

export async function listMine(req: Request, res: Response) {
  const usuarioId = req.user!.id
  const entregas = await listarEntregasUsuario(usuarioId)
  res.json({ 
    status: 'success', 
    data: entregas 
  })
}