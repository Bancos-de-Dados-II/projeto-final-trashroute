import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { errorHandler } from './middlewares/errorMiddleware'
import logger from './utils/logger'

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  })
  next()
})

app.use('/uploads', express.static(path.resolve('uploads')))

app.use(express.static(path.resolve('frontend')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve('frontend/index.html'))
})

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve('frontend/admin.html'))
})

app.use(routes)

app.use(errorHandler)

export default app
