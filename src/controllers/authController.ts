
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { criarUsuario, buscarPorEmail } from '../services/userService'
import logger from '../utils/logger'

export async function register(req: Request, res: Response) {
  try {
    const user = await criarUsuario(req.body)
    
    logger.info(`Usuário registrado: ${user.email}`, { userId: user._id })
    
    res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    })
  } catch (error: any) {
    logger.error('Erro no registro', { error: error.message })
    
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'Email já cadastrado'
      })
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor'
    })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body
    
    const user = await buscarPorEmail(email)
    
    if (!user) {
      logger.warn('Tentativa de login com email não cadastrado', { email })
      return res.status(401).json({
        status: 'error',
        message: 'Credenciais inválidas'
      })
    }
    
    const senhaValida = await bcrypt.compare(senha, user.senha)
    
    if (!senhaValida) {
      logger.warn('Tentativa de login com senha incorreta', { email })
      return res.status(401).json({
        status: 'error',
        message: 'Credenciais inválidas'
      })
    }

    // SEMPRE gerar token padrão
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        isAdmin: user.isAdmin,
        email: user.email 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )

    // SEMPRE gerar token TWS (mas só funcionará se isAdmin === 's')
    const tokenTWS = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        isAdmin: user.isAdmin,
        email: user.email,
        type: 'TWS_ADMIN' 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    logger.info('Login realizado com sucesso', { email, role: user.role })

    // SEMPRE retornar ambos os tokens
    res.json({
      status: 'success',
      message: 'Login realizado com sucesso',
      data: {
        token,           // Token normal para usuários
        tokenTWS,        // Token TWS para admins
        user: {
          id: user._id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        }
      }
    })
    
  } catch (error: any) {
    logger.error('Erro no login', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor'
    })
  }
}