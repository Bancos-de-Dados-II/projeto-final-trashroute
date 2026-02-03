import { Pev } from '../models/mongo/Pev'

type CreatePevInput = {
  nome: string
  descricao?: string
  latitude: number
  longitude: number
}

export async function criarPev(data: CreatePevInput) {
  return Pev.create({
    nome: data.nome,
    descricao: data.descricao,
    localizacao: {
      type: 'Point',
      coordinates: [data.longitude, data.latitude]
    }
  })
}

export async function atualizarPev(id: string, data: any) {
  return Pev.findByIdAndUpdate(id, data, { new: true })
}

export async function deletarPev(id: string) {
  return Pev.findByIdAndDelete(id)
}

export async function buscarPevPorId(id: string) {
  return Pev.findById(id)
}
