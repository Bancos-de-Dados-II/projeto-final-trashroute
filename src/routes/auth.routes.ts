import { Router } from 'express'
import * as controller from '../controllers/authController'

const router = Router()

router.post('/auth/register', controller.register)
router.post('/auth/login', controller.login)

export default router
