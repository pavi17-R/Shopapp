// ============================================================
// FILE: backend/routes/authRoutes.js
// PURPOSE: Maps URL endpoints to auth controller functions.
// Routes are the "address" — controllers are the "handler".
// ============================================================

const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no token needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (token required — authMiddleware runs first)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
