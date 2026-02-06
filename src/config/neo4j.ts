import neo4j, { Driver, QueryResult } from 'neo4j-driver'

let driver: Driver | null = null

export function getNeo4jDriver() {
  if (driver) return driver

  const uri = process.env.NEO4J_URI
  const user = process.env.NEO4J_USER
  const password = process.env.NEO4J_PASSWORD

  if (!uri || !user || !password) {
    throw new Error('NEO4J env vars missing')
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  return driver
}

export async function neo4jWrite<T = unknown>(query: string, params: Record<string, any> = {}) {
  const d = getNeo4jDriver()
  const session = d.session()
  try {
    const res: QueryResult<T> = await session.executeWrite(tx => tx.run(query, params))
    return res
  } finally {
    await session.close()
  }
}

export async function neo4jRead<T = unknown>(query: string, params: Record<string, any> = {}) {
  const d = getNeo4jDriver()
  const session = d.session()
  try {
    const res: QueryResult<T> = await session.executeRead(tx => tx.run(query, params))
    return res
  } finally {
    await session.close()
  }
}

export async function neo4jClose() {
  if (!driver) return
  await driver.close()
  driver = null
}
