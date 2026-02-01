import { Pev } from '../models/mongo/Pev'

export async function criarPev(dados: any) {
  return Pev.create(dados)
}

export async function listarPevs() {
  return Pev.find()
}