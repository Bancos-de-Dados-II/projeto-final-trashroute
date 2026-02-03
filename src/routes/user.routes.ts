import { Router } from 'express'
import * as controller from '../controllers/usuarioController'
import { auth } from '../middlewares/authMiddleware'
import { isAdmin } from '../middlewares/adminMiddleware'

const router = Router()

router.get('/usuarios', auth, isAdmin, controller.listUsuarios)

export default router