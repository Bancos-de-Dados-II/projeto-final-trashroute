import { Request, Response } from 'express'
import { 
  criarPev, 
  atualizarPev, 
  deletarPev, 
  buscarPevPorId, 
  listarPevs 
} from '../services/pevService'
import logger from '../utils/logger'

export async function createPev(req: Request, res: Response) {
  try {
    const { nome, descricao, latitude, longitude } = req.body
    const adminId = req.user!.id
    
    const pev = await criarPev({
      nome,
      descricao,
      latitude: Number(latitude),
      longitude: Number(longitude)
    })
    
    logger.info('PEV criado', { 
      pevId: pev._id, 
      adminId,
      nome: pev.nome 
    })
    
    res.status(201).json({
      status: 'success',
      message: 'PEV criado com sucesso',
      data: pev
    })
    
  } catch (error: any) {
    logger.error('Erro ao criar PEV', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar PEV'
    })
  }
}

export async function updatePev(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { nome, descricao, latitude, longitude } = req.body
    const adminId = req.user!.id
    
    // Preparar os dados para atualização
    const updates: any = {}
    
    if (nome !== undefined) updates.nome = nome
    if (descricao !== undefined) updates.descricao = descricao
    if (latitude !== undefined) updates.latitude = Number(latitude)
    if (longitude !== undefined) updates.longitude = Number(longitude)
    
    const pev = await atualizarPev(id, updates)
    
    if (!pev) {
      return res.status(404).json({
        status: 'error',
        message: 'PEV não encontrado'
      })
    }
    
    logger.info('PEV atualizado', { pevId: id, adminId })
    
    res.json({
      status: 'success',
      message: 'PEV atualizado com sucesso',
      data: pev
    })
    
  } catch (error: any) {
    logger.error('Erro ao atualizar PEV', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar PEV'
    })
  }
}

export async function deletePev(req: Request, res: Response) {
  try {
    const { id } = req.params
    const adminId = req.user!.id
    
    const pev = await deletarPev(id)
    
    if (!pev) {
      return res.status(404).json({
        status: 'error',
        message: 'PEV não encontrado'
      })
    }
    
    logger.info('PEV deletado', { pevId: id, adminId })
    
    res.json({
      status: 'success',
      message: 'PEV deletado com sucesso'
    })
    
  } catch (error: any) {
    logger.error('Erro ao deletar PEV', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro ao deletar PEV'
    })
  }
}

export async function getPevById(req: Request, res: Response) {
  try {
    const { id } = req.params
    
    const pev = await buscarPevPorId(id)
    
    if (!pev) {
      return res.status(404).json({
        status: 'error',
        message: 'PEV não encontrado'
      })
    }
    
    res.json({
      status: 'success',
      data: pev
    })
    
  } catch (error: any) {
    logger.error('Erro ao buscar PEV', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar PEV'
    })
  }
}

export async function listPevs(req: Request, res: Response) {
  try {
    const pevs = await listarPevs()
    
    res.json({
      status: 'success',
      count: pevs.length,
      data: pevs
    })
    
  } catch (error: any) {
    logger.error('Erro ao listar PEVs', { error: error.message })
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar PEVs'
    })
  }
}