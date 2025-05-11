const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (example)
router.get('/me', authController.getMe);

module.exports = router;