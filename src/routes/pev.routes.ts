import { Router } from 'express'
import { createPev } from '../controllers/pevController'
import { auth } from '../middlewares/authMiddleware'

const router = Router()

router.post('/pevs', auth, createPev)

export default router
