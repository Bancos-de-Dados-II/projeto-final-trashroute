import { Router } from 'express'
import pevRoutes from './pev.routes'
import rotaColetaRoutes from './rotaColeta.routes'


const routes = Router()

routes.use(pevRoutes)
routes.use(rotaColetaRoutes)

routes.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

export default routes