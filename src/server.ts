import dotenv from 'dotenv'
import app from './app'
import { connectMongo } from './config/mongo'

dotenv.config()
connectMongo().then(() => {
  console.log('✅ MongoDB conectado')
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Trash Route API rodando na porta ${PORT}`)
})