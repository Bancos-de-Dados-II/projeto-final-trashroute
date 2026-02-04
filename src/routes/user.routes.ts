import { Router } from 'express'
import { listUsuarios, promoverUsuario, excluirUsuario } from '../controllers/usuarioController'
import { auth } from '../middlewares/authMiddleware'
import { isAdmin } from '../middlewares/adminMiddleware'

const router = Router()

router.get('/usuarios', auth, isAdmin, listUsuarios)
router.patch('/usuarios/:id/admin', auth, isAdmin, promoverUsuario)
router.delete('/usuarios/:id', auth, isAdmin, excluirUsuario)

export default router
