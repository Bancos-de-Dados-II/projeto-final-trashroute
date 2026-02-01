import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.resolve('uploads')))
app.use(routes)

export default app