import { Schema, model, models } from 'mongoose'

const PevSchema = new Schema({
  nome: String,
  descricao: String,
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
})

PevSchema.index({ localizacao: '2dsphere' })

export const Pev = models.Pev || model('Pev', PevSchema)
