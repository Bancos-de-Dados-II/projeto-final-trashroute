import { User } from '../models/mongo/User'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'

import {deletarUsuarioNoGrafo, upsertUsuarioNoGrafo} from './grafoService'

export async function criarUsuario(dados: any) {
  const senhaHash = await bcrypt.hash(dados.senha, 10)

  if (dados.isAdmin === 's') {
    dados.isAdmin = 'n'
    logger.warn('Tentativa de auto-cadastro como admin bloqueada', { email: dados.email })
  }

  const user = await User.create({ ...dados, senha: senhaHash })

  await upsertUsuarioNoGrafo({
    usuarioId: user._id.toString(),
    nome: user.nome,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  })

  return user
}


export function buscarPorEmail(email: string) {
  return User.findOne({ email })
}

export function buscarPorId(id: string) {
  return User.findById(id)
}

export async function tornarAdmin(userId: string, adminId: string) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin: 's', role: 'ADMIN' },
      { new: true }
    )

    logger.info('Usuário promovido a admin', {
      userId,
      promotedBy: adminId
    })

    return user
  } catch (error: any) {
    logger.error('Erro ao promover usuário', { error: error.message })
    throw error
  }
}

export async function deletarUsuario(userId: string, adminId: string) {
  const user = await User.findByIdAndDelete(userId)

  if (user) {
    await deletarUsuarioNoGrafo(userId)
  }

  return user
}
