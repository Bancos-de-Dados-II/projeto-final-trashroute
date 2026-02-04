import { Request, Response } from 'express'
import { User } from '../models/mongo/User'
import { tornarAdmin, deletarUsuario } from '../services/userService'

export async function listUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await User.find(
      {},
      {
        nome: 1,
        email: 1,
        role: 1,
        isAdmin: 1,
        createdAt: 1
      }
    )

    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários' })
  }
}

export async function promoverUsuario(req: Request, res: Response) {
  try {
    const { id } = req.params
    const adminId = (req as any).user?.id || (req as any).user?._id

    const updated = await tornarAdmin(id, adminId)

    if (!updated) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao promover usuário' })
  }
}

export async function excluirUsuario(req: Request, res: Response) {
  try {
    const { id } = req.params
    const adminId = (req as any).user?.id || (req as any).user?._id

    const deleted = await deletarUsuario(id, adminId)

    if (!deleted) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' })
  }
}
