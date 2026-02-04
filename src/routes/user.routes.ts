import { Router } from 'express'
import { listUsuarios} from '../controllers/usuarioController'
import { auth } from '../middlewares/authMiddleware'
import { isAdmin } from '../middlewares/adminMiddleware'

const router = Router()

router.get('/usuarios', auth, isAdmin, listUsuarios)

export default router
