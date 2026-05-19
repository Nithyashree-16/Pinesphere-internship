require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const connectDB = require('./config/db')

const authRoutes   = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const aiRoutes     = require('./routes/aiRoutes')

// Connect to MongoDB
connectDB()

const app = express()

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/ai',      aiRoutes)

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }))

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
