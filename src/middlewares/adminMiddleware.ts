import { Request, Response, NextFunction } from 'express'

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any
  
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Usuário não autenticado'
    })
  }
  
  if (user.isAdmin !== 's' && user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Somente administradores podem acessar esta rota.'
    })
  }
  
  next()
}