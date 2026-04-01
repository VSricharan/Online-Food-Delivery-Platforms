const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/predictions', require('./routes/predictions'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/search', require('./routes/search'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
    console.log(`\n🚀 CloudPredict API running on http://localhost:${PORT}`)
    console.log(`   Health: http://localhost:${PORT}/api/health\n`)
})
