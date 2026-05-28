import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/projects.routes'
import userRoutes from './routes/users.routes'
import referentRoutes from './routes/referents.routes'
import categoryRoutes from './routes/categories.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    },
    credentials: true,
}))

app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/referents', referentRoutes)
app.use('/api/categories', categoryRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'LIMINAL API running' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})