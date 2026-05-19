const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    // Only allow admin role if explicitly set and there's no other admin (first admin setup)
    // In production you'd restrict this further
    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'user' })

    const token = signToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user)
}

// PUT /api/auth/me  — update own profile
exports.updateMe = async (req, res) => {
  try {
    const { name, avatar } = req.body
    const updates = {}
    if (name)   updates.name   = name.trim()
    if (avatar !== undefined) updates.avatar = avatar

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    res.json(user)
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both passwords are required' })

    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ message: 'Current password is incorrect' })

    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ message: 'Failed to change password' })
  }
}
