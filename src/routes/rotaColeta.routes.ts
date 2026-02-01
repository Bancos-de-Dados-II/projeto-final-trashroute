import { Router } from 'express'
import * as controller from '../controllers/rotaColetaController'

const router = Router()

router.post('/rotas', controller.create)
router.get('/rotas', controller.list)

export default router
