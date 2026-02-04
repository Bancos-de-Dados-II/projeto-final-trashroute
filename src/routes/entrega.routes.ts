import { Router } from 'express'
import * as controller from '../controllers/entregaController'
import { auth } from '../middlewares/authMiddleware'
import { upload } from '../config/upload'

const router = Router()

router.post(
  '/entregas',
  auth,
  upload.single('imagem'),
  controller.create
)

router.get(
  '/entregas/minhas',
  auth,
  controller.listMine
)



export default router
