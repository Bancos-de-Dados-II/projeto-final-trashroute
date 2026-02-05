import { EntregaReciclavel } from '../models/mongo/EntregaReciclavel'
import {registrarEntregaReciclavelNoGrafo} from "./grafoService";

export async function criarEntrega(dados: {
  usuarioId: string
  pevId: string
  imagemUrl?: string
}) {
  const entrega = await EntregaReciclavel.create({
    ...dados,
    pontos: 10
  })

  await registrarEntregaReciclavelNoGrafo({
    entregaId: entrega._id.toString(),
    usuarioId: dados.usuarioId,
    pevId: dados.pevId,
    status: 'CONFIRMADA',
    pontos: entrega.pontos,
    dataEntrega: entrega.dataEntrega
  })

  return entrega
}

export async function listarEntregasUsuario(usuarioId: string) {
  return EntregaReciclavel.find({ usuarioId })
  .populate({ path: 'pevId', select: 'nome' })
  .sort({ dataEntrega: -1 })
}