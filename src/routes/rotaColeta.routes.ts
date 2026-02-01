import { Router } from 'express'
import * as controller from '../controllers/rotaColetaController'
import { auth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/rotas', controller.list)
router.post('/rotas', controller.create)
router.post('/rotas', auth, controller.create)

export default router
