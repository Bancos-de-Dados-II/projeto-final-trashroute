import 'dotenv/config'

import app from './app'
import { connectMongo } from './config/mongo'
import pevRoutes from './routes/pev.routes'
import {swaggerSpec} from "./docs/swagger";
import swaggerUi from 'swagger-ui-express'

connectMongo().then(() => {
  console.log('✅ MongoDB conectado')
})

const PORT = process.env.PORT || 3333
app.use(pevRoutes)

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`Trash Route API rodando na porta ${PORT}`)
})
