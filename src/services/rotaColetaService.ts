import { RotaColeta } from '../models/mongo/RotaColeta'

export function criarRota(dados: any) {
  return RotaColeta.create(dados)
}

export function listarRotas() {
  return RotaColeta.find()
}
