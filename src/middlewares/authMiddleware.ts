import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        isAdmin: string;
        type?: string;
      }
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      logger.warn('Tentativa de acesso sem token')
      return res.status(401).json({
        status: 'error',
        message: 'Token não informado'
      })
    }
    
    const [, token] = authHeader.split(' ')
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      isAdmin: decoded.isAdmin,
      type: decoded.type
    }
    
    logger.info('Token verificado', { 
      userId: decoded.id, 
      email: decoded.email 
    })
    
    next()
    
  } catch (error: any) {
    logger.error('Token inválido', { error: error.message })
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado'
    })
  }
}