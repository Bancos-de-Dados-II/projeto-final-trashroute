import { Request, Response, NextFunction } from 'express'

type JwtUser = {
  id: string
  role?: string
  isAdmin?: string
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as JwtUser | undefined

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Usuário não autenticado'
    })
  }

  const isAdminUser =
    user.role === 'ADMIN' || user.isAdmin === 's'

  if (!isAdminUser) {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Somente administradores podem acessar esta rota.'
    })
  }

  return next()
}
