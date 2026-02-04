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
  const updates: any = { ...data }
  
  if (data.latitude !== undefined || data.longitude !== undefined) {
    updates.localizacao = {
      type: 'Point',
      coordinates: [
        data.longitude !== undefined ? Number(data.longitude) : 0,
        data.latitude !== undefined ? Number(data.latitude) : 0
      ]
    }
    delete updates.latitude
    delete updates.longitude
  }
  
  return Pev.findByIdAndUpdate(id, updates, { new: true })
}

export async function deletarPev(id: string) {
  return Pev.findByIdAndDelete(id)
}

export async function buscarPevPorId(id: string) {
  return Pev.findById(id)
}

export async function listarPevs() {
  return Pev.find()
}
