import { Pev } from '../models/mongo/Pev'
import { deletarPevNoGrafo, upsertPevNoGrafo } from './grafoService'

type CreatePevInput = {
  nome: string
  descricao?: string
  latitude: number
  longitude: number
}

export async function criarPev(data: CreatePevInput) {
  const pev = await Pev.create({
    nome: data.nome,
    descricao: data.descricao,
    localizacao: {
      type: 'Point',
      coordinates: [data.longitude, data.latitude]
    }
  })

  await upsertPevNoGrafo({
    id: pev._id.toString(),
    nome: pev.nome,
    descricao: pev.descricao,
    latitude: pev.localizacao.coordinates[1],
    longitude: pev.localizacao.coordinates[0]
  })

  return pev
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

  const pev = await Pev.findByIdAndUpdate(id, updates, { new: true })

  if (pev) {
    await upsertPevNoGrafo({
      id: pev._id.toString(),
      nome: pev.nome,
      descricao: pev.descricao,
      latitude: pev.localizacao.coordinates[1],
      longitude: pev.localizacao.coordinates[0]
    })
  }

  return pev
}

export async function deletarPev(id: string) {
  const pev = await Pev.findByIdAndDelete(id)

  if (pev) {
    await deletarPevNoGrafo(pev._id.toString())
  }

  return pev
}

export async function buscarPevPorId(id: string) {
  return Pev.findById(id)
}

export async function listarPevs() {
  return Pev.find()
}
