import { Schema, model } from 'mongoose'

const RotaColetaSchema = new Schema({
  nome: String,
  tipo: {
    type: String,
    enum: ['COMUM', 'SELETIVA']
  },
  diasSemana: [String],
  horarioInicio: String,
  horarioFim: String,
  trajeto: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  }
})

RotaColetaSchema.index({ trajeto: '2dsphere' })

export const RotaColeta = model('RotaColeta', RotaColetaSchema)
