import { neo4jWrite } from '../config/neo4j'

type UserGrafoInput = {
  id: string
  nome: string
  email: string
  role: string
  pontos: number
  bairro?: string | null
}

// type PevGrafoInput = {
//   id: string
//   nome: string
//   descricao?: string | null
//   latitude: number
//   longitude: number
// }

// type EntregaGrafoInput = {
//   entregaId: string
//   usuarioId: string
//   pevId: string
//   status: 'PENDENTE' | 'CONFIRMADA'
//   pontos: number
//   dataEntrega: Date
// }

export async function upsertUserNoGrafo(input: UserGrafoInput) {
  const q = `
    MERGE (u:User {id: $id})
    SET u.nome = $nome,
        u.email = $email,
        u.role = $role,
        u.pontos = $pontos,
        u.bairro = $bairro
  `
  await neo4jWrite(q, {
    id: input.id,
    nome: input.nome,
    email: input.email,
    role: input.role,
    pontos: input.pontos ?? 0,
    bairro: input.bairro ?? null
  })
}

export async function upsertPevNoGrafo(input: {
  id: string
  nome: string
  descricao?: string | null
  latitude: number
  longitude: number
}) {
  const q = `
    MERGE (p:PEV {id: $id})
    SET p.nome = $nome,
        p.descricao = $descricao,
        p.lat = $lat,
        p.lon = $lon,
        p.loc = point({latitude: $lat, longitude: $lon})
  `
  await neo4jWrite(q, {
    id: input.id,
    nome: input.nome,
    descricao: input.descricao ?? null,
    lat: input.latitude,
    lon: input.longitude
  })
}

export async function registrarEntregaNoGrafo(input: {
  entregaId: string
  usuarioId: string
  pevId: string
  status: 'PENDENTE' | 'CONFIRMADA'
  pontos: number
  dataEntrega: Date
}) {
  const q = `
    MATCH (u:User {id: $usuarioId})
    MATCH (p:PEV {id: $pevId})
    MERGE (u)-[d:DELIVERED {idEntrega: $entregaId}]->(p)
    SET d.status = $status,
        d.pontos = $pontos,
        d.dataEntrega = datetime($dataEntrega)
    RETURN d.idEntrega AS entregaId
  `
  const res = await neo4jWrite(q, {
    usuarioId: input.usuarioId,
    pevId: input.pevId,
    entregaId: input.entregaId,
    status: input.status,
    pontos: input.pontos ?? 0,
    dataEntrega: input.dataEntrega.toISOString()
  })

  if (res.records.length === 0) {
    throw new Error('Neo4j: não criou relação DELIVERED (User/PEV não encontrados ou params inválidos)')
  }
}

export async function creditarPontosNoGrafoSeConfirmada(userId: string, pontos: number) {
  const q = `
    MATCH (u:User {id: $userId})
    SET u.pontos = coalesce(u.pontos, 0) + $pontos
  `
  await neo4jWrite(q, { userId, pontos })
}

export async function deletarPevNoGrafo(pevId: string) {
  const q = `
    MATCH (p:PEV {id: $id})
    DETACH DELETE p
  `
  await neo4jWrite(q, { id: pevId })
}