const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Server error during registration' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    })
  } catch {
    res.status(500).json({ error: 'Server error during login' })
  }
})

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        createdAt: req.user.createdAt
      }
    })
  } catch {
    res.status(500).json({ error: 'Server error fetching profile' })
  }
})

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body
    const userId = req.user._id

    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } })
      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, username },
      { new: true, runValidators: true }
    )

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Server error updating profile' })
  }
})

module.exports = router
