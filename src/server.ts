import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Trash Route API rodando na porta ${PORT}`)
})