import { driver } from '../config/neo4j'

export async function criarRelacionamentoUsuarioPev(
  usuarioId: string, 
  pevId: string, 
  tipo: string
  ) {
  const session = driver.session()
  try {
    await session.run(
      `MATCH (u:User {id: $usuarioId})
       MATCH (p:Pev {id: $pevId})
       CREATE (u)-[:${tipo} {data: date()}]->(p)`,
      { usuarioId, pevId }
    )
  } finally {
    await session.close()
  }
}