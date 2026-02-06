import { EntregaReciclavel } from '../models/mongo/EntregaReciclavel'
import { registrarEntregaNoGrafo } from './grafoService'

export async function criarEntrega(dados: { usuarioId: string; pevId: string; imagemUrl?: string }) {
  const entrega = await EntregaReciclavel.create({ ...dados, pontos: 10 })

  console.log('ENTREGA Mongo:', entrega._id.toString(), entrega.usuarioId, entrega.pevId.toString())

  await registrarEntregaNoGrafo({
    entregaId: entrega._id.toString(),
    usuarioId: entrega.usuarioId,
    pevId: entrega.pevId.toString(),
    status: entrega.status,
    pontos: entrega.pontos,
    dataEntrega: entrega.dataEntrega
  })

  console.log('ENTREGA Neo4j OK:', entrega._id.toString())

  return entrega
}

export async function listarEntregasUsuario(usuarioId: string) {
  return EntregaReciclavel.find({ usuarioId })
    .populate({ path: 'pevId', select: 'nome' })
    .sort({ dataEntrega: -1 })
}
