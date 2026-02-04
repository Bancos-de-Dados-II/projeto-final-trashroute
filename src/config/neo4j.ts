import neo4j from 'neo4j-driver'

const uri = process.env.NEO4J_URI
const user = process.env.NEO4J_USER
const password = process.env.NEO4J_PASSWORD

if (!uri) throw new Error('NEO4J_URI não definido no .env')
if (!user) throw new Error('NEO4J_USER não definido no .env')
if (!password) throw new Error('NEO4J_PASSWORD não definido no .env')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

export default driver
