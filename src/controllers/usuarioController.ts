import { Request, Response } from 'express'
import { prisma } from '../database/prisma'

export async function listUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        return res.json(usuarios)
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao listar usuários'
        })
    }
}