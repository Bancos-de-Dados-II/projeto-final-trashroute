import { EntregaReciclavel } from '../models/mongo/EntregaReciclavel'

export function criarEntrega(dados: {
  usuarioId: string
  pevId: string
  imagemUrl?: string
}) {
  return EntregaReciclavel.create({
    ...dados,
    pontos: 10
  })
}

export async function listarEntregasUsuario(usuarioId: string) {
  return EntregaReciclavel.find({ usuarioId })
  .populate({ path: 'pevId', select: 'nome' })
  .sort({ dataEntrega: -1 })
}