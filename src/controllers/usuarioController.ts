import { Request, Response } from 'express'
import { User } from '../models/mongo/User'

export async function listUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await User.find(
      {},
      {
        nome: 1,
        email: 1,
        role: 1,
        createdAt: 1
      }
    )

    res.json(usuarios)
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao listar usuários'
    })
  }
}