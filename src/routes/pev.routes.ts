import { Router } from 'express'
import { Pev } from '../models/mongo/pev'
import { auth } from '../middlewares/authMiddleware'
import { createPev } from '../controllers/pevController'

const router = Router()

router.post('/pevs', auth, createPev)

router.get('/pevs', async (req, res) => {
  const pevs = await Pev.find()
  res.json(pevs)
})

export default router
