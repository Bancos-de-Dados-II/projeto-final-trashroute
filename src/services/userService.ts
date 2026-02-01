import { User } from '../models/mongo/User'
import bcrypt from 'bcrypt'

export async function criarUsuario(dados: any) {
  const senhaHash = await bcrypt.hash(dados.senha, 10)

  return User.create({
    ...dados,
    senha: senhaHash
  })
}

export function buscarPorEmail(email: string) {
  return User.findOne({ email })
}
