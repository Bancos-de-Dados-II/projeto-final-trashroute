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
