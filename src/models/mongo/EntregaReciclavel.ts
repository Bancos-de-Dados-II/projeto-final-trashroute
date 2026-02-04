import { Schema, model } from 'mongoose'

const EntregaReciclavelSchema = new Schema({
  usuarioId: { type: String, required: true },
  pevId: { type: Schema.Types.ObjectId, ref: 'Pev', required: true },
  imagemUrl: String,
  pontos: { type: Number, default: 0 },
  status: { type: String, enum: ['PENDENTE', 'CONFIRMADA'], default: 'PENDENTE' },
  dataEntrega: { type: Date, default: Date.now }
})

export const EntregaReciclavel = model('EntregaReciclavel', EntregaReciclavelSchema)