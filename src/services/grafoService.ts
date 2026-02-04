import driver from '../config/neo4j'

export async function upsertUsuarioNoGrafo(params: {
  usuarioId: string
  nome?: string
  email?: string
  role?: string
  isAdmin?: string
  createdAt?: Date
}) {
  const session = driver.session()
  try {
    await session.run(
      `
      MERGE (u:User {mongoId: $usuarioId})
      SET u.nome = $nome,
          u.email = $email,
          u.role = $role,
          u.isAdmin = $isAdmin,
          u.createdAt = CASE WHEN $createdAt IS NULL THEN u.createdAt ELSE datetime($createdAt) END
      `,
      {
        usuarioId: params.usuarioId,
        nome: params.nome ?? null,
        email: params.email ?? null,
        role: params.role ?? null,
        isAdmin: params.isAdmin ?? null,
        createdAt: params.createdAt ? params.createdAt.toISOString() : null
      }
    )
  } finally {
    await session.close()
  }
}

export async function upsertPevNoGrafo(params: {
  pevId: string
  nome?: string
  descricao?: string
  latitude?: number
  longitude?: number
}) {
  const session = driver.session()
  try {
    await session.run(
      `
      MERGE (p:PEV {mongoId: $pevId})
      SET p.nome = $nome,
          p.descricao = $descricao,
          p.latitude = $latitude,
          p.longitude = $longitude
      `,
      {
        pevId: params.pevId,
        nome: params.nome ?? null,
        descricao: params.descricao ?? null,
        latitude: typeof params.latitude === 'number' ? params.latitude : null,
        longitude: typeof params.longitude === 'number' ? params.longitude : null
      }
    )
  } finally {
    await session.close()
  }
}

export async function registrarEntregaReciclavelNoGrafo(params: {
  entregaId: string
  usuarioId: string
  pevId: string
  status: 'PENDENTE' | 'CONFIRMADA'
  pontos: number
  dataEntrega: Date
}) {
  const session = driver.session()
  try {
    await session.run(
      `
      MERGE (u:User {mongoId: $usuarioId})
      MERGE (p:PEV {mongoId: $pevId})
      MERGE (u)-[r:FEZ_ENTREGA {entregaId: $entregaId}]->(p)
      SET r.status = $status,
          r.pontos = $pontos,
          r.dataEntrega = datetime($dataEntrega)
      `,
      {
        entregaId: params.entregaId,
        usuarioId: params.usuarioId,
        pevId: params.pevId,
        status: params.status,
        pontos: params.pontos,
        dataEntrega: params.dataEntrega.toISOString()
      }
    )
  } finally {
    await session.close()
  }
}

export async function deletarUsuarioNoGrafo(usuarioId: string) {
  const session = driver.session()
  try {
    await session.run(
      `
      MATCH (u:User {mongoId: $usuarioId})
      DETACH DELETE u
      `,
      { usuarioId }
    )
  } finally {
    await session.close()
  }
}

export async function deletarPevNoGrafo(pevId: string) {
  const session = driver.session()
  try {
    await session.run(
      `
      MATCH (p:PEV {mongoId: $pevId})
      DETACH DELETE p
      `,
      { pevId }
    )
  } finally {
    await session.close()
  }
}
