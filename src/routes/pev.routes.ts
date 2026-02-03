import { Router } from 'express'
import * as controller from '../controllers/pevController'
import { auth } from '../middlewares/authMiddleware'
import { isAdmin } from '../middlewares/adminMiddleware'
import { validate } from '../middlewares/validate'
import { pevSchema } from '../schemas/pevSchema'

const router = Router()

// apenas admins conseguem acessar
router.post('/pevs', 
  auth, 
  isAdmin, 
  validate(pevSchema), 
  controller.createPev
)

// apenas admins conseguem acessar
router.put('/pevs/:id', 
  auth, 
  isAdmin, 
  validate(pevSchema), 
  controller.updatePev
)

// apenas admins conseguem acessar
router.delete('/pevs/:id', 
  auth, 
  isAdmin, 
  controller.deletePev
)

// logados podem acessar
router.get('/pevs', auth, controller.listPevs)

router.get('/pevs/:id', auth, controller.getPevById)

export default router