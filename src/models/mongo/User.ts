import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  nome: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['CIDADAO', 'EMPRESA', 'ONG', 'ADMIN'],
    default: 'CIDADAO'
  },
  isAdmin: {
    type: String,
    enum: ['s', 'n'],
    default: 'n',
    required: true
  },
  pontos: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})


export const User = model('User', UserSchema)