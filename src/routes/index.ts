import { Router } from 'express'
import pevRoutes from './pev.routes'


const routes = Router()

routes.use(pevRoutes)

routes.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

export default routes