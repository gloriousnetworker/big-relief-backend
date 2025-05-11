const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

// Admin-only routes
router.get('/users', authenticate, isAdmin, adminController.getAllUsers);

module.exports = router;