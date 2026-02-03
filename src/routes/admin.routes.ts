import { Router } from 'express'
import { auth } from '../middlewares/authMiddleware'
import { isAdmin } from '../middlewares/adminMiddleware'
import { tornarAdmin } from '../services/userService'
import logger from '../utils/logger'

const router = Router()

// para admin promover outro usuário a admin
router.post('/admin/promote/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params
    const adminId = req.user!.id
    
    const user = await tornarAdmin(userId, adminId)
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      })
    }
    
    res.json({
      status: 'success',
      message: 'Usuário promovido a administrador',
      data: user
    })
    
  } catch (error: any) {
    logger.error('Erro ao promover usuário', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor'
    })
  }
})

// para admin listar todos usuários
router.get('/admin/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-senha')
    
    res.json({
      status: 'success',
      count: users.length,
      data: users
    })
    
  } catch (error: any) {
    logger.error('Erro ao listar usuários', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor'
    })
  }
})

export default router