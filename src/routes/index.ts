import { Router } from 'express'
import pevRoutes from './pev.routes'
import rotaColetaRoutes from './rotaColeta.routes'
import authRoutes from './auth.routes'
import entregaRoutes from './entrega.routes'
import usuarioRoutes from './user.routes'

const routes = Router()

routes.use(pevRoutes)
routes.use(rotaColetaRoutes)
routes.use(authRoutes)
routes.use(entregaRoutes)
routes.use(usuarioRoutes)

routes.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

export default routes
