import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { criarUsuario, buscarPorEmail } from '../services/userService'

export async function register(req: Request, res: Response) {
  const user = await criarUsuario(req.body)
  res.status(201).json(user)
}

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body

  const user = await buscarPorEmail(email)
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const senhaValida = await bcrypt.compare(senha, user.senha)
  if (!senhaValida) {
    return res.status(401).json({ error: 'Credenciais inválidas' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  )

  res.json({ token })
}
