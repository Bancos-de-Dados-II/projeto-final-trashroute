import { Router } from 'express'
import * as controller from '../controllers/pevController'

const router = Router()

router.post('/pevs', controller.create)

router.get('/pevs', controller.list)

export default router
