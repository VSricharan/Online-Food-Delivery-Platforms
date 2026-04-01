const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const JWT_SECRET = 'cloudpredict_jwt_secret_2026'
const USERS_FILE = path.join(__dirname, '../users.json')

// Seed default users on startup
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        const defaults = [
            { id: 1, name: 'Sricharan', email: 'sricharan@cloudpredict.ai', password: bcrypt.hashSync('1', 10), role: 'Admin' },
            { id: 2, name: 'Hamsa', email: 'hamsa@cloudpredict.ai', password: bcrypt.hashSync('Admin@2026', 10), role: 'Analyst' },
            { id: 3, name: 'Jayakumar', email: 'jayakumar@cloudpredict.ai', password: bcrypt.hashSync('Admin@2026', 10), role: 'ML Engineer' },
            { id: 4, name: 'Sampath', email: 'sampath@cloudpredict.ai', password: bcrypt.hashSync('Admin@2026', 10), role: 'Data Engineer' },
            { id: 5, name: 'Demo User', email: 'demo@cloudpredict.ai', password: bcrypt.hashSync('Demo@2026', 10), role: 'Viewer' },
        ]
        fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2))
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password)
            return res.status(400).json({ error: 'Name, email and password are required' })

        const users = loadUsers()
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
            return res.status(409).json({ error: 'An account with this email already exists' })

        const hashed = await bcrypt.hash(password, 10)
        const newUser = { id: Date.now(), name, email, password: hashed, role: 'Viewer' }
        users.push(newUser)
        saveUsers(users)

        const token = jwt.sign({ id: newUser.id, email, name, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' })
        res.status(201).json({ token, user: { id: newUser.id, name, email, role: newUser.role } })
    } catch (e) {
        res.status(500).json({ error: 'Registration failed' })
    }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body
        if (!email || !newPassword)
            return res.status(400).json({ error: 'Email and new password are required' })

        const users = loadUsers()
        const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

        if (userIndex === -1)
            return res.status(404).json({ error: 'No account found with this email' })

        // Hash the new password and save
        const hashed = await bcrypt.hash(newPassword, 10)
        users[userIndex].password = hashed
        saveUsers(users)

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (e) {
        res.status(500).json({ error: 'Password reset failed' })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' })

        const users = loadUsers()
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
        if (!user) return res.status(401).json({ error: 'Invalid email or password' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ error: 'Invalid email or password' })

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, institution: user.institution, settings: user.settings } })
    } catch (e) {
        res.status(500).json({ error: 'Login failed' })
    }
})

// GET /api/auth/me (verify token)
router.get('/me', (req, res) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
    try {
        const payload = jwt.verify(auth.slice(7), JWT_SECRET)
        const users = loadUsers()
        const user = users.find(u => u.id === payload.id)
        if (!user) return res.status(401).json({ error: 'User no longer exists' })
        
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, institution: user.institution, settings: user.settings } })
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
})

// PUT /api/auth/profile
router.put('/profile', (req, res) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
    try {
        const payload = jwt.verify(auth.slice(7), JWT_SECRET)
        const { name, email, role, institution, settings } = req.body
        
        const users = loadUsers()
        const userIndex = users.findIndex(u => u.id === payload.id)
        if (userIndex === -1) return res.status(404).json({ error: 'User not found' })

        // Check email uniqueness if email changed
        if (email && email !== users[userIndex].email) {
            const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== payload.id)
            if (emailExists) return res.status(409).json({ error: 'Email already in use' })
        }

        if (name) users[userIndex].name = name
        if (email) users[userIndex].email = email
        if (role) users[userIndex].role = role
        if (institution !== undefined) users[userIndex].institution = institution
        if (settings !== undefined) users[userIndex].settings = settings

        saveUsers(users)
        
        res.json({ user: { id: users[userIndex].id, name: users[userIndex].name, email: users[userIndex].email, role: users[userIndex].role, institution: users[userIndex].institution, settings: users[userIndex].settings } })
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
})

// DELETE /api/auth/delete-account
router.delete('/delete-account', async (req, res) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
    try {
        const payload = jwt.verify(auth.slice(7), JWT_SECRET)
        const { password } = req.body
        if (!password) return res.status(400).json({ error: 'Password is required to delete account' })

        const users = loadUsers()
        const user = users.find(u => u.id === payload.id)
        if (!user) return res.status(404).json({ error: 'User not found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({ error: 'Incorrect password' })

        const filteredUsers = users.filter(u => u.id !== payload.id)
        saveUsers(filteredUsers)
        res.status(200).json({ message: 'Account successfully deleted' })
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
})

module.exports = router
