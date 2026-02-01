import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  nome: String,
  email: {
    type: String,
    unique: true
  },
  senha: String,
  role: {
    type: String,
    enum: ['CIDADAO', 'EMPRESA', 'ONG', 'ADMIN'],
    default: 'CIDADAO'
  }
})

export const User = model('User', UserSchema)
