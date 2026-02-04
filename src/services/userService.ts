import { User } from '../models/mongo/User'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'

export async function criarUsuario(dados: any) {
  try {
    const senhaHash = await bcrypt.hash(dados.senha, 10)

    if (dados.isAdmin === 's') {
      dados.isAdmin = 'n'
      logger.warn('Tentativa de auto-cadastro como admin bloqueada', {
        email: dados.email
      })
    }

    return await User.create({
      ...dados,
      senha: senhaHash
    })
  } catch (error: any) {
    logger.error('Erro ao criar usuário', { error: error.message })
    throw error
  }
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
  try {
    const user = await User.findByIdAndDelete(userId)

    logger.info('Usuário deletado', {
      userId,
      deletedBy: adminId
    })

    return user
  } catch (error: any) {
    logger.error('Erro ao deletar usuário', { error: error.message })
    throw error
  }
}
